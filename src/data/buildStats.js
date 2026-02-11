// Utility to derive summary stats from portfolio data schema
export function buildStats(data) {
  const now = new Date();
  // Experience years: difference between earliest start and now (or end if specified) aggregated? We'll compute max total years since earliest start.
  const starts = data.experience.map((e) => new Date(e.start + "-01"));
  const earliest = starts.length
    ? Math.min(...starts.map((d) => d.getTime()))
    : now.getTime();
  const totalYears =
    (now.getTime() - earliest) / (1000 * 60 * 60 * 24 * 365) || 0;

  // Projects count
  const projects = data.projects.length;

  // Skill items total
  const skills = Object.values(data.skills).reduce(
    (acc, cat) => acc + (cat.items?.length || 0),
    0
  );

  const achievements = data.achievements.length;

  return {
    experienceYears: Math.max(1, Math.round(totalYears)),
    projects,
    skills,
    achievements,
  };
}
