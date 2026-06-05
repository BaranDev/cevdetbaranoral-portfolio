export interface ImpactMetric {
  value: string;
  label: string;
}

export interface Achievement {
  metric: string;
  description: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  start: string;
  end: string | null;
  description: string;
  achievements: Achievement[];
  technologies: { items: string[] }[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  duration: string;
  gpa: string;
  honors: string;
}

export interface ProjectMedia {
  image: string;
  demo: string;
  mock_demo?: string;
}

export interface Project {
  id: string;
  title: string;
  priority: string;
  award?: string;
  description: string;
  impact: { metrics: ImpactMetric[] };
  technologies: Record<string, string[]>;
  repo: string;
  status: string;
  media: ProjectMedia;
}

export interface SkillCategory {
  icon: string;
  skills: string[];
}

export interface QuickStats {
  yearsExperience: number;
  projectsCompleted: number;
  degreesEarned: number;
  hackathonAwards: number;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  website: string;
}

export interface Personal {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  profileImage: string;
  location: string;
  email: string;
  website: string;
  quickStats: QuickStats;
  socialLinks: SocialLinks;
}

export interface Language {
  name: string;
  level: string;
}

export interface PortfolioData {
  personal: Personal;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Record<string, SkillCategory>;
  certifications: string[];
  awards: string[];
  languages: Language[];
  meta: { version: number; generated: string };
}
