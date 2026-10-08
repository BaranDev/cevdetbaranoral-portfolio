import type { CSSProperties } from "react";
import { WALL, OPEN, FLAG, TOWER_W } from "../../../constants/castle";

/* ponytail: rect coordinates stay literal — they are the pixel art
   itself, not layout. No viewBox: user units are CSS px, so the body
   runs height="100%" down to the base and crown + shaft share one
   raster — they can't round to different device pixels. */

/* Pennant columns (2px wide) taper from the pole to a point. Each frame
   drops some columns one pixel so a wave travels away from the pole;
   the two columns at the pole never move. */
const FLAG_H = [8, 8, 6, 6, 4, 4, 2];
const FLAG_WAVE = [
  [0, 0, 2, 2, 0, 0, 2],
  [0, 0, 0, 2, 2, 0, 0],
  [0, 0, 0, 0, 2, 2, 0],
  [0, 0, 2, 0, 0, 2, 2],
];

/** Watchtower: flag, crenellation, corbels, body with arrow-slit.
    The body fills whatever height the svg is given. */
const Tower = ({ style }: { style?: CSSProperties }) => (
  <svg
    width={TOWER_W}
    aria-hidden
    shapeRendering="crispEdges"
    className="absolute"
    style={style}
  >
    {/* flag pole */}
    <rect x="20" y="0" width="4" height="18" fill={WALL} />
    {/* pennant: 4 pixel frames, cycled by .flag-frame in index.css */}
    <g>
      {FLAG_WAVE.map((offsets, f) => (
        <g key={f} className="flag-frame">
          {FLAG_H.map((h, c) => (
            <g key={c}>
              <rect x={24 + c * 2} y={2 + offsets[c]} width="2" height={h} fill={FLAG} />
              {/* shaded underside pixel (the tail point stays flat) */}
              {h > 2 && (
                <rect x={24 + c * 2} y={h + offsets[c]} width="2" height="2" fill="black" opacity="0.2" />
              )}
            </g>
          ))}
        </g>
      ))}
    </g>
    {/* crenellation */}
    <rect x="2" y="16" width="8" height="10" fill={WALL} />
    <rect x="18" y="16" width="8" height="10" fill={WALL} />
    <rect x="34" y="16" width="8" height="10" fill={WALL} />
    <rect x="2" y="26" width="40" height="6" fill={WALL} />
    {/* machicolation corbels */}
    <rect x="4" y="32" width="6" height="4" fill={WALL} />
    <rect x="14" y="32" width="6" height="4" fill={WALL} />
    <rect x="24" y="32" width="6" height="4" fill={WALL} />
    <rect x="34" y="32" width="6" height="4" fill={WALL} />
    {/* body, straight down to the base (clipped at the svg bottom) */}
    <rect x="6" y="36" width="32" height="100%" fill={WALL} />
    {/* shaded flank */}
    <rect x="32" y="36" width="6" height="100%" fill="black" opacity="0.2" />
    {/* cross arrow-slit */}
    <rect x="20" y="44" width="4" height="16" fill={OPEN} />
    <rect x="16" y="48" width="12" height="4" fill={OPEN} />
  </svg>
);

export default Tower;
