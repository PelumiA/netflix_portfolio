// queries/getTimeline.ts
import { TimelineItem } from '../types';

export async function getTimeline(): Promise<TimelineItem[]> {
  return [
    // Professional Experience
    {
      timelineType: 'work',
      name: 'Optafi',
      title: 'Cloud Infrastructure as Code Engineer',
      techStack: 'AWS, Azure, .NET, Angular, Terraform, WAF, SQL',
      summaryPoints: [
        'Developed multi-cloud PaaS with CRUD APIs using AWS and Azure SDKs',
        'Implemented WAF protections enforcing OWASP Top 10 controls',
        'Built Drift Detection Service for automated compliance remediation',
        'Designed Infrastructure as Code templating system for UI and Excel-based deployments',
      ],
      dateRange: '07/2025 - Present',
    },
    {
      timelineType: 'work',
      name: 'Dev Technology – CFTC',
      title: 'Principal System Architect',
      techStack: 'Terraform, Kubernetes, AWS, Azure, OIDC, CI/CD, PowerShell',
      summaryPoints: [
        'Led SSO modernization using OIDC with Terraform-based K8s infrastructure',
        'Defined containerization roadmap for legacy system modernization',
        'Built CloudWatch monitoring dashboards reducing incident response by 40%',
        'Integrated AI-driven monitoring and incident classification',
      ],
      dateRange: '11/2024 - 05/2025',
    },
    {
      timelineType: 'work',
      name: 'Microsoft – Substrate Intelligence',
      title: 'Azure Cloud Engineer 2',
      techStack: 'Azure DevOps, ARM/Bicep, AKS, Service Fabric, KQL, Python, PowerShell',
      summaryPoints: [
        'Architected CI/CD pipelines with ARM/Bicep deployments',
        'Managed Azure IaaS/PaaS including Data Lake, AKS, and Event Hubs',
        'Reduced deployment time by 35% through automation',
        'Maintained FedRAMP and SOC2 compliance across public and gov clouds',
        'Led disaster recovery testing with 100% uptime during failovers',
      ],
      dateRange: '12/2020 - 09/2024',
    },
    {
      timelineType: 'work',
      name: 'Boeing',
      title: 'Cloud Engineer',
      techStack: 'AWS, Terraform, Jenkins, Docker, Kubernetes, Python, TypeScript',
      summaryPoints: [
        'Led migration to AWS GovCloud increasing efficiency by 40%',
        'Designed microservices architecture on AWS EKS',
        'Automated infrastructure with Terraform and Jenkins CI/CD',
        'Developed serverless APIs using AWS CDK, Lambda, and DynamoDB',
      ],
      dateRange: '06/2017 - 09/2019',
    },
    // Research Experience
    {
      timelineType: 'work',
      name: 'UMBC – High Performance Computing Facility',
      title: 'Research Assistant',
      techStack: 'C, CUDA, Parallel Computing, CPU/GPU',
      summaryPoints: [
        'Collaborated to compare performance between computational methods',
        'Implemented 262% improvement using parallel CPU/GPU nodes to solve heat equations',
      ],
      dateRange: '07/2014',
    },
    {
      timelineType: 'work',
      name: 'University of Pittsburgh – Quality of Life Technology',
      title: 'Research Assistant',
      techStack: 'Android SDK, SolidWorks, 3D Modeling',
      summaryPoints: [
        'MG Wells Student Healthcare Entrepreneurship Competition Semi-Finalist',
        'Pioneered Android application reminder system for powered wheelchair users',
        'Created 3D wheelchair tutorial animations using SolidWorks',
      ],
      dateRange: '07/2015',
    },
    {
      timelineType: 'work',
      name: 'Penn State – Material Science & Engineering',
      title: 'Research Intern',
      techStack: 'LAMMPS, Molecular Dynamics, Simulation',
      summaryPoints: [
        'Awarded 2nd place out of 50 presentations at Symposium for Soft Materials Research',
        'Conducted molecular dynamic simulations of organic molecules (OMIMs) via LAMMPS',
        'Identified structural factors for optimal gas absorption materials',
      ],
      dateRange: '07/2012',
    },
    // Education
    {
      timelineType: 'education',
      name: 'University of Pittsburgh',
      title: 'Master of Science, Electrical Engineering',
      techStack: '',
      summaryPoints: ['Machine Learning research with JVM and MATLAB', 'Android development with neural networks'],
      dateRange: '12/2016',
    },
    {
      timelineType: 'education',
      name: 'University of Maryland, Baltimore County',
      title: 'Bachelor of Science, Computer Engineering',
      techStack: '',
      summaryPoints: ['Meyerhoff Scholar', 'HPC research with parallel CPU/GPU computing'],
      dateRange: '05/2015',
    },
  ];
}
