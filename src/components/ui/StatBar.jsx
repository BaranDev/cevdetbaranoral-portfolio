import React from "react";

export default function StatBar({ stats }) {
  const items = [
    { label: "Years", value: stats.experienceYears },
    { label: "Projects", value: stats.projects },
    { label: "Skills", value: stats.skills },
    { label: "Achievements", value: stats.achievements },
  ];

  return (
    <div
      className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mt-6 
      bg-gradient-to-br from-white/5 to-black/10 border border-white/10 p-4 rounded-xl"
    >
      {items.map((i) => (
        <div
          key={i.label}
          className="text-center font-heading text-[0.65rem] leading-tight tracking-[0.5px]"
        >
          <div className="text-[1.1rem] font-bold text-accent">{i.value}</div>
          {i.label}
        </div>
      ))}
    </div>
  );
}
