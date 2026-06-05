import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

/* ── Shared UI primitives used across pages ────────────────── */

interface BtnProps {
  primary?: boolean;
  href?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
}

/** Polymorphic button: renders Link when `to` is set, anchor when `href` is set, button otherwise. */
export const Btn = ({
  primary = false,
  href,
  to,
  onClick,
  className = "",
  children,
  ...props
}: BtnProps) => {
  const classes = `
    inline-flex items-center justify-center gap-1.5 px-[18px] py-2 cursor-pointer
    text-[0.82rem] font-semibold rounded-xl transition-all duration-300
    ${
      primary
        ? "bg-primary text-white shadow-md hover:-translate-y-[2px] hover:animate-glow"
        : "bg-background text-text shadow-neumorphic hover:-translate-y-[2px] hover:animate-glow"
    }
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
};

export const Chips = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-wrap gap-1">{children}</div>
);

export const Chip = ({ children }: { children: ReactNode }) => (
  <span className="bg-primary/10 text-primary px-2 py-[2px] rounded-xl text-[0.7rem] font-medium border border-primary/20">
    {children}
  </span>
);

export const Badge = ({ children }: { children: ReactNode }) => (
  <span className="bg-primary/20 text-primary px-2 py-[1px] rounded-xl text-[0.65rem] font-semibold uppercase tracking-wide whitespace-nowrap">
    {children}
  </span>
);

export const SectionHeading = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <h2
    className="flex items-center justify-center gap-2.5 font-heading text-text text-[clamp(1.2rem,3vw,1.6rem)] font-semibold tracking-tight mb-4 text-center sticky top-0 z-10 py-3.5 backdrop-blur-md bg-card/80 rounded-b-xl -mx-4 md:-mx-8 px-4 md:px-8 shadow-sm"
    style={style}
  >
    {children}
  </h2>
);

export const Card = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-card rounded-xl shadow-neumorphic ${className}`} {...props}>
    {children}
  </div>
);
