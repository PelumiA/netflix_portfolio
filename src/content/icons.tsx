import type { IconType } from 'react-icons';
import {
  FaAws, FaMicrosoft, FaShieldAlt, FaGraduationCap, FaMedal, FaFlask, FaWheelchair,
  FaMicrochip, FaLock, FaTrophy, FaUserTie, FaGoogle, FaCloud, FaBuilding, FaDocker, FaGit,
} from 'react-icons/fa';
import {
  SiMicrosoftazure, SiAzuredevops, SiTerraform, SiKubernetes, SiSlack, SiSolidity, SiCplusplus,
  SiAndroid, SiPython, SiUdemy, SiOpensea, SiSelenium, SiJenkins, SiDotnet, SiPrometheus,
  SiGrafana, SiRedis, SiMongodb, SiAnsible, SiAngular, SiTypescript, SiJavascript, SiPowershell,
  SiCsharp, SiAmazondynamodb, SiMicrosoftsqlserver, SiNvidia, SiX, SiReact, SiNodedotjs,
} from 'react-icons/si';

// Explicit map (instead of `import * as`) keeps the bundle small.
export const icons = {
  FaAws, FaMicrosoft, FaShieldAlt, FaGraduationCap, FaMedal, FaFlask, FaWheelchair, FaMicrochip,
  FaLock, FaTrophy, FaUserTie, FaGoogle, FaCloud, FaBuilding, FaDocker, FaGit,
  SiMicrosoftazure, SiAzuredevops, SiTerraform, SiKubernetes, SiSlack, SiSolidity, SiCplusplus,
  SiAndroid, SiPython, SiUdemy, SiOpensea, SiSelenium, SiJenkins, SiDotnet, SiPrometheus,
  SiGrafana, SiRedis, SiMongodb, SiAnsible, SiAngular, SiTypescript, SiJavascript, SiPowershell,
  SiCsharp, SiAmazondynamodb, SiMicrosoftsqlserver, SiNvidia, SiX, SiReact, SiNodedotjs,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof icons;
