import logoImage from "../../assets/logo.png";
import { useTheme } from "../../context/ThemeContext";

const AnimatedLogo = ({ showTagline = true, size = "medium" }) => {
  const { theme } = useTheme();

  // Size mappings for responsive display
  const sizeClasses = {
    small: "max-w-[120px]",
    medium: "max-w-[200px]",
    large: "max-w-[300px]",
  };

  const fontSizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl",
  };

  // Determine filters based on theme background color
  // Assuming theme.colors.background is hex code
  const isDark = theme.colors.background === "#1a1f2e" || theme.name === "dark";

  const filterStyle = isDark
    ? { filter: "brightness(0.9) contrast(1.1) saturate(0.9)" }
    : { filter: "brightness(1.02) contrast(1.05) saturate(0.95)" };

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-[400px] mx-auto">
      <div className="relative p-6 rounded-3xl bg-background shadow-md mb-6 overflow-hidden group">
        {/* Shimmer effect */}
        <div className="absolute -top-1/2 -left-1/2 -right-1/2 -bottom-1/2 bg-gradient-to-tr from-transparent via-white/20 to-transparent rotate-45 animate-shimmer bg-[length:200%_200%] pointer-events-none z-10" />

        <img
          src={logoImage}
          alt="Barandev Logo"
          className={`w-full h-auto z-20 relative transition-all duration-300 group-hover:brightness-105 group-hover:contrast-105 ${sizeClasses[size]}`}
          style={{
            ...filterStyle,
            // Add drop-shadow on hover using inline style for dynamic color
            transition: "filter 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = `brightness(1.05) contrast(1.05) drop-shadow(0 0 8px ${theme.colors.primary}40)`;
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, filterStyle);
          }}
        />
      </div>

      <div
        className={`
          font-bold mt-4 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent 
          drop-shadow-sm tracking-[2px] opacity-0 animate-text-reveal delay-500
          ${fontSizeClasses[size]}
        `}
        style={{ animationFillMode: "forwards" }}
      >
        Barandev
      </div>

      {showTagline && (
        <div
          className="text-base text-secondary mt-2 text-center opacity-0 animate-text-reveal delay-1000"
          style={{ animationFillMode: "forwards" }}
        >
          Full-Stack Developer & AI Specialist
        </div>
      )}
    </div>
  );
};

export default AnimatedLogo;
