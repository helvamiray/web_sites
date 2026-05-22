/**
 * Scene units treated as approximate metres. One engineering grid module = CELL m.
 */

export const GRID_CELL = 0.5;

export function snapGrid(v: number): number {
  return Math.round(v / GRID_CELL) * GRID_CELL;
}

/** Upper floor radiator band (mid-wall, grid-snapped). */
export const UPPER_RADIATOR_BAND_Y = snapGrid(4.35);

/** Wall-mount AC sill line (comfort mounting band). */
export const AC_SIL_Y = snapGrid(4.7);

/** Wall plane inset from shell (interior drywall line). */
const W_FRONT = snapGrid(1.95);
const W_BACK = -snapGrid(1.95);

export const SCALE = {
  /** Equipment vs nominal room cube (furniture + ergonomics fudge). */
  equipment: snapGrid(0.92),
  radiator: snapGrid(0.88),
  acWidth: GRID_CELL * (11 / 5),
  acHeight: GRID_CELL * (3 / 5),
} as const;

export interface Vec3Tuple extends Array<number> {
  0: number;
  1: number;
  2: number;
}

/** Mekanik köşe: kazan / tampon / pompa / kollektör tek hatta; zemin döşemesi grid ortasında. */
export const LAYOUT = {
  boiler: [snapGrid(1.5), snapGrid(0.52) + SCALE.equipment * 0.62, snapGrid(-1.65)] as Vec3Tuple,
  tank: [snapGrid(-0.5), snapGrid(0.82) + SCALE.equipment * 0.74, snapGrid(-1.65)] as Vec3Tuple,
  pump: [snapGrid(1.25), GRID_CELL * 0.68 + 0.06, snapGrid(-0.9)] as Vec3Tuple,
  manifold: [snapGrid(-0.25), snapGrid(0.32), snapGrid(-1.55)] as Vec3Tuple,
  radiators: [
    [snapGrid(-2.5), UPPER_RADIATOR_BAND_Y, W_FRONT],
    [snapGrid(2.5), UPPER_RADIATOR_BAND_Y, W_FRONT],
    [snapGrid(0), UPPER_RADIATOR_BAND_Y, W_BACK],
  ] as Vec3Tuple[],
  /** Yerden ısıtma hatları — ortalanmış, eş aralık (9 hat). */
  underfloorXs: Array.from({ length: 9 }, (_, i) => snapGrid(-2 + i * 0.5)),
  /** Klima iç üniteleri — cephe hizası, simetrik. */
  acUnits: [
    { pos: [snapGrid(-2.5), AC_SIL_Y, W_FRONT] as Vec3Tuple, rotY: 0 },
    { pos: [snapGrid(2.5), AC_SIL_Y, W_FRONT] as Vec3Tuple, rotY: 0 },
    { pos: [snapGrid(0), AC_SIL_Y, W_BACK] as Vec3Tuple, rotY: Math.PI },
  ],
} as const;
