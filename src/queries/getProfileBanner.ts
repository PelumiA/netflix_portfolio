// queries/getProfileBanner.ts
import { ProfileBanner } from '../types';

// PLACEHOLDER: Update resumeLink.url with hosted resume PDF URL
export async function getProfileBanner(): Promise<ProfileBanner> {
  return {
    backgroundImage: { url: '' }, // Background comes from browse page selection
    headline: 'OLUWAPELUMI ADENIKINJU',
    resumeLink: { url: '#' }, // PLACEHOLDER: Add hosted resume URL
    linkedinLink: 'https://www.linkedin.com/in/pelumiade/',
    profileSummary:
      'Dynamic Cloud Engineer / Solutions Architect with 10 years of experience designing, deploying, and securing scalable infrastructure across Azure and AWS. Expert in CI/CD pipelines, infrastructure as code, Kubernetes orchestration, and building resilient automated infrastructure using GitOps and serverless patterns.',
  };
}
