import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ collapsed }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const containerClasses = `
    flex items-center justify-center overflow-hidden rounded-xl bg-card transition-all duration-300
    border border-primary/15 shadow-md hover:shadow-lg hover:border-primary/25 relative
    ${collapsed ? "w-10 h-10 rounded-full p-0 cursor-pointer" : "w-full min-h-[40px] p-0 flex-row"}
  `;

  const btnClasses = `
    w-full flex-1 border-none bg-transparent flex items-center justify-center gap-2 cursor-pointer py-3 transition-all duration-200
    hover:bg-primary/10 hover:opacity-100 disabled:opacity-50
  `;

  // If sidebar is collapsed, show minimal round toggle
  if (collapsed) {
    return (
      <div
        className={containerClasses}
        onClick={toggleTheme}
        title="Toggle Theme"
      >
        <button className="w-full h-full flex items-center justify-center border-none bg-transparent text-primary hover:text-accent cursor-pointer">
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    );
  }

  // Expanded sidebar: Vertical split toggle with divider
  return (
    <div className={containerClasses}>
      {/* Day Mode Button (Top) */}
      <button
        className={`${btnClasses} ${!isDarkMode ? "bg-primary/15 text-primary opacity-100" : "text-text opacity-50"}`}
        onClick={() => isDarkMode && toggleTheme()}
        title="Switch to Light Mode"
      >
        <Sun size={18} />
      </button>

      <div className="h-[60%] w-[1px] bg-text/15 my-0.5" />

      {/* Night Mode Button (Bottom) */}
      <button
        className={`${btnClasses} ${isDarkMode ? "bg-primary/15 text-primary opacity-100" : "text-text opacity-50"}`}
        onClick={() => !isDarkMode && toggleTheme()}
        title="Switch to Dark Mode"
      >
        <Moon size={18} />
      </button>
    </div>
  );
};

export default ThemeToggle;
