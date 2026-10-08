import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  WALL,
  WALL_H,
  WALL_CAP,
  WALL_TUCK,
  TILE,
} from "../../../constants/castle";

/** Curtain wall between the towers. The walk and base run edge to edge;
    merlons and corbels repeat on a TILE-wide pattern, so they render only
    as whole tiles, centered — no half-merlon ever collides with a tower,
    and each tile is symmetric so both tower gaps match. */
const Wall = ({ id, style }: { id: string; style?: CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tiles, setTiles] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setTiles(
        Math.max(0, Math.floor((e.contentRect.width - 2 * WALL_CAP) / TILE)),
      ),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute"
      style={{ height: WALL_H, ...style }}
    >
      {/* continuous courses: wall walk + base, tucked under the towers */}
      <svg
        height={WALL_H}
        shapeRendering="crispEdges"
        className="absolute top-0"
        style={{ left: -WALL_TUCK, width: `calc(100% + ${2 * WALL_TUCK}px)` }}
      >
        <rect x="0" y="10" width="100%" height="4" fill={WALL} />
        <rect x="0" y="17" width="100%" height="5" fill={WALL} />
      </svg>
      {/* tiled battlements, snapped to whole tiles */}
      <svg
        width={tiles * TILE}
        height={WALL_H}
        shapeRendering="crispEdges"
        className="absolute top-0 left-1/2 -translate-x-1/2"
      >
        <defs>
          <pattern
            id={id}
            width={TILE}
            height={WALL_H}
            patternUnits="userSpaceOnUse"
          >
            <rect x="4" y="0" width="16" height="10" fill={WALL} />
            <rect x="3" y="14" width="6" height="3" fill={WALL} />
            <rect x="15" y="14" width="6" height="3" fill={WALL} />
          </pattern>
        </defs>
        <rect width="100%" height={WALL_H} fill={`url(#${id})`} />
      </svg>
      {/* straight end caps: full-height solid columns, no pattern cut-off */}
      <div
        className="absolute top-0 bottom-0 left-0"
        style={{ width: WALL_CAP, background: WALL }}
      />
      <div
        className="absolute top-0 bottom-0 right-0"
        style={{ width: WALL_CAP, background: WALL }}
      />
    </div>
  );
};

export default Wall;
