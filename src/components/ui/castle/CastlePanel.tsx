import { useId } from "react";
import type { CSSProperties, ReactNode } from "react";
import Tower from "./Tower";
import Wall from "./Wall";
import {
  TOWER_RAISE,
  TOWER_OVERHANG,
  WALL_RAISE,
  WALL_INSET,
  PLINTH_H,
  PLINTH_DROP,
  PLINTH_OVERHANG,
} from "../../../constants/castle";

/* ── CastlePanel: wraps any content in castle edges ────────────
   Towers flank the sides, a curtain wall runs along the top and
   a stepped plinth grounds the bottom. Leave clearance around it:
   TOWER_RAISE px above, TOWER_OVERHANG px at the sides,
   PLINTH_DROP px below. */

/* towers run from crown tip down to the plinth bottom */
const towerStyle: CSSProperties = {
  top: -TOWER_RAISE,
  height: `calc(100% + ${TOWER_RAISE + PLINTH_DROP}px)`,
};

const CastlePanel = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const wallId = useId();

  return (
    <div className={`relative ${className}`}>
      {/* curtain wall along the top, flush with the crown bodies */}
      <Wall
        id={wallId}
        style={{ top: -WALL_RAISE, left: WALL_INSET, right: WALL_INSET }}
      />

      {/* corner towers: crown + solid full-height body, one svg each */}
      <Tower style={{ ...towerStyle, left: -TOWER_OVERHANG }} />
      <Tower style={{ ...towerStyle, right: -TOWER_OVERHANG }} />

      {/* stepped plinth, flush with the crown crenellations */}
      <div
        aria-hidden
        className="absolute left-1 right-1 bg-outline"
        style={{ bottom: -(PLINTH_DROP - PLINTH_H + 1), height: PLINTH_H }}
      />
      <div
        aria-hidden
        className="absolute bg-outline"
        style={{
          bottom: -PLINTH_DROP,
          left: -PLINTH_OVERHANG,
          right: -PLINTH_OVERHANG,
          height: PLINTH_H,
        }}
      />

      {children}
    </div>
  );
};

export default CastlePanel;
