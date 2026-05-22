import type { TwinRoomId } from "@/types";

/** Cinematic orbit presets — architectural showroom (slow dolly / crane feel). */
export interface TwinCameraPreset {
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
}

export const DIGITAL_TWIN_SHOWROOM_CAMERA: TwinCameraPreset = {
  position: [11.8, 7.8, 14.2],
  target: [0, 1.35, 0],
};

export const DIGITAL_TWIN_ROOM_CAMERAS: Record<Exclude<TwinRoomId, "SHOWROOM">, TwinCameraPreset> = {
  SALON: { position: [7.8, 4.6, 10.2], target: [0.2, 1.25, 0.6] },
  YATAK: { position: [5.4, 3.9, 6.4], target: [-1.35, 1.35, -0.15] },
  ÇATI: { position: [5.8, 10.2, 11], target: [0, 3.55, 0.2] },
  MEKANİK: { position: [10.2, 3.2, 11.6], target: [2.25, 1.35, 2.35] },
};

/** Click targets → twin catalog ids (`twinConfiguratorProducts`). */
export interface TwinHvacZoneDefinition {
  readonly id: string;
  readonly twinProductId: string;
  readonly labelTr: string;
  readonly position: readonly [number, number, number];
  readonly inspectCamera: TwinCameraPreset;
}

export const DIGITAL_TWIN_HVAC_ZONES: TwinHvacZoneDefinition[] = [
  {
    id: "zone-vrf-a",
    twinProductId: "twin-1",
    labelTr: "İç ünite · VRF",
    position: [-1.42, 1.28, 2.06],
    inspectCamera: {
      position: [2.8, 2.05, 5.6],
      target: [-1.35, 1.35, 2.05],
    },
  },
  {
    id: "zone-vrf-b",
    twinProductId: "twin-1",
    labelTr: "İç ünite · VRF",
    position: [0.18, 1.28, 2.06],
    inspectCamera: {
      position: [4.4, 2.05, 5.8],
      target: [0.15, 1.35, 2.05],
    },
  },
  {
    id: "zone-vrf-outdoor",
    twinProductId: "twin-2",
    labelTr: "Dış ünite · VRF",
    position: [1.92, 0.82, 2.62],
    inspectCamera: {
      position: [5.8, 2.35, 6.35],
      target: [1.92, 1.05, 2.62],
    },
  },
  {
    id: "zone-circ-pump",
    twinProductId: "twin-7",
    labelTr: "Sirkülasyon · Hidronik",
    position: [-1.82, 1.22, -0.28],
    inspectCamera: {
      position: [1.85, 2.05, 3.85],
      target: [-1.75, 1.35, -0.28],
    },
  },
];

export const DIGITAL_TWIN_CYAN = "#5eead4";
export const DIGITAL_TWIN_CYAN_SOFT = "#7dd3fc";
export const DIGITAL_TWIN_GLASS = "#e2e8f0";
