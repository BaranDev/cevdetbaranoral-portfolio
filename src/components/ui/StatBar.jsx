import React from "react";
import styled from "styled-components";

const Bar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${(p) => p.theme.spacing.md};
  margin-top: ${(p) => p.theme.spacing.lg};
  background: ${(p) => p.theme.gradients.card};
  border: ${(p) => p.theme.effects.pixelBorder};
  padding: ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.borderRadius.medium};
`;

const Item = styled.div`
  text-align: center;
  font-family: ${(p) => p.theme.typography.pixelFont};
  font-size: 0.65rem;
  line-height: 1.3;
  letter-spacing: 0.5px;
`;

const Value = styled.div`
  font-size: 1.1rem;
  font-family: ${(p) => p.theme.typography.headingFont};
  color: ${(p) => p.theme.colors.accent};
  text-shadow: ${(p) => p.theme.effects.glowPrimary};
`;

export default function StatBar({ stats }) {
  const items = [
    { label: "Years", value: stats.experienceYears },
    { label: "Projects", value: stats.projects },
    { label: "Skills", value: stats.skills },
    { label: "Achievements", value: stats.achievements },
  ];
  return (
    <Bar>
      {items.map((i) => (
        <Item key={i.label}>
          <Value>{i.value}</Value>
          {i.label}
        </Item>
      ))}
    </Bar>
  );
}
