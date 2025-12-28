// queries/getProjects.ts
import { Project } from '../types';

// PLACEHOLDER: Replace image URLs with actual project screenshots
export async function getProjects(): Promise<Project[]> {
  return [
    {
      title: 'Slack Onboarding Bot',
      description:
        'Automated onboarding bot using Node.js and Slack Bolt framework that streamlines new user enrollment by detecting trigger phrases and creating group conversations with team mentors. Integrates Google Cloud APIs for personalized document generation.',
      techUsed: 'Node.js, Slack Bolt, Google Cloud APIs, REST API',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'May 2025',
    },
    {
      title: 'Netflix Clone - DevOps Pipeline',
      description:
        'Full DevOps implementation featuring AWS EC2 provisioning, Docker containerization, Jenkins CI/CD pipelines, SonarQube security scanning, and Kubernetes deployment with Prometheus/Grafana monitoring.',
      techUsed: 'Jenkins, Kubernetes, Docker, Prometheus, Grafana, SonarQube, AWS EC2',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'Feb 2024',
    },
    {
      title: 'Cryptopunk NFT Marketplace',
      description:
        'Dynamic NFT marketplace frontend built with React JS, reading collections from OpenSea on Rinkeby test network. Displays owner info, traits, price, and properties with Metamask authentication.',
      techUsed: 'React, OpenSea API, Metamask, Web3',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'Apr 2022',
    },
    {
      title: 'Felt Zine Canvas NFT Collection',
      description:
        'Generative art NFT collection of 500 unique pieces with gif, video, and picture layers randomly combined using Python. Smart contracts written in Solidity. Sold out collection.',
      techUsed: 'Python, Solidity, NFT, Ethereum',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'Feb 2022',
    },
    {
      title: 'Twitter Mention Bots',
      description:
        'Serverless Twitter bots using Python and AWS Lambda. Ratio Checker determines if replies have more engagement than original tweets. Unraveller finds and returns first quoted tweet in a thread.',
      techUsed: 'Python, AWS Lambda, Twitter API',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'Jul 2021',
    },
    {
      title: 'Instagram Unfollower Bot',
      description:
        'Automated bot using Python, Instagram API and Selenium to create a list of accounts not following you back and unfollow them programmatically.',
      techUsed: 'Python, Instagram API, Selenium',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'Apr 2021',
    },
    {
      title: 'Machine Learning Cell Profiling',
      description:
        'University of Pittsburgh research project utilizing JVM, MATLAB and Machine Learning techniques to create profiles of various yeast cells in populations of 10,000+. Distinguished cells using quadratic SVMs by modifying dielectrophoresis force algorithm.',
      techUsed: 'MATLAB, JVM, Machine Learning, SVM',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'Apr 2016',
    },
    {
      title: 'Neural Network Lock Screen',
      description:
        'Android security application as a lock screen replacement using neural networks, finger pressure and drawing speed to learn user habits and make passwords personal.',
      techUsed: 'Android SDK, Java, Neural Networks',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'Apr 2016',
    },
    {
      title: "Tomasulo's Algorithm Simulator",
      description:
        'C++ program recreating Tomasulo\'s algorithm for out-of-order execution in computer architecture, developed as a University of Pittsburgh final project.',
      techUsed: 'C++, Computer Architecture',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'Dec 2015',
    },
    {
      title: 'PONG Game on FPGA',
      description:
        'Recreated classic PONG game using Verilog to manipulate VGA signals, drawing the paddle and ball by programming a Spartan 3E FPGA.',
      techUsed: 'Verilog, FPGA, Spartan 3E, VGA',
      image: { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/embeddedc/embeddedc-original.svg' }, // PLACEHOLDER: Replace with screenshot
      date: 'Apr 2015',
    },
  ];
}
