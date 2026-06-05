import { Briefcase } from "lucide-react";
import { AnimatedSection, AnimatedItem } from "../ui/animation";
import { SectionHeading, Chips, Chip } from "../ui/primitives";
import type { Experience } from "../../types/portfolio";

const ExperienceSection = ({ experience }: { experience: Experience[] }) => (
  <AnimatedSection id="experience" className="py-8">
    <SectionHeading>
      <Briefcase size={22} /> Experience
    </SectionHeading>
    <div className="relative mt-4 before:absolute before:left-[18px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-magical">
      {experience.map((job) => (
        <AnimatedItem key={job.id}>
          <div className="relative ml-[44px] my-2 p-4 bg-card rounded-xl shadow-neumorphic">
            <h3 className="font-heading text-primary m-0 mb-0.5 text-[0.95rem] font-semibold">
              {job.title}
            </h3>
            <div className="text-[0.78rem] text-secondary mb-1">
              {job.company} · {job.duration}
            </div>
            <p className="text-[0.82rem] text-text mb-1.5 leading-relaxed">
              {job.description}
            </p>
            <div className="mb-1.5">
              {job.achievements.map((a) => (
                <div
                  key={a.description}
                  className="flex items-center gap-2 mb-[3px] text-[0.8rem]"
                >
                  <span className="bg-primary/20 text-primary px-2 py-[2px] rounded font-bold text-[0.75rem] min-w-[48px] text-center">
                    {a.metric}
                  </span>
                  <span className="text-text">{a.description}</span>
                </div>
              ))}
            </div>
            <Chips>
              {job.technologies[0]?.items.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </Chips>
          </div>
        </AnimatedItem>
      ))}
    </div>
  </AnimatedSection>
);

export default ExperienceSection;
