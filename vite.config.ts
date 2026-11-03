import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Runs the Vercel functions in /api inside the Vite dev server, so `npm run dev`
 * is full-stack without `vercel dev`. Only the parts of VercelRequest/Response
 * that our handlers use are shimmed.
 */
function vercelApi(): Plugin {
  return {
    name: 'local-vercel-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''));
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const match = url.pathname.match(/^\/api\/([a-z-]+)$/);
        if (!match) return next();

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const raw = Buffer.concat(chunks).toString();

        const vreq = Object.assign(req, {
          query: Object.fromEntries(url.searchParams),
          body: raw ? JSON.parse(raw) : undefined,
        });
        const vres = Object.assign(res, {
          status(code: number) {
            res.statusCode = code;
            return vres;
          },
          json(data: unknown) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return vres;
          },
        });

        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.ts`);
          await mod.default(vreq, vres);
        } catch (err) {
          server.config.logger.error(String(err));
          if (!res.headersSent) vres.status(500).json({ error: 'Local API error' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), vercelApi()],
});
