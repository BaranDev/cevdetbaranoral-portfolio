# Minecraft × D&D Portfolio Remake — Design Spec

**Date:** 2026-08-02
**Branch:** `minecraft-remake`
**Status:** Approved design, pending implementation plan

## Concept

The portfolio becomes a two-mode experience with a Minecraft × Dungeons & Dragons theme:

1. **2D site (`/`)** — the current React portfolio restyled as an "adventurer's tome / character sheet". Compact, fast, works everywhere. This is the default landing page for all visitors.
2. **3D world (`/world`)** — a desktop-only, first-person voxel island where each portfolio section is a landmark. Entered via an "Enter World" portal button on the 2D site.

Mobile and no-WebGL visitors see only the 2D site; the Enter World button is disabled with a notice ("Desktop only — enter the world from a PC").

## Tech Approach

**react-three-fiber + drei + gsap** — all already installed (`three`, `@react-three/fiber`, `@react-three/drei`, `gsap`). The world is a lazy-loaded route in the existing React 19 + TypeScript + Vite app, following the same code-splitting pattern already used for `/ai-demos`.

**Movement/physics: `ecctrl` + `@react-three/rapier`** (new runtime dependencies, both MIT). ecctrl is the maintained pmndrs character controller (floating capsule, spring/damping, ground friction); rapier provides the physics world and static colliders. Chosen over hand-rolling collision after research: battle-tested code beats reinventing, and it head-starts terrain height, stairs, and moving platforms if the island grows. Cost accepted: rapier's wasm bundle (~1 MB+) — mitigated by the already-lazy `/world` route.

Input uses drei's `KeyboardControls` (transient `getKeys()` polling in `useFrame` — no per-frame re-renders) with WASD and arrows in one keymap; drei `PointerLockControls` `onLock`/`onUnlock` drives the "click to play" overlay. FPS camera requires `camera.rotation.order = "YXZ"`.

Rejected alternatives: vanilla Three.js (manual React bridge, no reuse win), voxel engines like noa-engine/Babylon (heavy new dependency, overkill for a guided island), and fully hand-rolled collision math (works for a flat disc but reinvents a maintained wheel).

**Reference projects** (adapt ideas; copy code only from MIT-verified sources): `pmndrs/ecctrl` (MIT — controller itself), `brunosimon/folio-2019` (MIT — camera fly-to-section and loading-screen architecture), `briossant/vibe-coded-web-voxel-engine` (license unverified — hotbar/HUD patterns only, no code copying).

## Architecture

### Routes

| Route | Content | Loading |
|-------|---------|---------|
| `/` | Restyled 2D portfolio | Eager (main bundle) |
| `/world` | R3F voxel island | Lazy; mobile/no-WebGL redirects to `/` with a toast |
| `/world?slot=N` | Deep link — spawns then flies to landmark N | Same |
| `/ai-demos` | Existing AI demos page | Lazy (unchanged) |

### New folders

```
src/world/
  scene/       Island terrain, landmark components (glTF), lighting, day-night
  controls/    PlayerController (movement + collision), CameraDirector (gsap flights)
  ui/          Hotbar, OverlayPanel, HUD (crosshair, mute), LoadingScreen, DeathScreen
  state/       World store: active slot, overlay open/closed, flight-in-progress, muted
  audio/       Music loop + SFX manager
  worldConfig.ts   Landmark metadata: slot number, position, camera landing pose,
                   held-item model, overlay content key
public/world/  glTF models (Blockbench), CC0 textures, audio files
```

### Data flow

`src/data/portfolioData.json` remains the single content source. The 2D sections and the world's overlay panels both read from it via the existing typed accessors (`src/types/portfolio.ts`). Landmark/world metadata lives in `worldConfig.ts` only — no content duplication.

## The World

### Island and landmarks

One compact voxel island. Nine landmarks ring a central spawn plaza:

| Slot | Section | Landmark | Held item (D&D-flavored, not blocks) |
|------|---------|----------|--------------------------------------|
| 1 | About | Tavern | Map (candidate) |
| 2 | Experience | Guild hall / quest board | Sword (candidate) |
| 3 | Skills | Enchanting tower | Wand (candidate) |
| 4 | Projects | Forge / museum | Hammer (candidate) |
| 5 | Education | Library | Quill (candidate) |
| 6 | Awards | Trophy hall | Trophy (candidate) |
| 7 | AI Demos | Wizard lab | Potion (candidate) |
| 8 | Contact | Raven post / portal | Horn (candidate) |
| 9 | Easter egg | Secret dungeon | Torch (candidate) |

