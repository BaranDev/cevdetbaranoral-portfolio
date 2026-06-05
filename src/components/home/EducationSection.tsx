import { GraduationCap } from "lucide-react";
import { AnimatedSection, AnimatedItem } from "../ui/animation";
import { SectionHeading } from "../ui/primitives";
import type { Education } from "../../types/portfolio";

const EducationSection = ({ education }: { education: Education[] }) => (
  <AnimatedSection id="education" className="py-8">
    <SectionHeading>
      <GraduationCap size={22} /> Education
    </SectionHeading>
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-4">
      {education.map((edu) => (
        <AnimatedItem key={edu.degree}>
          <div className="p-4 bg-card rounded-xl shadow-neumorphic">
            <h3 className="font-heading text-primary m-0 mb-0.5 text-[0.9rem] font-semibold">
              {edu.degree}
            </h3>
            <div className="text-[0.78rem] text-secondary mb-1">
              {edu.school} · {edu.duration}
            </div>
            <div className="text-[0.75rem] text-accent font-medium flex flex-wrap gap-1.5 items-center">
              <span>GPA: {edu.gpa}</span>
              <span>·</span>
              <span>{edu.honors}</span>
            </div>
          </div>
        </AnimatedItem>
      ))}
    </div>
  </AnimatedSection>
);

export default EducationSection;
