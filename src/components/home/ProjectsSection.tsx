import {
  FolderGit2,
  LayoutGrid,
  Trophy,
  ExternalLink,
  Zap,
  Github,
} from "lucide-react";
import { AnimatedSection, AnimatedItem } from "../ui/animation";
import { SectionHeading, Chips, Chip, Badge } from "../ui/primitives";
import type { Project } from "../../types/portfolio";
import type { ReactNode } from "react";

const ProjectLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-primary px-2.5 py-1 rounded border border-primary/30 transition-all duration-200 hover:bg-primary/15 hover:-translate-y-[1px]"
  >
    {children}
  </a>
);

const ProjectCard = ({ project }: { project: Project }) => (
  <AnimatedItem>
    <div
      className="p-4 bg-card rounded-xl shadow-neumorphic transition-all duration-300 hover:-translate-y-1 hover:animate-glow"
      aria-label={project.title}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-heading text-text m-0 text-[0.95rem] font-semibold">
          {project.title}
        </h3>
        <Badge>{project.status}</Badge>
      </div>
      {project.award && (
        <div className="text-[0.75rem] text-accent font-semibold mb-1.5 flex items-center gap-1">
          <Trophy size={13} />
          {project.award}
        </div>
      )}
      <p className="text-[0.8rem] text-text leading-relaxed my-1 mb-2">
        {project.description}
      </p>
      <div className="flex gap-2 my-2 flex-wrap">
        {project.impact.metrics.map((m) => (
          <div key={m.label} className="text-center min-w-[70px]">
            <div className="text-[0.85rem] font-bold text-primary font-heading">
              {m.value}
            </div>
            <div className="text-[0.6rem] text-secondary uppercase">
              {m.label}
            </div>
          </div>
        ))}
      </div>
      <Chips>
        {Object.values(project.technologies)
          .flat()
          .slice(0, 5)
          .map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
      </Chips>
      <div className="flex gap-1.5 mt-2">
        {project.media?.demo && (
          <ProjectLink href={project.media.demo}>
            <ExternalLink size={12} /> Live Site
          </ProjectLink>
        )}
        {project.media?.mock_demo && (
          <ProjectLink href={project.media.mock_demo}>
            <Zap size={12} /> Live Board Demo
          </ProjectLink>
        )}
        {project.repo && (
          <ProjectLink href={project.repo}>
            <Github size={12} /> Source
          </ProjectLink>
        )}
      </div>
    </div>
  </AnimatedItem>
);

const ProjectGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 mt-4">
    {children}
  </div>
);

const ProjectsSection = ({ projects }: { projects: Project[] }) => {
  const featured = projects.filter((p) => p.priority === "featured");
  const other = projects.filter((p) => p.priority !== "featured");

  return (
    <AnimatedSection id="projects" className="py-8">
      <SectionHeading>
        <FolderGit2 size={22} /> Featured Projects
      </SectionHeading>
      <ProjectGrid>
        {featured.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </ProjectGrid>

      {other.length > 0 && (
        <>
          <h3 className="flex items-center justify-center gap-2 font-heading text-secondary text-[1.05rem] font-semibold tracking-tight mt-8 mb-2 text-center">
            <LayoutGrid size={16} /> More Projects
          </h3>
          <ProjectGrid>
            {other.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </ProjectGrid>
        </>
      )}
    </AnimatedSection>
  );
};

export default ProjectsSection;
