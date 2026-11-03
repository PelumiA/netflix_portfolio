import type { PlaylistId, Short } from './types';

export const channel = {
  name: 'Pelumi Adenikinju',
  fullName: 'Oluwapelumi Adenikinju',
  handle: '@pelumiade',
  title: 'Cloud Engineer / Solutions Architect',
  location: 'Houston, TX',
  avatar: '/media/headshot.png',
  email: 'pelumi.adeni@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pelumiade/',
  resume: 'https://drive.google.com/file/d/1UzN2bscQkproJW3SqfGbUtmr0u6ib9hF/view?usp=sharing',
  joined: 2012,
  tagline: '10+ years making clouds behave. AWS • Azure • Terraform • Kubernetes.',
  about:
    'Dynamic Cloud Engineer / Solutions Architect with 10 years of experience designing, deploying, and securing scalable infrastructure across Azure and AWS. Expert in CI/CD pipelines, infrastructure as code, Kubernetes orchestration, and building resilient automated infrastructure using GitOps and serverless patterns.',
  stats: [
    { value: '10+', label: 'years in cloud & DevOps' },
    { value: '2', label: 'clouds mastered' },
    { value: '5', label: 'certifications' },
    { value: '100%', label: 'uptime through failovers' },
  ],
};

export const playlists: Record<PlaylistId, { title: string; description: string }> = {
  work: { title: 'Career: the main series', description: 'Every full-time role, newest first.' },
  certs: { title: 'Certifications', description: 'Exams passed, badges earned.' },
  'side-projects': { title: 'Side projects', description: 'Things I built because I could not stop myself.' },
  research: { title: 'Research', description: 'HPC, machine learning and lab work.' },
  awards: { title: 'Awards & competitions', description: 'Podiums, semi-finals and a symposium.' },
  education: { title: 'Education', description: 'Degrees and the coffee that powered them.' },
};

export const shorts: Short[] = [
  { name: 'AWS', category: 'Cloud', description: 'EC2, Lambda, EKS, S3, CloudWatch, GovCloud', icon: 'FaAws', hue: 32 },
  { name: 'Azure', category: 'Cloud', description: 'AKS, Service Fabric, Data Lake, Event Hubs', icon: 'SiMicrosoftazure', hue: 205 },
  { name: 'Terraform', category: 'DevOps & IaC', description: 'Infrastructure as Code across AWS and Azure', icon: 'SiTerraform', hue: 265 },
  { name: 'Kubernetes', category: 'DevOps & IaC', description: 'Container orchestration with EKS and AKS', icon: 'SiKubernetes', hue: 220 },
  { name: 'Azure DevOps', category: 'DevOps & IaC', description: 'CI/CD pipelines, repos, artifacts', icon: 'SiAzuredevops', hue: 210 },
  { name: 'Docker', category: 'DevOps & IaC', description: 'Containerization and microservices', icon: 'FaDocker', hue: 200 },
  { name: 'Jenkins', category: 'DevOps & IaC', description: 'CI/CD pipeline automation', icon: 'SiJenkins', hue: 10 },
  { name: 'Ansible', category: 'DevOps & IaC', description: 'Configuration management and automation', icon: 'SiAnsible', hue: 0 },
  { name: 'Git', category: 'DevOps & IaC', description: 'Version control and GitOps workflows', icon: 'FaGit', hue: 15 },
  { name: 'Python', category: 'Languages', description: 'Automation, scripting, serverless functions', icon: 'SiPython', hue: 50 },
  { name: 'C#', category: 'Languages', description: '.NET applications and Azure SDKs', icon: 'SiCsharp', hue: 280 },
  { name: 'TypeScript', category: 'Languages', description: 'Type-safe JavaScript development', icon: 'SiTypescript', hue: 210 },
  { name: 'PowerShell', category: 'Languages', description: 'Windows automation and Azure management', icon: 'SiPowershell', hue: 225 },
  { name: 'React', category: 'Frameworks', description: 'Front-end UI development', icon: 'SiReact', hue: 190 },
  { name: 'Node.js', category: 'Frameworks', description: 'Server-side JavaScript runtime', icon: 'SiNodedotjs', hue: 120 },
  { name: '.NET', category: 'Frameworks', description: 'Enterprise application development', icon: 'SiDotnet', hue: 265 },
  { name: 'Angular', category: 'Frameworks', description: 'Enterprise front-end framework', icon: 'SiAngular', hue: 350 },
  { name: 'MongoDB', category: 'Databases', description: 'NoSQL document database', icon: 'SiMongodb', hue: 130 },
  { name: 'SQL', category: 'Databases', description: 'Relational database management', icon: 'SiMicrosoftsqlserver', hue: 0 },
  { name: 'Redis', category: 'Databases', description: 'In-memory caching and data store', icon: 'SiRedis', hue: 5 },
  { name: 'DynamoDB', category: 'Databases', description: 'AWS serverless NoSQL database', icon: 'SiAmazondynamodb', hue: 240 },
  { name: 'Prometheus', category: 'Observability', description: 'Metrics collection and alerting', icon: 'SiPrometheus', hue: 15 },
  { name: 'Grafana', category: 'Observability', description: 'Visualization and dashboards', icon: 'SiGrafana', hue: 30 },
  { name: 'FedRAMP / SOC2', category: 'Security', description: 'Government and enterprise compliance', icon: 'FaShieldAlt', hue: 150 },
];
