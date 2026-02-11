import styled from "styled-components";

// PixelPanel: themed container with subtle pixel/arcane styling
const PixelPanel = styled.div`
  position: relative;
  background: ${(p) => p.theme.colors.card};
  background-image: ${(p) => p.theme.gradients.card};
  border: ${(p) => p.theme.effects.pixelBorder};
  border-radius: ${(p) => p.theme.borderRadius.medium};
  padding: ${(p) => p.padding || p.theme.spacing.lg};
  box-shadow: ${(p) => p.theme.effects.innerBevel},
    ${(p) => p.theme.shadows.small};
  transition: transform 0.25s ease, box-shadow 0.35s ease;
  will-change: transform;

  ${(p) =>
    p.$interactive &&
    `
    cursor: pointer;
    &:hover { 
      transform: translateY(-4px);
      box-shadow: ${p.theme.shadows.medium}, 0 0 6px ${p.theme.colors.glow}55;
    }
    &:active {
      transform: translateY(0);
      box-shadow: ${p.theme.shadows.small};
    }
  `}
`;

export default PixelPanel;
