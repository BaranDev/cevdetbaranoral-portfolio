import {
  Zap,
  Code2,
  Database,
  Cloud,
  Brain,
  Wrench,
  Palette,
  Compass,
  Brush,
  type LucideIcon,
} from "lucide-react";
import { AnimatedSection, AnimatedItem } from "../ui/animation";
import { SectionHeading, Chips, Chip } from "../ui/primitives";
import type { SkillCategory } from "../../types/portfolio";

const ICON_MAP: Record<string, LucideIcon> = {
  Languages: Code2,
  Frontend: Palette,
  Backend: Database,
  Databases: Database,
  "Cloud & DevOps": Cloud,
  "AI & ML": Brain,
  Tools: Wrench,
  "Also Familiar": Compass,
  Design: Brush,
};

const SkillsSection = ({
  skills,
}: {
  skills: Record<string, SkillCategory>;
}) => (
  <AnimatedSection id="skills" className="py-8">
    <SectionHeading>
      <Zap size={22} /> Technical Skills
    </SectionHeading>
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2 mt-4">
      {Object.entries(skills).map(([name, category]) => {
        const Icon = ICON_MAP[name] || Code2;
        return (
          <AnimatedItem key={name}>
            <div className="p-4 bg-card rounded-xl shadow-neumorphic">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className="text-primary" />
                <h4 className="font-heading m-0 text-primary text-[0.85rem] font-semibold">
                  {name}
                </h4>
              </div>
              <Chips>
                {category.skills.map((skill) => (
                  <Chip key={skill}>{skill}</Chip>
                ))}
              </Chips>
            </div>
          </AnimatedItem>
        );
      })}
    </div>
  </AnimatedSection>
);

export default SkillsSection;
