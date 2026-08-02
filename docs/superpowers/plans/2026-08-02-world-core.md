# World Core Implementation Plan (Plan 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A playable first-person voxel island at `/world` — desktop-gated, WASD/arrow movement, 9-slot hotbar with smooth camera flights to placeholder landmarks, and themed content overlays fed by `portfolioData.json`.

**Architecture:** Lazy `/world` route inside the existing React 19 + Vite SPA. react-three-fiber renders the scene; player state lives in a React context (low-frequency UI state only); per-frame math is pure functions in `physics.ts` driven by `useFrame`. All DOM UI (hotbar, overlay, prompts) renders over the canvas, never inside it.

**Tech Stack:** React 19, TypeScript (strict), Vite 6, three 0.176, @react-three/fiber 9, @react-three/drei 10, gsap 3.13, Vitest (new dev dep).

**Spec:** `docs/superpowers/specs/2026-08-02-minecraft-dnd-portfolio-design.md`

## Global Constraints

- Branch: `minecraft-remake`. Commit after every task; plain conventional-commit messages, **no AI attribution lines**.
- No new runtime dependencies. Only new dev dependency: `vitest`.
- No Mojang assets ever. Placeholder geometry/colors in this plan; real models come in Plan 2.
- Desktop-only: touch devices and no-WebGL browsers must never mount the Canvas.
- TypeScript strict mode is on (`noUnusedLocals`, `noUnusedParameters`) — unused vars fail `npm run lint`.
- All world code under `src/world/`; assets later under `public/world/`.
- Run commands from repo root `D:\git clones\Portfolio` (npm).
- Controls follow the spec's "Minecraft muscle memory" table: WASD **and** arrows walk, Space jumps, mouse looks (pointer lock), 1–9 hotbar, E **or** right-click interacts, ESC closes overlay / releases pointer lock. (M/mute arrives in Plan 2 with audio.)

---

### Task 1: Vitest + worldConfig

**Files:**
- Modify: `package.json` (add vitest, `test` script)
- Create: `src/world/worldConfig.ts`
- Test: `src/world/__tests__/worldConfig.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `SectionKey`, `LandingPose`, `Landmark`, `ISLAND_RADIUS: number`, `SPAWN_POSITION: [number, number, number]`, `LANDMARKS: Landmark[]`, `getLandmarkBySlot(slot: number): Landmark | undefined` — every later task reads these.

- [ ] **Step 1: Install Vitest and add script**

```bash
npm install -D vitest
```

In `package.json` scripts add: `"test": "vitest run"`.

- [ ] **Step 2: Write failing tests**

`src/world/__tests__/worldConfig.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ISLAND_RADIUS, LANDMARKS, getLandmarkBySlot } from "../worldConfig";

