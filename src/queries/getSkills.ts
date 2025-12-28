// queries/getSkills.ts
import { Skill } from '../types';

export async function getSkills(): Promise<Skill[]> {
  return [
    // Cloud Platforms
    { name: 'AWS', category: 'Cloud Platforms', description: 'EC2, Lambda, EKS, S3, CloudWatch, GovCloud', icon: 'FaAws' },
    { name: 'Azure', category: 'Cloud Platforms', description: 'AKS, Service Fabric, Data Lake, Event Hubs', icon: 'SiMicrosoftazure' },
    { name: 'Azure DevOps', category: 'Cloud Platforms', description: 'CI/CD pipelines, repos, artifacts', icon: 'SiAzuredevops' },

    // Languages
    { name: 'Python', category: 'Languages', description: 'Automation, scripting, serverless functions', icon: 'FaPython' },
    { name: 'C#', category: 'Languages', description: '.NET applications and Azure SDKs', icon: 'SiCsharp' },
    { name: 'TypeScript', category: 'Languages', description: 'Type-safe JavaScript development', icon: 'SiTypescript' },
    { name: 'JavaScript', category: 'Languages', description: 'Frontend and Node.js development', icon: 'SiJavascript' },
    { name: 'PowerShell', category: 'Languages', description: 'Windows automation and Azure management', icon: 'SiPowershell' },

    // DevOps & IaC
    { name: 'Terraform', category: 'DevOps & IaC', description: 'Infrastructure as Code across AWS and Azure', icon: 'SiTerraform' },
    { name: 'Kubernetes', category: 'DevOps & IaC', description: 'Container orchestration with EKS and AKS', icon: 'SiKubernetes' },
    { name: 'Docker', category: 'DevOps & IaC', description: 'Containerization and microservices', icon: 'FaDocker' },
    { name: 'Jenkins', category: 'DevOps & IaC', description: 'CI/CD pipeline automation', icon: 'SiJenkins' },
    { name: 'Ansible', category: 'DevOps & IaC', description: 'Configuration management and automation', icon: 'SiAnsible' },
    { name: 'Git', category: 'DevOps & IaC', description: 'Version control and GitOps workflows', icon: 'FaGit' },

    // Databases
    { name: 'MongoDB', category: 'Databases', description: 'NoSQL document database', icon: 'SiMongodb' },
    { name: 'SQL', category: 'Databases', description: 'Relational database management', icon: 'SiMicrosoftsqlserver' },
    { name: 'Redis', category: 'Databases', description: 'In-memory caching and data store', icon: 'SiRedis' },
    { name: 'DynamoDB', category: 'Databases', description: 'AWS serverless NoSQL database', icon: 'SiAmazondynamodb' },

    // Frameworks
    { name: 'React', category: 'Frameworks', description: 'Frontend UI development', icon: 'FaReact' },
    { name: 'Node.js', category: 'Frameworks', description: 'Server-side JavaScript runtime', icon: 'FaNodeJs' },
    { name: '.NET', category: 'Frameworks', description: 'Enterprise application development', icon: 'SiDotnet' },
    { name: 'Angular', category: 'Frameworks', description: 'Enterprise frontend framework', icon: 'SiAngular' },

    // Monitoring & Security
    { name: 'CloudWatch', category: 'Monitoring & Security', description: 'AWS monitoring and observability', icon: 'FaAws' },
    { name: 'Azure Monitor', category: 'Monitoring & Security', description: 'Azure observability and KQL queries', icon: 'SiMicrosoftazure' },
    { name: 'Prometheus', category: 'Monitoring & Security', description: 'Metrics collection and alerting', icon: 'SiPrometheus' },
    { name: 'Grafana', category: 'Monitoring & Security', description: 'Visualization and dashboards', icon: 'SiGrafana' },
    { name: 'FedRAMP/SOC2', category: 'Monitoring & Security', description: 'Government and enterprise compliance', icon: 'FaShieldAlt' },
  ];
}
