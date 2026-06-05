// Theme.ts - Extended to support Medieval Magical Forest + Pixel Art aesthetic

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  magical: string;
  firefly: string;
  mushroom: string;
  canopy: string;
  glow: string;
  outline: string;
  card: string;
  cardAlt: string;
  modalBackground: string;
  glassMorphism: string;
  glassMorphismBorder: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  disabled: string;
  disabledText: string;
}

export interface Theme {
  colors: ThemeColors;
  shadows: { small: string; medium: string; large: string; inset: string };
  borderRadius: { small: string; medium: string; large: string; circle: string };
  spacing: { xs: string; sm: string; md: string; lg: string; xl: string; xxl: string };
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
    fontSizes: Record<"xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl", string>;
    fontWeights: Record<"light" | "regular" | "medium" | "semiBold" | "bold", number>;
  };
  animations: { fast: string; normal: string; slow: string };
  breakpoints: Record<"xs" | "sm" | "md" | "lg" | "xl" | "xxl", string>;
  effects: {
    glowPrimary: string;
    glowMagical: string;
    pixelBorder: string;
    innerBevel: string;
  };
  gradients: { hero: string; card: string; magical: string };
}

const fontFamily = "'Inter', 'Poppins', 'Roboto', sans-serif";

const sharedTokens = {
  borderRadius: {
    small: "8px",
    medium: "12px",
    large: "20px",
    circle: "50%",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  typography: {
    fontFamily,
    headingFont: fontFamily,
    bodyFont: fontFamily,
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.25rem",
      xl: "1.5rem",
      xxl: "2rem",
      xxxl: "2.5rem",
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
  },
  animations: {
    fast: "0.2s",
    normal: "0.3s",
    slow: "0.5s",
  },
  breakpoints: {
    xs: "320px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    xxl: "1400px",
  },
  effects: {
    glowPrimary: "0 0 8px rgba(210,168,70,0.55)",
    glowMagical: "0 0 10px rgba(155,120,255,0.6)",
    pixelBorder: "1px solid rgba(255,255,255,0.07)",
    innerBevel:
      "inset 1px 1px 0 rgba(255,255,255,0.08), inset -1px -1px 0 rgba(0,0,0,0.4)",
  },
  gradients: {
    hero: "linear-gradient(135deg, rgba(44,88,55,0.9), rgba(32,52,42,0.92))",
    card: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.15))",
    magical: "linear-gradient(90deg, #6d4bb8, #a184ff)",
  },
} satisfies Omit<Theme, "colors" | "shadows">;

export const lightTheme: Theme = {
  ...sharedTokens,
  colors: {
    background: "#f1f4f2", // Parchment-tinted light base
    surface: "#ffffff",
    text: "#2d2d2d",
    primary: "#2f5d3a", // Deep forest green
    secondary: "#5a7d4d",
    accent: "#c08d2b", // Gold accent
    magical: "#6d4bb8", // Arcane purple
    firefly: "#ffe87a",
    mushroom: "#d94e4e",
    canopy: "#8fbf7a",
    glow: "#dabd63",
    outline: "#324a3a",
    card: "#f8faf9",
    cardAlt: "#eef2ef",
    modalBackground: "rgba(255, 255, 255, 0.25)",
    glassMorphism: "rgba(255, 255, 255, 0.7)",
    glassMorphismBorder: "rgba(255, 255, 255, 0.18)",
    success: "#3d8247",
    danger: "#ba3f3f",
    warning: "#d19b2d",
    info: "#3f6fb8",
    disabled: "#e3e7e4",
    disabledText: "#9aa9a3",
  },
  shadows: {
    small: `
      3px 3px 6px rgba(174, 174, 192, 0.4),
      -3px -3px 6px rgba(255, 255, 255, 0.7)
    `,
    medium: `
      5px 5px 10px rgba(174, 174, 192, 0.4),
      -5px -5px 10px rgba(255, 255, 255, 0.7)
    `,
    large: `
      10px 10px 20px rgba(174, 174, 192, 0.4),
      -10px -10px 20px rgba(255, 255, 255, 0.7)
    `,
    inset: `
      inset 2px 2px 5px rgba(174, 174, 192, 0.4),
      inset -2px -2px 5px rgba(255, 255, 255, 0.7)
    `,
  },
};

export const darkTheme: Theme = {
  ...sharedTokens,
  colors: {
    background: "#0e1512", // Deep forest night
    surface: "#18231d",
    text: "#e3ece8",
    primary: "#3c8c54", // Lush moss
    secondary: "#547a4b",
    accent: "#d7a645",
    magical: "#a184ff",
    firefly: "#ffe87a",
    mushroom: "#ff6d6d",
    canopy: "#2e5c3c",
    glow: "#e2c676",
    outline: "#264232",
    card: "#151f1a",
    cardAlt: "#1b2822",
    modalBackground: "rgba(0, 0, 0, 0.35)",
    glassMorphism: "rgba(24, 35, 30, 0.6)",
    glassMorphismBorder: "rgba(24, 35, 30, 0.25)",
    success: "#64c980",
    danger: "#f07a7a",
    warning: "#e5ba52",
    info: "#6fa8ff",
    disabled: "#1f2c26",
    disabledText: "#4a5d55",
  },
  shadows: {
    small: `
      3px 3px 6px rgba(0, 0, 0, 0.5),
      -3px -3px 6px rgba(40, 45, 60, 0.15)
    `,
    medium: `
      5px 5px 10px rgba(0, 0, 0, 0.5),
      -5px -5px 10px rgba(40, 45, 60, 0.15)
    `,
    large: `
      10px 10px 20px rgba(0, 0, 0, 0.5),
      -10px -10px 20px rgba(40, 45, 60, 0.15)
    `,
    inset: `
      inset 2px 2px 5px rgba(0, 0, 0, 0.5),
      inset -2px -2px 5px rgba(40, 45, 60, 0.15)
    `,
  },
};

// Default export theme (dark preferred for ambiance)
const Theme = darkTheme;

export default Theme;
