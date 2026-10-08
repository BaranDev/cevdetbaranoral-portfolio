import { AnimatedSection, AnimatedItem } from "../ui/animation";
import type { QuickStats } from "../../types/portfolio";

const StatsSection = ({ quickStats }: { quickStats: QuickStats }) => {
  const stats = [
    { value: `${quickStats.yearsExperience}+`, label: "Years Exp." },
    { value: `${quickStats.projectsCompleted}+`, label: "Repos" },
    { value: quickStats.degreesEarned, label: "Degrees" },
    { value: quickStats.hackathonAwards, label: "Awards" },
  ];

  return (
    <AnimatedSection id="stats">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
        {stats.map((s) => (
          <AnimatedItem key={s.label}>
            <div className="text-center p-4 bg-card rounded-xl shadow-neumorphic transition-transform duration-300 hover:-translate-y-[3px]">
              <div className="text-stat font-bold text-primary">
                {s.value}
              </div>
              <div className="text-label text-secondary uppercase tracking-wide mt-0.5">
                {s.label}
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default StatsSection;
