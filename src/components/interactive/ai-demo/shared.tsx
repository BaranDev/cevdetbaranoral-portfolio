import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

/* ── Shared building blocks for the AI demo tabs ───────────── */

export const DemoContainer = ({ children }: { children: ReactNode }) => (
  <div className="p-6 my-8 bg-card rounded-2xl shadow-neumorphic">
    {children}
  </div>
);

export const DemoTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-xl font-semibold m-0 text-text font-heading">
    {children}
  </h3>
);

interface TabButtonProps {
  active: boolean;
  ready: boolean;
  loading: boolean;
  onClick: () => void;
  children: ReactNode;
}

export const TabButton = ({
  active,
  ready,
  loading,
  onClick,
  children,
}: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`
      min-w-[150px] text-center relative px-6 py-3 rounded-xl font-bold transition-all duration-300 md:mb-2
      ${
        active
          ? "bg-primary text-white shadow-inner transform translate-y-[1px]"
          : "bg-background text-text shadow-neumorphic hover:-translate-y-1 hover:shadow-neumorphic-hover"
      }
    `}
  >
    {children}
    {(ready || loading) && (
      <span
        className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${ready ? "bg-success" : "bg-warning"}`}
      />
    )}
  </button>
);

interface NeumorphicButtonProps {
  primary?: boolean;
  as?: "button" | "span";
  disabled?: boolean;
  onClick?: MouseEventHandler;
  title?: string;
  className?: string;
  children: ReactNode;
}

export const NeumorphicButton = ({
  primary = false,
  as: Component = "button",
  className = "",
  children,
  ...props
}: NeumorphicButtonProps) => (
  <Component
    className={`
      px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center cursor-pointer
      ${
        primary
          ? "bg-primary text-white shadow-md hover:-translate-y-1 hover:shadow-lg"
          : "bg-background text-text shadow-neumorphic hover:-translate-y-1 hover:shadow-neumorphic-hover"
      }
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      ${className}
    `}
    {...props}
  >
    {children}
  </Component>
);

export const StatusIndicator = ({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) => (
  <div className="flex items-center mb-4">
    <div
      className={`w-3 h-3 rounded-full mr-2 ${active ? "bg-success" : "bg-danger"}`}
    />
    {children}
  </div>
);

export const Controls = ({ children }: { children: ReactNode }) => (
  <div className="flex mt-4 flex-wrap gap-4 justify-center">{children}</div>
);

interface TextProps {
  size?: "xs" | "sm" | "lg";
  color?: string;
  margin?: string;
  center?: boolean;
  maxWidth?: string;
  weight?: "medium" | "semiBold";
  children: ReactNode;
}

export const Text = ({
  size,
  color,
  margin,
  center,
  maxWidth,
  weight,
  children,
}: TextProps) => (
  <p
    className={`
      ${size === "sm" ? "text-sm" : size === "xs" ? "text-xs" : "text-base"}
      ${center ? "text-center" : ""}
      ${weight === "semiBold" ? "font-semibold" : weight === "medium" ? "font-medium" : ""}
    `}
    style={{ color, margin, maxWidth }}
  >
    {children}
  </p>
);

export const SubHeading = ({
  size,
  margin,
  children,
}: {
  size?: "sm" | "md";
  margin?: CSSProperties["margin"];
  children: ReactNode;
}) => (
  <h3
    className={`font-semibold text-text ${size === "sm" ? "text-base" : "text-xl"}`}
    style={{ margin }}
  >
    {children}
  </h3>
);

export const Spinner = () => (
  <div className="w-10 h-10 mx-auto border-4 border-black/10 border-l-primary rounded-full animate-spin" />
);