describe("worldConfig", () => {
  it("defines exactly slots 1..9, unique", () => {
    const slots = LANDMARKS.map((l) => l.slot).sort((a, b) => a - b);
    expect(slots).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("has unique ids and section keys", () => {
    expect(new Set(LANDMARKS.map((l) => l.id)).size).toBe(9);
    expect(new Set(LANDMARKS.map((l) => l.sectionKey)).size).toBe(9);
  });

  it("keeps every landmark and landing pose inside the island", () => {
    for (const l of LANDMARKS) {
      const [x, , z] = l.position;
      const [lx, , lz] = l.landingPose.position;
      expect(Math.hypot(x, z)).toBeLessThan(ISLAND_RADIUS);
      expect(Math.hypot(lx, lz)).toBeLessThan(ISLAND_RADIUS);
    }
  });

  it("getLandmarkBySlot returns the match or undefined", () => {
    expect(getLandmarkBySlot(3)?.sectionKey).toBe("skills");
    expect(getLandmarkBySlot(0)).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npm test`
Expected: FAIL — cannot resolve `../worldConfig`.

- [ ] **Step 4: Implement `src/world/worldConfig.ts`**

```ts
export type SectionKey =
  | "about" | "experience" | "skills" | "projects" | "education"
  | "awards" | "aiDemos" | "contact" | "secret";

export interface LandingPose {
  position: [number, number, number];
  /** radians; yaw 0 faces -Z, pitch 0 is level */
  yaw: number;
  pitch: number;
}

export interface Landmark {
  slot: number;
  id: string;
  sectionKey: SectionKey;
  name: string;
  position: [number, number, number];
  landingPose: LandingPose;
  /** placeholder tint until Plan 2 models land */
  itemColor: string;
}

export const ISLAND_RADIUS = 60;
export const SPAWN_POSITION: [number, number, number] = [0, 0, 8];

// Nine landmarks ringed around the spawn plaza. Angles spread evenly;
// landing poses stand ~6 units out from each landmark, facing it.
const ring = (angleDeg: number, dist: number): [number, number, number] => {
  const a = (angleDeg * Math.PI) / 180;
  return [Math.sin(a) * dist, 0, -Math.cos(a) * dist];
};
const facing = (angleDeg: number): number => ((angleDeg + 180) * Math.PI) / 180;

const entry = (
  slot: number, id: string, sectionKey: SectionKey, name: string,
  angleDeg: number, itemColor: string,
): Landmark => ({
  slot, id, sectionKey, name,
  position: ring(angleDeg, 40),
  landingPose: { position: ring(angleDeg, 33), yaw: facing(angleDeg), pitch: 0 },
  itemColor,
});

export const LANDMARKS: Landmark[] = [
  entry(1, "tavern", "about", "The Tavern", 0, "#c28e5c"),
  entry(2, "guild-hall", "experience", "Guild Hall", 40, "#b53a3a"),
  entry(3, "enchanting-tower", "skills", "Enchanting Tower", 80, "#7a4dbf"),
  entry(4, "forge", "projects", "The Forge", 120, "#d97a1f"),
  entry(5, "library", "education", "The Library", 160, "#3f7fbf"),
  entry(6, "trophy-hall", "awards", "Trophy Hall", 200, "#d4af37"),
  entry(7, "wizard-lab", "aiDemos", "Wizard Lab", 240, "#3abf8f"),
  entry(8, "raven-post", "contact", "Raven Post", 280, "#5c6b7a"),
  entry(9, "secret-dungeon", "secret", "???", 320, "#2f2f2f"),
];

export function getLandmarkBySlot(slot: number): Landmark | undefined {
  return LANDMARKS.find((l) => l.slot === slot);
}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npm test` — Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/world
git commit -m "feat: add world config with landmark ring and vitest setup"
```

---

### Task 2: World state context

**Files:**
- Create: `src/world/state/WorldStateContext.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces:
  ```ts
  interface WorldState {
    activeSlot: number | null;   // hotbar selection
    overlayOpen: boolean;
    inFlight: boolean;           // camera flight in progress; input locked
    selectSlot(slot: number): void;   // no-op while inFlight or overlayOpen
    openOverlay(): void;              // opens for activeSlot
    closeOverlay(): void;
    setInFlight(v: boolean): void;
  }
  function WorldStateProvider({ children }: { children: ReactNode }): JSX.Element
  function useWorldState(): WorldState  // throws outside provider
  ```

- [ ] **Step 1: Implement**

```tsx
import {
  createContext, useCallback, useContext, useMemo, useState, type ReactNode,
} from "react";

interface WorldState {
  activeSlot: number | null;
  overlayOpen: boolean;
  inFlight: boolean;
  selectSlot: (slot: number) => void;
  openOverlay: () => void;
  closeOverlay: () => void;
  setInFlight: (v: boolean) => void;
}

const Ctx = createContext<WorldState | null>(null);

export function WorldStateProvider({ children }: { children: ReactNode }) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [inFlight, setInFlight] = useState(false);

  const selectSlot = useCallback(
    (slot: number) => {
      if (inFlight || overlayOpen) return;
      setActiveSlot(slot);
    },
    [inFlight, overlayOpen],
  );
  const openOverlay = useCallback(() => setOverlayOpen(true), []);
  const closeOverlay = useCallback(() => setOverlayOpen(false), []);

  const value = useMemo(
    () => ({ activeSlot, overlayOpen, inFlight, selectSlot, openOverlay, closeOverlay, setInFlight }),
    [activeSlot, overlayOpen, inFlight, selectSlot, openOverlay, closeOverlay],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorldState(): WorldState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWorldState must be used inside WorldStateProvider");
  return v;
}
```

State is deliberately low-frequency UI state; per-frame values (player position, velocity) never live here — they stay in refs inside the controller (Task 6).

- [ ] **Step 2: Verify lint passes**

Run: `npm run lint` — Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/world/state
git commit -m "feat: add world UI state context"
```

---

### Task 3: Desktop gate + lazy /world route

**Files:**
- Create: `src/world/gate.ts`
- Create: `src/pages/World.tsx`
- Modify: `src/App.tsx` (add lazy route)
- Test: `src/world/__tests__/gate.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `canEnterWorld(env: WorldEnv): boolean`, `detectWorldEnv(): WorldEnv` where `interface WorldEnv { isTouchDevice: boolean; hasWebGL: boolean }`. `World` page component (default export) used by the router. Redirect carries `state: { worldBlocked: true }` — the 2D site's notice (Plan 3) reads it.

- [ ] **Step 1: Write failing tests**

`src/world/__tests__/gate.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { canEnterWorld } from "../gate";

describe("canEnterWorld", () => {
  it("allows desktop with WebGL", () => {
    expect(canEnterWorld({ isTouchDevice: false, hasWebGL: true })).toBe(true);
  });
  it("blocks touch devices even with WebGL", () => {
    expect(canEnterWorld({ isTouchDevice: true, hasWebGL: true })).toBe(false);
  });
  it("blocks missing WebGL", () => {
    expect(canEnterWorld({ isTouchDevice: false, hasWebGL: false })).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` — Expected: FAIL — cannot resolve `../gate`.

- [ ] **Step 3: Implement `src/world/gate.ts`**

```ts
export interface WorldEnv {
  isTouchDevice: boolean;
  hasWebGL: boolean;
}

export function canEnterWorld(env: WorldEnv): boolean {
  return !env.isTouchDevice && env.hasWebGL;
}

export function detectWorldEnv(): WorldEnv {
  const isTouchDevice =
    typeof window !== "undefined" &&
    (navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches);
  let hasWebGL = false;
  try {
    const canvas = document.createElement("canvas");
    hasWebGL = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    hasWebGL = false;
  }
  return { isTouchDevice, hasWebGL };
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test` — Expected: PASS.

- [ ] **Step 5: Create `src/pages/World.tsx`**

```tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { canEnterWorld, detectWorldEnv } from "../world/gate";
import { WorldStateProvider } from "../world/state/WorldStateContext";
import WorldCanvas from "../world/scene/WorldCanvas";

export default function World() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    setAllowed(canEnterWorld(detectWorldEnv()));
  }, []);

  if (allowed === null) return null;
  if (!allowed) return <Navigate to="/" replace state={{ worldBlocked: true }} />;
  return (
    <WorldStateProvider>
      <WorldCanvas />
    </WorldStateProvider>
  );
}
```

`WorldCanvas` does not exist yet — create a stub `src/world/scene/WorldCanvas.tsx` so the build stays green:

```tsx
export default function WorldCanvas() {
  return <div style={{ position: "fixed", inset: 0, background: "#87ceeb" }} />;
}
```

- [ ] **Step 6: Add the route in `src/App.tsx`**

Next to the existing `AIDemos` lazy import add:

```tsx
// Lazy-loaded: three.js scene graph should never ship to visitors who stay on the 2D site.
const World = lazy(() => import("./pages/World"));
```

And in `<Routes>` before the wildcard:

```tsx
<Route path="/world" element={<World />} />
```

- [ ] **Step 7: Verify build + manual check**

Run: `npm run build && npm run lint` — Expected: clean.
Run: `npm run dev`, open `http://localhost:5173/world` — sky-blue fullscreen div on desktop.

- [ ] **Step 8: Commit**

```bash
git add src/world src/pages/World.tsx src/App.tsx
git commit -m "feat: add desktop-gated lazy /world route"
```

---

### Task 4: Scene scaffold (island, lights, sky)

**Files:**
- Modify: `src/world/scene/WorldCanvas.tsx` (replace stub)
- Create: `src/world/scene/Island.tsx`

**Interfaces:**
- Consumes: `ISLAND_RADIUS`, `LANDMARKS` from `worldConfig`.
- Produces: `WorldCanvas` (default export) mounting `<Canvas>`; `Island` (default export) rendering ground + placeholder landmark blocks. Ground is flat at `y = 0`. Later tasks mount siblings inside the same `<Canvas>`.

- [ ] **Step 1: Implement `Island.tsx`**

```tsx
import { ISLAND_RADIUS, LANDMARKS } from "../worldConfig";

export default function Island() {
  return (
    <group>
      {/* ground disc — blocky look comes from flat shading + Plan 2 textures */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[ISLAND_RADIUS, 48]} />
        <meshStandardMaterial color="#4c9e3f" flatShading />
      </mesh>
      {/* placeholder landmark blocks, replaced by glTF in Plan 2 */}
      {LANDMARKS.map((l) => (
        <mesh key={l.id} position={[l.position[0], 2, l.position[2]]} castShadow>
          <boxGeometry args={[6, 4, 6]} />
          <meshStandardMaterial color={l.itemColor} flatShading />
        </mesh>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Replace `WorldCanvas.tsx` stub**

```tsx
import { Canvas } from "@react-three/fiber";
import Island from "./Island";

export default function WorldCanvas() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Canvas shadows camera={{ fov: 75, position: [0, 1.8, 8] }}>
        <color attach="background" args={["#87ceeb"]} />
        <fog attach="fog" args={["#87ceeb", 60, 140]} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[30, 50, 20]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Island />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Manual verify**

`npm run dev` → `/world`: green island, 9 colored blocks in a ring, sky + fog. `npm run lint` clean.

- [ ] **Step 4: Commit**

```bash
git add src/world/scene
git commit -m "feat: render island scaffold with placeholder landmarks"
```

---

### Task 5: Movement math (pure, tested)

**Files:**
- Create: `src/world/controls/physics.ts`
- Test: `src/world/__tests__/physics.test.ts`

**Interfaces:**
- Consumes: `ISLAND_RADIUS` from `worldConfig`.
- Produces (Task 6 consumes all of these):
  ```ts
  const WALK_SPEED = 5.5, JUMP_SPEED = 8, GRAVITY = -24,
        PLAYER_EYE_HEIGHT = 1.8, PLAYER_RADIUS = 0.6;
  interface Box2D { minX: number; maxX: number; minZ: number; maxZ: number }
  landmarkBoxes(): Box2D[]                       // from LANDMARKS, 6x6 footprint + radius
  directionFromKeys(keys: ReadonlySet<string>, yaw: number): [number, number]  // world-space unit dir (dx,dz), [0,0] if none
  clampToIsland(x: number, z: number): [number, number]
  pushOutOfBox(x: number, z: number, box: Box2D): [number, number]
  stepVertical(y: number, vy: number, dt: number): { y: number; vy: number; grounded: boolean }  // ground at y=0
  ```

- [ ] **Step 1: Write failing tests**

`src/world/__tests__/physics.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  clampToIsland, directionFromKeys, pushOutOfBox, stepVertical,
} from "../controls/physics";
import { ISLAND_RADIUS } from "../worldConfig";

describe("directionFromKeys", () => {
  it("returns zero with no keys", () => {
    expect(directionFromKeys(new Set(), 0)).toEqual([0, 0]);
  });
  it("W at yaw 0 moves toward -Z", () => {
    const [dx, dz] = directionFromKeys(new Set(["KeyW"]), 0);
    expect(dx).toBeCloseTo(0);
    expect(dz).toBeCloseTo(-1);
  });
  it("ArrowUp behaves exactly like W", () => {
    expect(directionFromKeys(new Set(["ArrowUp"]), 1.2))
      .toEqual(directionFromKeys(new Set(["KeyW"]), 1.2));
  });
  it("opposite keys cancel", () => {
    expect(directionFromKeys(new Set(["KeyW", "KeyS"]), 0)).toEqual([0, 0]);
  });
  it("diagonals are unit length", () => {
    const [dx, dz] = directionFromKeys(new Set(["KeyW", "KeyD"]), 0);
    expect(Math.hypot(dx, dz)).toBeCloseTo(1);
  });
});

describe("clampToIsland", () => {
  it("leaves inside points alone", () => {
    expect(clampToIsland(3, -4)).toEqual([3, -4]);
  });
  it("clamps outside points to the rim", () => {
    const [x, z] = clampToIsland(ISLAND_RADIUS * 2, 0);
    expect(Math.hypot(x, z)).toBeCloseTo(ISLAND_RADIUS - 1);
  });
});

describe("pushOutOfBox", () => {
  const box = { minX: -3, maxX: 3, minZ: -3, maxZ: 3 };
  it("ignores points outside the box", () => {
    expect(pushOutOfBox(10, 10, box)).toEqual([10, 10]);
  });
  it("pushes along the axis of least penetration", () => {
    const [x, z] = pushOutOfBox(2.5, 0, box);
    expect(x).toBeCloseTo(3);
    expect(z).toBeCloseTo(0);
  });
});

describe("stepVertical", () => {
  it("stays grounded at rest", () => {
    const r = stepVertical(0, 0, 1 / 60);
    expect(r.grounded).toBe(true);
    expect(r.y).toBe(0);
  });
  it("jump rises then falls back to ground", () => {
    let y = 0, vy = 8, grounded = false;
    let peak = 0;
    for (let i = 0; i < 300; i++) {
      ({ y, vy, grounded } = stepVertical(y, vy, 1 / 60));
      peak = Math.max(peak, y);
      if (grounded && i > 5) break;
    }
    expect(peak).toBeGreaterThan(1);
    expect(grounded).toBe(true);
    expect(y).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` — Expected: FAIL — cannot resolve `../controls/physics`.

- [ ] **Step 3: Implement `src/world/controls/physics.ts`**

```ts
import { ISLAND_RADIUS, LANDMARKS } from "../worldConfig";

export const WALK_SPEED = 5.5;
export const JUMP_SPEED = 8;
export const GRAVITY = -24;
export const PLAYER_EYE_HEIGHT = 1.8;
export const PLAYER_RADIUS = 0.6;

export interface Box2D { minX: number; maxX: number; minZ: number; maxZ: number }

/** Landmark footprints (6x6 placeholder blocks) inflated by the player radius. */
export function landmarkBoxes(): Box2D[] {
  const half = 3 + PLAYER_RADIUS;
  return LANDMARKS.map((l) => ({
    minX: l.position[0] - half, maxX: l.position[0] + half,
    minZ: l.position[2] - half, maxZ: l.position[2] + half,
  }));
}

export function directionFromKeys(
  keys: ReadonlySet<string>, yaw: number,
): [number, number] {
  const has = (...codes: string[]) => codes.some((c) => keys.has(c));
  let forward = 0, strafe = 0;
  if (has("KeyW", "ArrowUp")) forward += 1;
  if (has("KeyS", "ArrowDown")) forward -= 1;
  if (has("KeyD", "ArrowRight")) strafe += 1;
  if (has("KeyA", "ArrowLeft")) strafe -= 1;
  if (forward === 0 && strafe === 0) return [0, 0];
  // yaw 0 faces -Z; rotate the local (strafe, -forward) vector by yaw
  const len = Math.hypot(forward, strafe);
  const f = forward / len, s = strafe / len;
  const sin = Math.sin(yaw), cos = Math.cos(yaw);
  return [s * cos - f * sin, -f * cos - s * sin];
}

export function clampToIsland(x: number, z: number): [number, number] {
  const max = ISLAND_RADIUS - 1;
  const d = Math.hypot(x, z);
  if (d <= max) return [x, z];
  return [(x / d) * max, (z / d) * max];
}

export function pushOutOfBox(x: number, z: number, box: Box2D): [number, number] {
  if (x <= box.minX || x >= box.maxX || z <= box.minZ || z >= box.maxZ) return [x, z];
  const left = x - box.minX, right = box.maxX - x;
  const near = z - box.minZ, far = box.maxZ - z;
  const min = Math.min(left, right, near, far);
  if (min === left) return [box.minX, z];
  if (min === right) return [box.maxX, z];
  if (min === near) return [x, box.minZ];
  return [x, box.maxZ];
}

export function stepVertical(
  y: number, vy: number, dt: number,
): { y: number; vy: number; grounded: boolean } {
  const nvy = vy + GRAVITY * dt;
  const ny = y + nvy * dt;
  if (ny <= 0) return { y: 0, vy: 0, grounded: true };
  return { y: ny, vy: nvy, grounded: false };
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/world/controls src/world/__tests__
git commit -m "feat: add pure movement and collision math"
```

---

### Task 6: PlayerController (pointer lock, walk, jump)

**Files:**
- Create: `src/world/controls/PlayerController.tsx`
- Modify: `src/world/scene/WorldCanvas.tsx` (mount controller)

**Interfaces:**
- Consumes: physics exports (Task 5), `SPAWN_POSITION` (Task 1), `useWorldState` (Task 2).
- Produces: `PlayerController` (default export). It owns the camera: position = player eye, rotation from mouse. Exposes the player position to siblings via a ref prop: `PlayerController({ positionRef }: { positionRef: MutableRefObject<Vector3> })`. Movement input is ignored while `inFlight || overlayOpen`.

- [ ] **Step 1: Implement `PlayerController.tsx`**

```tsx
import { useEffect, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import type { Vector3 } from "three";
import { useWorldState } from "../state/WorldStateContext";
import { SPAWN_POSITION } from "../worldConfig";
import {
  JUMP_SPEED, PLAYER_EYE_HEIGHT, WALK_SPEED,
  clampToIsland, directionFromKeys, landmarkBoxes, pushOutOfBox, stepVertical,
} from "./physics";

const BOXES = landmarkBoxes();

export default function PlayerController({
  positionRef,
}: {
  positionRef: MutableRefObject<Vector3>;
}) {
  const camera = useThree((s) => s.camera);
  const { inFlight, overlayOpen } = useWorldState();
  const keys = useRef(new Set<string>());
  const feetY = useRef(0);
  const vy = useRef(0);
  const grounded = useRef(true);

  useEffect(() => {
    camera.position.set(SPAWN_POSITION[0], PLAYER_EYE_HEIGHT, SPAWN_POSITION[2]);
  }, [camera]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.code);
      if (e.code === "Space" && grounded.current && !inFlight && !overlayOpen) {
        vy.current = JUMP_SPEED;
        grounded.current = false;
      }
      // Arrows scroll the page by default — this is a fullscreen game view.
      if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [inFlight, overlayOpen]);

  useFrame((_, dt) => {
    if (inFlight) return; // CameraDirector owns the camera during flights
    const step = Math.min(dt, 1 / 30); // clamp tab-switch spikes
    if (!overlayOpen) {
      const yaw = camera.rotation.y;
      const [dx, dz] = directionFromKeys(keys.current, yaw);
      let x = camera.position.x + dx * WALK_SPEED * step;
      let z = camera.position.z + dz * WALK_SPEED * step;
      [x, z] = clampToIsland(x, z);
      for (const box of BOXES) [x, z] = pushOutOfBox(x, z, box);
      camera.position.x = x;
      camera.position.z = z;
    }
    const v = stepVertical(feetY.current, vy.current, step);
    feetY.current = v.y;
    vy.current = v.vy;
    grounded.current = v.grounded;
    camera.position.y = v.y + PLAYER_EYE_HEIGHT;
    positionRef.current.copy(camera.position);
  });

  // Overlay needs the cursor; drop pointer lock while it is open.
  return overlayOpen ? null : <PointerLockControls makeDefault />;
}
```

- [ ] **Step 2: Mount in `WorldCanvas.tsx`**

```tsx
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import Island from "./Island";
import PlayerController from "../controls/PlayerController";

export default function WorldCanvas() {
  const positionRef = useRef(new Vector3());
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Canvas shadows camera={{ fov: 75, position: [0, 1.8, 8] }}>
        {/* ...existing color/fog/lights/Island unchanged... */}
        <PlayerController positionRef={positionRef} />
      </Canvas>
    </div>
  );
}
```

(Keep the existing scene children; only the wrapper + controller lines are new.)

- [ ] **Step 3: Manual verify**

`npm run dev` → `/world`: click canvas to lock pointer; WASD **and** arrows walk, mouse looks, Space jumps and lands, island edge and landmark blocks stop you, ESC releases pointer. `npm run lint` + `npm test` clean.

- [ ] **Step 4: Commit**

```bash
git add src/world
git commit -m "feat: add first-person player controller with collision"
```

---

### Task 7: Hotbar UI

**Files:**
- Create: `src/world/ui/Hotbar.tsx`
- Create: `src/world/ui/hotkeys.ts`
- Modify: `src/pages/World.tsx` (render Hotbar over canvas)
- Test: `src/world/__tests__/hotkeys.test.ts`

**Interfaces:**
- Consumes: `useWorldState` (Task 2), `LANDMARKS` (Task 1).
- Produces: `slotFromKeyCode(code: string): number | null` (pure); `Hotbar` (default export) — 9 DOM slots bottom-center, click or keys 1–9 call `selectSlot`.

- [ ] **Step 1: Write failing tests**

`src/world/__tests__/hotkeys.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { slotFromKeyCode } from "../ui/hotkeys";

describe("slotFromKeyCode", () => {
  it("maps Digit1..Digit9", () => {
    expect(slotFromKeyCode("Digit1")).toBe(1);
    expect(slotFromKeyCode("Digit9")).toBe(9);
  });
  it("maps Numpad1..Numpad9", () => {
    expect(slotFromKeyCode("Numpad5")).toBe(5);
  });
  it("rejects everything else", () => {
    expect(slotFromKeyCode("Digit0")).toBeNull();
    expect(slotFromKeyCode("KeyW")).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` — Expected: FAIL.

- [ ] **Step 3: Implement `src/world/ui/hotkeys.ts`**

```ts
export function slotFromKeyCode(code: string): number | null {
  const m = /^(?:Digit|Numpad)([1-9])$/.exec(code);
  return m ? Number(m[1]) : null;
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test` — Expected: PASS.

- [ ] **Step 5: Implement `src/world/ui/Hotbar.tsx`**

```tsx
import { useEffect } from "react";
import { LANDMARKS } from "../worldConfig";
import { useWorldState } from "../state/WorldStateContext";
import { slotFromKeyCode } from "./hotkeys";

export default function Hotbar() {
  const { activeSlot, selectSlot } = useWorldState();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const slot = slotFromKeyCode(e.code);
      if (slot !== null) selectSlot(slot);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectSlot]);

  return (
    <div className="world-hotbar" role="toolbar" aria-label="Sections">
      {LANDMARKS.map((l) => (
        <button
          key={l.slot}
          className={`world-hotbar-slot${activeSlot === l.slot ? " is-active" : ""}`}
          style={{ borderColor: l.itemColor }}
          title={l.name}
          onClick={() => selectSlot(l.slot)}
        >
          {l.slot}
        </button>
      ))}
    </div>
  );
}
```

Styling (Tailwind 4 is utility-first, but the hotbar is a one-off game HUD — a small CSS block is simpler). Create the classes in `src/index.css` (or the project's global stylesheet):

```css
.world-hotbar {
  position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 4px; padding: 4px;
  background: rgba(20, 20, 20, 0.7); border: 2px solid #555;
  image-rendering: pixelated; z-index: 20;
}
.world-hotbar-slot {
  width: 48px; height: 48px; border: 2px solid #333;
  background: rgba(60, 60, 60, 0.8); color: #eee;
  font-family: monospace; font-size: 18px; cursor: pointer;
}
.world-hotbar-slot.is-active { outline: 3px solid #fff; }
```

- [ ] **Step 6: Render over canvas in `src/pages/World.tsx`**

Inside `<WorldStateProvider>`:

```tsx
<WorldStateProvider>
  <WorldCanvas />
  <Hotbar />
</WorldStateProvider>
```

- [ ] **Step 7: Manual verify + commit**

`npm run dev` → `/world`: hotbar visible, keys 1–9 and clicks highlight slots. Lint + tests clean.

```bash
git add src/world src/pages/World.tsx src/index.css
git commit -m "feat: add minecraft-style hotbar with slot hotkeys"
```

---

### Task 8: Camera flights (gsap)

**Files:**
- Create: `src/world/controls/flightPath.ts`
- Create: `src/world/controls/CameraDirector.tsx`
- Modify: `src/world/scene/WorldCanvas.tsx` (mount director)
- Test: `src/world/__tests__/flightPath.test.ts`

**Interfaces:**
- Consumes: `getLandmarkBySlot`, `LandingPose` (Task 1), `useWorldState` (Task 2), camera via `useThree`.
- Produces: `quadBezier(a: Vec3, b: Vec3, c: Vec3, t: number): Vec3` and `flightControlPoint(from: Vec3, to: Vec3): Vec3` (pure, `type Vec3 = [number, number, number]`); `CameraDirector` (default export) — watches `activeSlot`, tweens player+camera to the landing pose, sets `inFlight` around the tween.

- [ ] **Step 1: Write failing tests**

`src/world/__tests__/flightPath.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { flightControlPoint, quadBezier } from "../controls/flightPath";

describe("quadBezier", () => {
  const a: [number, number, number] = [0, 0, 0];
  const b: [number, number, number] = [5, 10, 5];
  const c: [number, number, number] = [10, 0, 10];
  it("hits endpoints at t=0 and t=1", () => {
    expect(quadBezier(a, b, c, 0)).toEqual(a);
    expect(quadBezier(a, b, c, 1)).toEqual(c);
  });
  it("arcs above the endpoints midway", () => {
    expect(quadBezier(a, b, c, 0.5)[1]).toBeGreaterThan(0);
  });
});

describe("flightControlPoint", () => {
  it("sits midway horizontally and above both ends", () => {
    const cp = flightControlPoint([0, 2, 0], [10, 2, 0]);
    expect(cp[0]).toBeCloseTo(5);
    expect(cp[1]).toBeGreaterThan(2);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test` — Expected: FAIL.

- [ ] **Step 3: Implement `src/world/controls/flightPath.ts`**

```ts
export type Vec3 = [number, number, number];

export function quadBezier(a: Vec3, b: Vec3, c: Vec3, t: number): Vec3 {
  const u = 1 - t;
  return [0, 1, 2].map(
    (i) => u * u * a[i] + 2 * u * t * b[i] + t * t * c[i],
  ) as Vec3;
}

/** Arc peak: midway between the endpoints, lifted by a third of the distance (min 6). */
export function flightControlPoint(from: Vec3, to: Vec3): Vec3 {
  const dist = Math.hypot(to[0] - from[0], to[2] - from[2]);
  const lift = Math.max(6, dist / 3);
  return [
    (from[0] + to[0]) / 2,
    Math.max(from[1], to[1]) + lift,
    (from[2] + to[2]) / 2,
  ];
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test` — Expected: PASS.

- [ ] **Step 5: Implement `CameraDirector.tsx`**

```tsx
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useWorldState } from "../state/WorldStateContext";
import { getLandmarkBySlot } from "../worldConfig";
import { PLAYER_EYE_HEIGHT } from "./physics";
import { flightControlPoint, quadBezier, type Vec3 } from "./flightPath";

const FLIGHT_SECONDS = 2.5;

export default function CameraDirector() {
  const camera = useThree((s) => s.camera);
  const { activeSlot, setInFlight } = useWorldState();
  const lastFlown = useRef<number | null>(null);

  useEffect(() => {
    if (activeSlot === null || activeSlot === lastFlown.current) return;
    const landmark = getLandmarkBySlot(activeSlot);
    if (!landmark) return;
    lastFlown.current = activeSlot;

    const { position, yaw, pitch } = landmark.landingPose;
    const from: Vec3 = [camera.position.x, camera.position.y, camera.position.z];
    const to: Vec3 = [position[0], PLAYER_EYE_HEIGHT, position[2]];
    const cp = flightControlPoint(from, to);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setInFlight(true);
    const state = { t: 0 };
    const startYaw = camera.rotation.y;
    const startPitch = camera.rotation.x;
    const tween = gsap.to(state, {
      t: 1,
      duration: reduced ? 0.01 : FLIGHT_SECONDS,
      ease: "power2.inOut",
      onUpdate: () => {
        const [x, y, z] = quadBezier(from, cp, to, state.t);
        camera.position.set(x, y, z);
        camera.rotation.set(
          startPitch + (pitch - startPitch) * state.t,
          startYaw + (yaw - startYaw) * state.t,
          0,
          "YXZ",
        );
      },
      onComplete: () => setInFlight(false),
    });
    return () => {
      tween.kill();
      setInFlight(false);
    };
  }, [activeSlot, camera, setInFlight]);

  return null;
}
```

Note: PointerLockControls also writes camera rotation — during flights `inFlight` stops PlayerController, and the pointer stays locked; the small mouse-look fights are acceptable for v1 (matches spec's "input locked" loosely — movement locked, look blended).

- [ ] **Step 6: Mount `<CameraDirector />` inside the Canvas** (sibling of `PlayerController`).

- [ ] **Step 7: Manual verify + commit**

`npm run dev` → `/world`: press 4 — smooth ~2.5 s arc to the forge, walking resumes after landing. Reduced-motion OS setting → instant cut.

```bash
git add src/world
git commit -m "feat: add gsap camera flights to hotbar landmarks"
```

---

### Task 9: Landmark proximity + interact prompt

**Files:**
- Create: `src/world/controls/proximity.ts`
- Create: `src/world/ui/InteractPrompt.tsx`
- Modify: `src/pages/World.tsx`, `src/world/scene/WorldCanvas.tsx`
- Test: `src/world/__tests__/proximity.test.ts`

**Interfaces:**
- Consumes: `LANDMARKS` (Task 1), `positionRef` (Task 6), `useWorldState` (Task 2).
- Produces: `nearestLandmark(pos: [number, number, number], maxDist: number): Landmark | null` (pure). `InteractPrompt` shows "E — read" when near; `World.tsx` wires E/right-click → `selectSlot` is NOT called — instead `openOverlay()` when a landmark is near. A shared `nearLandmarkRef: MutableRefObject<Landmark | null>` (created in `World.tsx`, updated by a small `ProximitySensor` R3F component) tells the DOM layer what is nearby; overlay content key comes from `activeSlot ?? near landmark`.

  Concretely `World.tsx` gains:
  ```ts
  const nearRef = useRef<Landmark | null>(null);      // updated per-frame in canvas
  const [nearSlot, setNearSlot] = useState<number | null>(null); // throttled mirror for DOM
  ```
  `ProximitySensor` (in `WorldCanvas`) copies `nearestLandmark(...)` into `nearRef` each frame and calls `setNearSlot(l?.slot ?? null)` only when the value changes (state updates stay rare).

- [ ] **Step 1: Write failing tests**

`src/world/__tests__/proximity.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { nearestLandmark } from "../controls/proximity";
import { getLandmarkBySlot } from "../worldConfig";

describe("nearestLandmark", () => {
  it("returns null when nothing is close", () => {
    expect(nearestLandmark([0, 0, 0], 8)).toBeNull();
  });
  it("finds the landmark you are standing next to", () => {
    const tavern = getLandmarkBySlot(1)!;
    const [x, , z] = tavern.landingPose.position;
    expect(nearestLandmark([x, 1.8, z], 8)?.slot).toBe(1);
  });
});
```

- [ ] **Step 2: Run to verify failure** — `npm test` FAILs.

- [ ] **Step 3: Implement `src/world/controls/proximity.ts`**

```ts
import { LANDMARKS, type Landmark } from "../worldConfig";

export function nearestLandmark(
  pos: [number, number, number], maxDist: number,
): Landmark | null {
  let best: Landmark | null = null;
  let bestD = maxDist;
  for (const l of LANDMARKS) {
    const d = Math.hypot(pos[0] - l.position[0], pos[2] - l.position[2]);
    if (d < bestD) { best = l; bestD = d; }
  }
  return best;
}
```

- [ ] **Step 4: Run tests to verify pass** — `npm test` PASSes.

- [ ] **Step 5: Wire sensor + prompt + interact keys**

`ProximitySensor` inside `WorldCanvas.tsx`:

```tsx
function ProximitySensor({
  positionRef, onChange,
}: {
  positionRef: MutableRefObject<Vector3>;
  onChange: (slot: number | null) => void;
}) {
  const last = useRef<number | null>(null);
  useFrame(() => {
    const p = positionRef.current;
    const near = nearestLandmark([p.x, p.y, p.z], 9);
    const slot = near?.slot ?? null;
    if (slot !== last.current) { last.current = slot; onChange(slot); }
  });
  return null;
}
```

`InteractPrompt.tsx`:

```tsx
export default function InteractPrompt({ visible, name }: { visible: boolean; name: string }) {
  if (!visible) return null;
  return <div className="world-prompt">Press <b>E</b> to read — {name}</div>;
}
```

CSS (same global stylesheet):

```css
.world-prompt {
  position: fixed; bottom: 84px; left: 50%; transform: translateX(-50%);
  padding: 6px 14px; background: rgba(20, 20, 20, 0.8); color: #fff;
  font-family: monospace; z-index: 20;
}
```

In `World.tsx`: listen for `keydown` E and `contextmenu` (right-click; `e.preventDefault()`), when `nearSlot !== null && !overlayOpen && !inFlight` call `selectSlot(nearSlot)` then `openOverlay()`. Pass `onChange={setNearSlot}` down to `WorldCanvas`/`ProximitySensor` and render `<InteractPrompt visible={nearSlot !== null && !overlayOpen} name={...} />`.

- [ ] **Step 6: Manual verify + commit**

Walk to a block → prompt appears; E or right-click sets slot + opens overlay flag (overlay itself is Task 10 — for now nothing visible happens beyond state; verify via React DevTools or temporary console.log, remove it after).

```bash
git add src/world src/pages/World.tsx src/index.css
git commit -m "feat: add landmark proximity sensing and interact prompt"
```

---

### Task 10: Content overlay panel

**Files:**
- Create: `src/world/ui/OverlayPanel.tsx`
- Create: `src/world/ui/sectionContent.tsx`
- Modify: `src/pages/World.tsx` (render overlay)

**Interfaces:**
- Consumes: `useWorldState`, `getLandmarkBySlot`, `portfolioData` from `src/data/portfolio.ts` (typed `PortfolioData`).
- Produces: `OverlayPanel` (default export) — fullscreen-dimmed modal, tome-styled card, close on ESC or ✕ button; `renderSection(key: SectionKey): ReactNode` in `sectionContent.tsx`.

- [ ] **Step 1: Implement `sectionContent.tsx`**

One renderer per `SectionKey`, all reading `portfolioData`. Real content, minimal markup — Plan 2/3 bring full styling. Complete file:

```tsx
import type { ReactNode } from "react";
import { portfolioData } from "../../data/portfolio";
import type { SectionKey } from "../worldConfig";

const d = portfolioData;

export function renderSection(key: SectionKey): ReactNode {
  switch (key) {
    case "about":
      return (
        <>
          <h2>{d.personal.name}</h2>
          <p><em>{d.personal.title} — {d.personal.tagline}</em></p>
          <p>{d.personal.bio}</p>
          <p>{d.personal.location}</p>
        </>
      );
    case "experience":
      return d.experience.map((e) => (
        <article key={e.id}>
          <h3>{e.title} @ {e.company}</h3>
          <p><em>{e.duration} — {e.location}</em></p>
          <p>{e.description}</p>
        </article>
      ));
    case "skills":
      return Object.entries(d.skills).map(([name, cat]) => (
        <p key={name}><b>{name}:</b> {cat.skills.join(", ")}</p>
      ));
    case "projects":
      return d.projects.map((p) => (
        <article key={p.id}>
          <h3>{p.title}{p.award ? ` 🏆 ${p.award}` : ""}</h3>
          <p>{p.description}</p>
        </article>
      ));
    case "education":
      return d.education.map((e) => (
        <article key={e.school}>
          <h3>{e.degree}</h3>
          <p>{e.school} — {e.duration} — GPA {e.gpa}</p>
        </article>
      ));
    case "awards":
      return (
        <ul>
          {[...d.awards, ...d.certifications].map((a) => <li key={a}>{a}</li>)}
        </ul>
      );
    case "aiDemos":
      // Embedded TF.js demos arrive with Plan 2 polish; teaser + link for now.
      return (
        <>
          <p>The wizard's experiments — live AI running in your browser.</p>
          <p><a href="/ai-demos">Open the spellbook →</a></p>
        </>
      );
    case "contact":
      return (
        <>
          <p><a href={`mailto:${d.personal.email}`}>{d.personal.email}</a></p>
          <p><a href={d.personal.socialLinks.github}>GitHub</a> · <a href={d.personal.socialLinks.linkedin}>LinkedIn</a></p>
        </>
      );
    case "secret":
      // The mimic ambush is Plan 2. Innocent-looking placeholder.
      return <p>A locked chest sits in the gloom. It seems… ordinary.</p>;
  }
}
```

- [ ] **Step 2: Implement `OverlayPanel.tsx`**

```tsx
import { useEffect } from "react";
import { useWorldState } from "../state/WorldStateContext";
import { getLandmarkBySlot } from "../worldConfig";
import { renderSection } from "./sectionContent";

export default function OverlayPanel() {
  const { activeSlot, overlayOpen, closeOverlay } = useWorldState();

  useEffect(() => {
    if (!overlayOpen) return;
    document.exitPointerLock?.();
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen, closeOverlay]);

  if (!overlayOpen || activeSlot === null) return null;
  const landmark = getLandmarkBySlot(activeSlot);
  if (!landmark) return null;

  return (
    <div className="world-overlay" role="dialog" aria-modal="true" aria-label={landmark.name}>
      <div className="world-overlay-card">
        <header>
          <h1>{landmark.name}</h1>
          <button onClick={closeOverlay} aria-label="Close">✕</button>
        </header>
        <div className="world-overlay-body">{renderSection(landmark.sectionKey)}</div>
      </div>
    </div>
  );
}
```

CSS:

```css
.world-overlay {
  position: fixed; inset: 0; z-index: 30;
  display: grid; place-items: center; background: rgba(0, 0, 0, 0.55);
}
.world-overlay-card {
  width: min(720px, 90vw); max-height: 80vh; overflow-y: auto;
  background: #f0e2c0; color: #2b2116; border: 4px solid #6b5535;
  padding: 24px; font-family: Georgia, serif;
}
.world-overlay-card header { display: flex; justify-content: space-between; }
```

- [ ] **Step 3: Render `<OverlayPanel />` in `World.tsx`** (after Hotbar).

- [ ] **Step 4: Manual verify**

Full loop: press 2 → fly to guild hall → walk close → prompt → E → tome overlay with real experience entries → ESC closes, click canvas re-locks pointer, walking works. All 9 slots show correct content. `npm run lint && npm test && npm run build` all clean.

- [ ] **Step 5: Commit**

```bash
git add src/world src/pages/World.tsx src/index.css
git commit -m "feat: add tome overlay panels fed by portfolio data"
```

---

### Task 11: Held item placeholder

**Files:**
- Create: `src/world/scene/HeldItem.tsx`
- Modify: `src/world/scene/WorldCanvas.tsx`

**Interfaces:**
- Consumes: `useWorldState` (activeSlot), `getLandmarkBySlot` (itemColor).
- Produces: `HeldItem` — small colored primitive fixed to the camera's lower-right, swaps tint per slot. Plan 2 replaces the primitive with real D&D item models.

- [ ] **Step 1: Implement**

```tsx
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { useWorldState } from "../state/WorldStateContext";
import { getLandmarkBySlot } from "../worldConfig";

export default function HeldItem() {
  const camera = useThree((s) => s.camera);
  const group = useRef<Group>(null);
  const { activeSlot } = useWorldState();
  const color = activeSlot ? getLandmarkBySlot(activeSlot)?.itemColor ?? "#888" : "#888";

  useEffect(() => {
    const g = group.current;
    if (!g) return;
    camera.add(g);
    g.position.set(0.5, -0.45, -1);
    return () => { camera.remove(g); };
  }, [camera]);

  return (
    <group ref={group}>
      <mesh rotation={[0.2, -0.4, 0.1]}>
        <boxGeometry args={[0.18, 0.5, 0.18]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Mount inside Canvas, manual verify** — item visible lower-right, tint changes with slot, sways naturally with look (it's parented to the camera).

- [ ] **Step 3: Full regression + commit**

Run: `npm run lint && npm test && npm run build` — all clean. Walk the full loop once more.

```bash
git add src/world
git commit -m "feat: add held item placeholder bound to hotbar slot"
```

---

## Definition of Done (Plan 1)

- `/world` unreachable on touch/no-WebGL (redirects home with `worldBlocked` state).
- Desktop: pointer-lock look, WASD+arrows walk, Space jump, collision with 9 blocks + island rim.
- Keys 1–9 / hotbar clicks fly the player smoothly (~2.5 s, reduced-motion instant) to landing poses.
- Near a landmark: prompt → E / right-click opens tome overlay with real `portfolioData.json` content; ESC returns to play.
- Held placeholder item tracks active slot.
- `npm run lint`, `npm test`, `npm run build` all green; every task committed.

**Not in this plan (Plan 2):** real models/textures, portal entry, day-night, audio + M mute, mimic death/respawn, deep links, error boundary, perf pass. **(Plan 3):** 2D restyle + Enter World button.
