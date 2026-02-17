import { useTheme } from "../../context/ThemeContext";

// PixelPanel: themed container with subtle pixel/arcane styling
const PixelPanel = ({
  children,
  padding,
  interactive,
  className = "",
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`
        relative bg-card rounded-md transition-all duration-250 ease-out will-change-transform
        ${interactive ? "cursor-pointer hover:-translate-y-1 active:translate-y-0" : ""}
        ${className}
      `}
      style={{
        backgroundImage: theme.gradients.card,
        border: theme.effects.pixelBorder,
        padding: padding || theme.spacing.lg,
        boxShadow: `${theme.effects.innerBevel}, ${theme.shadows.small}`,
        // Handle hover/active states for shadow via inline styles or class toggling?
        // Tailwind hover classes for box-shadow are static.
        // We can use a custom class or just accept that hover shadow might be simpler in Tailwind.
        // For accurate replication, we might need onMouseEnter/Leave to set state, but that's overkill.
        // Let's use Tailwind's shadow utility and maybe custom style if needed,
        // but `theme.effects.innerBevel` is complex.
        // I'll stick to style for the base shadow.
        // For interactive hover, I'll add a style override on the element itself if needed, or rely on CSS class.
        // Since I'm using functional component, I can't easily use "hover" pseudo class with dynamic JS variables in inline style without state.
        // However, I can use a simpler shadow for hover using Tailwind:
        // hover:shadow-lg
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default PixelPanel;
