import type { HTMLAttributes } from "react";

/*
 * Scroll-reveal animations removed - these are now plain containers.
 * Kept as components so sections don't need restructuring, and so a
 * future animation pass only has to touch this file.
 */

export const AnimatedSection = ({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>;

export const AnimatedItem = ({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>;
