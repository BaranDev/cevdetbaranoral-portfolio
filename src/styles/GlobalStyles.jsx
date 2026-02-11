import React from "react";
import { createGlobalStyle } from "styled-components";

const noiseDataUrl = `data:image/svg+xml;base64,${btoa(
  `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='none'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/></filter><rect width='80' height='80' filter='url(%23n)' opacity='0.05'/></svg>`,
)}`;

const GlobalStyle = createGlobalStyle`
  :root { color-scheme: dark light; }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body { 
    margin: 0; 
    line-height: 1.6;
    font-family: ${(p) =>
      p.theme.typography.bodyFont || p.theme.typography.fontFamily};
    background: radial-gradient(circle at 50% 0%, ${(p) =>
      p.theme.colors.background} 0%, ${(p) =>
      p.theme.colors.surface || p.theme.colors.background} 60%, ${(p) =>
      p.theme.colors.background} 100%);
    background-attachment: fixed;
    position: relative;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body::after { 
    content: ''; 
    position: fixed; 
    inset: 0; 
    background-image: url(${noiseDataUrl});
    pointer-events: none; 
    z-index: -1; 
  }
  ::selection { background: ${(p) => p.theme.colors.magical}55; color: ${(p) =>
    p.theme.colors.text}; }
  a { text-decoration: none; color: ${(p) => p.theme.colors.accent}; }
  a:focus-visible, button:focus-visible { outline: 2px solid ${(p) =>
    p.theme.colors.accent}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`;

const GlobalStyles = () => (
  <>
    <GlobalStyle />
  </>
);
export default GlobalStyles;
