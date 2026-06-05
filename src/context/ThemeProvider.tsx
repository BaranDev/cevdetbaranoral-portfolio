import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContextDefinition";
import { lightTheme, darkTheme } from "../styles/Theme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Get theme from localStorage or use dark as default
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme");
    // Default to dark mode if no saved preference or if preferred color scheme is dark
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    // Update root class for Tailwind dark mode
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
