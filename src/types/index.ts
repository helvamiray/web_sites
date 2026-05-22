/** Types for the Digital Twin / 3D configurator page (isolated from main catalog `Product`). */

export type TwinBrandFilterId =
  | "TÜMÜ"
  | "DAİKİN"
  | "BUDERUS"
  | "E.C.A"
  | "LOWARA"
  | "KODSAN"
  | "CALEFİ"
  | "FRANKİSCHE"
  | "TYCO";

/** Brands shown only when filter is TÜMÜ (not in pill row). */
export type TwinProductBrandKey = TwinBrandFilterId | "OTHER";

export interface TwinProductTag {
  id: string;
  label: string;
  /** When true, show orange dot before label (e.g. 3D ODAK). */
  emphasis?: boolean;
}

export interface TwinConfiguratorProduct {
  id: string;
  brandKey: TwinProductBrandKey;
  brandDisplay: string;
  name: string;
  imageUrl: string;
  tags: TwinProductTag[];
  /** Optional deep link; placeholder # if none. */
  href: string;
}

export type TwinRoomId = "SHOWROOM" | "ÇATI" | "YATAK" | "SALON" | "MEKANİK";
