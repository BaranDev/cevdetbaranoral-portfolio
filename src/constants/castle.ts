/* ── Castle palette: every stone takes its color from the theme ── */
export const WALL = "var(--color-outline)";
export const OPEN = "var(--color-card)";
export const FLAG = "var(--color-accent)";

/* ── Layout grid (px) ── */
export const TOWER_W = 44; // crown sprite width (symmetric around x=22)
export const TOWER_RAISE = 80; // how far the crowns rise above the panel top
export const TOWER_OVERHANG = 10; // crown overhang past the panel edge
export const WALL_H = 24; // curtain wall strip height
export const WALL_RAISE = 16; // wall rise above the panel top
export const TILE = 24; // battlement pattern tile width
export const PLINTH_H = 12; // height of each plinth step
export const PLINTH_DROP = 12; // how far the lower step hangs below the panel
export const CROWN_BODY_X = 6; // crown body offset inside the sprite
export const CROWN_BODY_W = 32; // crown body width inside the sprite
export const CROWN_CREN_X = 2; // crenellation offset inside the sprite

export const WALL_TUCK = 4; // wall courses run this far under each tower, so no seam shows
export const WALL_CAP = 0; // solid straight end-cap at each wall end

/* wall ends flush with the crown body's inner edge */
export const WALL_INSET = CROWN_BODY_X + CROWN_BODY_W - TOWER_OVERHANG;

/* plinth ends flush with the crenellation (the crown's widest part) */
export const PLINTH_OVERHANG = TOWER_OVERHANG - CROWN_CREN_X;
