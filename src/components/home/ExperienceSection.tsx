import { Briefcase } from "lucide-react";
import { AnimatedSection, AnimatedItem } from "../ui/animation";
import { SectionHeading, Chips, Chip } from "../ui/primitives";
import type { Experience } from "../../types/portfolio";

const ExperienceSection = ({ experience }: { experience: Experience[] }) => (
  <AnimatedSection id="experience" className="py-8">
    <SectionHeading>
      <Briefcase size={22} /> Experience
    </SectionHeading>
    <div className="flex flex-col gap-3 mt-4">
      {experience.map((job, jobIndex) => (
        <AnimatedItem key={job.id}>
          <div className="p-3.5 bg-card rounded-xl shadow-neumorphic flex gap-3.5">
            {job.logo && (
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                width={26}
                height={26}
                className="sprite-idle w-12 h-12 shrink-0 mt-1 select-none"
                style={{ animationDelay: `${jobIndex * 0.15}s` }}
                loading="lazy"
              />
            )}
            <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-heading text-primary m-0 text-[1.05rem] font-semibold">
                {job.title}
                <span className="font-body text-secondary font-normal text-[0.88rem]">
                  {" "}
                  · {job.company}
                </span>
              </h3>
              <span className="text-[0.82rem] text-secondary whitespace-nowrap">
                {job.duration}
              </span>
            </div>
            <p className="text-[0.92rem] text-text mt-1 mb-1.5 leading-relaxed">
              {job.description}
            </p>
            <Chips>
              {job.technologies[0]?.items.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </Chips>
            </div>
          </div>
        </AnimatedItem>
      ))}
    </div>
  </AnimatedSection>
);

export default ExperienceSection;