Held-item models are finalized at modeling time; the table lists candidates. Buildings are exterior-only shells — no enterable interiors.

### Controls — "Minecraft muscle memory" rule

Controls imitate Minecraft wherever a mapping exists. A Minecraft player should be able to do everything without instructions.

| Input | Action |
|-------|--------|
| WASD **and** arrow keys | Walk |
| Mouse (pointer lock) | Look |
| Space | Jump |
| 1–9 | Select hotbar slot → smooth flight to landmark |
| E **or** right-click | Interact ("read" a landmark, open chest) |
| ESC | Close overlay / release pointer lock |
| M | Toggle mute |

### Movement and flights

- First-person view with a held item visible in hand; the item swaps to the section's item when a hotbar slot is selected. ecctrl runs in first-person camera mode (avatar hidden or camera at head).
- Collision/physics: rapier `<Physics>` world — ground and landmark shells are fixed rigid bodies with auto colliders; ecctrl's floating capsule handles walking, jumping, and gravity. Island edge is a fixed invisible collider ring.
- Hotbar press: user input disabled, a gsap tween carries the **character rigidbody (and thus camera)** along a bezier curve (~2–3 s) to the landmark's landing pose — kinematic/teleport-per-frame control of the body during the flight — then input re-enables and walking resumes. No detached-camera desync.
- One position source of truth: the character body; the camera follows it (ecctrl-managed).

### Content overlays

Approaching a landmark shows an "E to read" prompt. Interacting opens a **themed DOM overlay** (D&D tome / Minecraft-GUI styling) rendered over the canvas — real HTML text from `portfolioData.json`, crisp and accessible. Pointer lock is released while open; ESC or a close button dismisses it. The wizard lab's overlay lazy-mounts the existing TF.js demo components inside the panel.

### Ambience

- Slow day-night cycle; torch/lantern point lights glow at night.
- CC0 ambient fantasy music loop + SFX: footsteps, hotbar click, overlay open, portal whoosh, mimic chomp, "You Died" sting. M toggles mute; toggle also in HUD.

### Easter egg — the mimic (slot 9)

Flight lands at a lone chest in a secret dungeon nook. Interacting triggers the mimic: the chest sprouts teeth and eats the player — screen lunge, red vignette, **"You Died"** text with sound — then the player respawns at the spawn plaza.

### Entry sequence

Clicking Enter World: the button becomes a swirling portal → fade to a themed loading screen (progress bar, flavor tips) → short fly-in over the island to the spawn plaza.

## Visual Style

- **Crisp low-poly voxel:** sharp voxel models, pixelated textures (nearest-neighbor filtering), full-resolution rendering. No full-frame pixelation.
- **Assets:** CC0/CC-BY texture packs (e.g. Kenney) + custom Blockbench models exported as glTF. No Mojang assets — they are copyrighted.

## 2D Site Restyle

- Keep all existing React sections and data wiring; reskin as an adventurer's tome / character sheet: parchment card backgrounds, blocky borders, pixel display font for headings + readable body font, D&D flavor labels (skills as stat blocks, experience as quest log, awards as achievements).
- Compress layout — denser, compact single-page flow.
- Hero hosts the Enter World portal button (+ mobile/desktop-only notice).
- Theme toggle stays: parchment "day" / dungeon-dark "night".
- Existing heavy parallax background replaced with a subtle themed backdrop.

## Accessibility, Analytics, Performance

- `prefers-reduced-motion`: hotbar flights become quick fades; portal sequence shortens to a plain fade.
- GA4 (existing `analytics.ts`) tracks world entry and per-slot visits as page views.
- `/world` bundle fully lazy; glTF/texture compression (Draco/KTX2) if sizes demand; single directional light with a low-res shadow map; target 60 fps on a mid-range GPU.
- WebGL failure or mobile user agent → redirect to `/` with a toast.

## Error Handling

- ErrorBoundary around the world route → themed "The portal collapsed" screen with a back-home link.
- Asset load failure → retry button on the loading screen.

## Testing

- Add **Vitest** for pure logic only: `worldConfig` validation (all 9 slots present, unique, poses well-formed), flight-path math, slot-mapping helpers. (Collision is engine-owned now — no physics unit tests.) Config lives as a `test` block in the existing Vite config (`defineConfig` from `vitest/config`), default node environment, no jsdom.
- Gameplay/visuals: manual checklist (controls, flights, overlays, mimic, entry sequence, reduced-motion, mobile gating).
- No E2E for v1.

## Out of Scope (v1)

- Enterable building interiors
- Block breaking/placing
- Mobile 3D experience
- Multiplayer, save-state persistence
- Mini-games beyond the mimic
