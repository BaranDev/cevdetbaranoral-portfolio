// Theme.js - Neumorphism design system for the portfolio

const lightTheme = {
  colors: {
    background: '#e0e5ec', // Light gray background - typical for neumorphism
    text: '#333333',       // Dark text for contrast
    primary: '#4b70e2',    // Primary accent color
    secondary: '#9baacf',  // Secondary accent color
    success: '#4CAF50',
    danger: '#f44336',
    warning: '#ff9800',
    info: '#2196F3',
    card: '#e0e5ec',
    modalBackground: 'rgba(255, 255, 255, 0.25)',
    glassMorphism: 'rgba(255, 255, 255, 0.7)',
    glassMorphismBorder: 'rgba(255, 255, 255, 0.18)',
    disabled: '#e5e9f0',
    disabledText: '#9baacf',
  },
  
  // Neumorphism shadow configuration
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
  
  // Border radius for rounded elements
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
    circle: '50%',
  },
  
  // Spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Typography
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem',
      xxxl: '2.5rem',
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
  },
  
  // Animation durations
  animations: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
};

const darkTheme = {
  colors: {
    background: '#1a1f2e', // Dark background for dark mode
    text: '#e0e5ec',       // Light text for contrast
    primary: '#6f8ce9',    // Lighter primary for dark mode
    secondary: '#7e90b6',  // Lighter secondary for dark mode
    success: '#81c784',
    danger: '#e57373',
    warning: '#ffb74d',
    info: '#64b5f6',
    card: '#232937',
    modalBackground: 'rgba(0, 0, 0, 0.25)',
    glassMorphism: 'rgba(25, 30, 45, 0.7)',
    glassMorphismBorder: 'rgba(25, 30, 45, 0.18)',
    disabled: '#1d222e',
    disabledText: '#4a5472',
  },
  
  // Dark mode shadows
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
  
  // Border radius (same as light theme)
  borderRadius: lightTheme.borderRadius,
  
  // Spacing (same as light theme)
  spacing: lightTheme.spacing,
  
  // Typography (same as light theme)
  typography: lightTheme.typography,
  
  // Animation durations (same as light theme)
  animations: lightTheme.animations,
  
  // Breakpoints (same as light theme)
  breakpoints: lightTheme.breakpoints,
};

// Create a default theme object that will be imported directly
const Theme = darkTheme; // Default to dark theme

export { lightTheme, darkTheme };
export default Theme; 