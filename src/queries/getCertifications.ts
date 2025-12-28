// queries/getCertifications.ts
import { Certification } from '../types';

export async function getCertifications(): Promise<Certification[]> {
  return [
    {
      title: 'Azure AI Fundamentals AI-900',
      issuer: 'Microsoft',
      issuedDate: '10/2024',
      link: 'https://learn.microsoft.com/en-us/certifications/azure-ai-fundamentals/',
      iconName: 'SiMicrosoftazure',
    },
    {
      title: 'Certified Scrum Master',
      issuer: 'Scrum Alliance',
      issuedDate: '08/2022',
      link: 'https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster',
      iconName: 'FaUserTie',
    },
    {
      title: 'AWS Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issuedDate: '04/2020',
      link: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
      iconName: 'FaAws',
    },
    {
      title: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issuedDate: '03/2020',
      link: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
      iconName: 'FaAws',
    },
    {
      title: 'Google IT Automation with Python',
      issuer: 'Coursera / Google',
      issuedDate: '03/2020',
      link: 'https://www.coursera.org/professional-certificates/google-it-automation',
      iconName: 'FaGoogle',
    },
    {
      title: 'Full Stack Web Developer Bootcamp',
      issuer: 'Udemy',
      issuedDate: '10/2019',
      link: 'https://www.udemy.com/',
      iconName: 'SiUdemy',
    },
  ];
}
