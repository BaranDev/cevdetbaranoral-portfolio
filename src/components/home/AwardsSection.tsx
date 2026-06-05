import { Award, Trophy, FileText } from "lucide-react";
import { AnimatedSection, AnimatedItem } from "../ui/animation";
import { SectionHeading } from "../ui/primitives";

const AwardsSection = ({
  awards,
  certifications,
}: {
  awards: string[];
  certifications: string[];
}) => (
  <AnimatedSection className="py-8">
    <SectionHeading>
      <Award size={22} /> Awards & Certifications
    </SectionHeading>
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2 mt-4">
      {awards.map((award) => (
        <AnimatedItem key={award}>
          <div className="px-4 py-2 text-[0.82rem] flex items-center gap-2 bg-card rounded-xl shadow-neumorphic">
            <Trophy size={14} className="text-primary" />
            <span className="text-text">{award}</span>
          </div>
        </AnimatedItem>
      ))}
      {certifications.map((cert) => (
        <AnimatedItem key={cert}>
          <div className="px-4 py-2 text-[0.82rem] flex items-center gap-2 bg-card rounded-xl shadow-neumorphic">
            <FileText size={14} className="text-primary" />
            <span className="text-text">{cert}</span>
          </div>
        </AnimatedItem>
      ))}
    </div>
  </AnimatedSection>
);

export default AwardsSection;
