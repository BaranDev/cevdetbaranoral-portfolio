import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import CastlePanel from "./castle/CastlePanel";

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
    text-[0.92rem] font-semibold rounded-xl transition-all duration-100
    ${
      primary
        ? "bg-primary text-white shadow-pixel-ring hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-pixel-pressed"
        : "bg-background text-text shadow-pixel-ring hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-pixel-pressed"
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
  <span className="bg-primary/10 text-primary px-2 py-[2px] rounded-xl text-[0.8rem] font-medium border border-primary/20">
    {children}
  </span>
);

export const Badge = ({ children }: { children: ReactNode }) => (
  <span className="bg-primary/20 text-primary px-2 py-[1px] rounded-xl font-ornament text-[0.92rem] tracking-wide whitespace-nowrap">
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
  <CastlePanel className="sticky top-3 z-10 mt-24 mb-8 mx-2 md:mx-6">
    <div
      className="bg-card pixel-frame text-center py-2.5 px-4"
      style={style}
    >
      <h2 className="flex items-center justify-center gap-2.5 font-heading text-text text-[clamp(1.2rem,3vw,1.6rem)] font-semibold tracking-tight">
        {children}
      </h2>
    </div>
  </CastlePanel>
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
