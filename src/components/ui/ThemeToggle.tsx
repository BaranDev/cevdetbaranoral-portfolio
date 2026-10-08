import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  collapsed?: boolean;
}

const ThemeToggle = ({ collapsed = false }: ThemeToggleProps) => {
  const { isDarkMode, toggleTheme } = useTheme();

  // Collapsed rail / mobile: one pixel button showing the current mode
  if (collapsed) {
    const label = isDarkMode ? "Switch to light mode" : "Switch to dark mode";
    return (
      <button
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className="
          w-10 h-10 shrink-0 flex items-center justify-center cursor-pointer
          bg-card text-primary shadow-pixel-ring transition-all duration-100
          hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-pixel-pressed
        "
      >
        {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    );
  }

  // Expanded sidebar: pixel segmented switch, the active cell sits pressed in
  const cell = (active: boolean) => `
    flex-1 h-10 flex items-center justify-center cursor-pointer transition-colors duration-100
    ${
      active
        ? "bg-primary text-white shadow-[inset_2px_2px_0_rgba(0,0,0,0.35)]"
        : "text-secondary hover:text-primary hover:bg-primary/10"
    }
  `;

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="w-full flex bg-card shadow-pixel-ring"
    >
      <button
        aria-label="Light mode"
        aria-pressed={!isDarkMode}
        title="Light mode"
        onClick={() => isDarkMode && toggleTheme()}
        className={cell(!isDarkMode)}
      >
        <Sun size={18} />
      </button>
      <span aria-hidden className="w-0.5 bg-outline" />
      <button
        aria-label="Dark mode"
        aria-pressed={isDarkMode}
        title="Dark mode"
        onClick={() => !isDarkMode && toggleTheme()}
        className={cell(isDarkMode)}
      >
        <Moon size={18} />
      </button>
    </div>
  );
};

export default ThemeToggle;
