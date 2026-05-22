import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Plandaki segmentler (cm) — alan etiketleri m² ile uyumlu; sahne birimi ≈ m.
 */
export const PLAN_CM = {
  W: 1140,
  D: 769,
  /** Alt sıra yüksekliği */
  Z_ROW: 261,
  /** Üst oda bandı yüksekliği (449) */
  Z_UPPER: 449,
  X_BR3: 386,
  X_VER: 366,
  X_BR1: 319,
  X_BATH: 188,
  X_BR2: 251,
  X_LIV_TOP: 382,
} as const;

export const PLAN_BUILDING = {
  width: PLAN_CM.W / 100,
  depth: PLAN_CM.D / 100,
  /** üst iç mekân z (planda "üst" sıra) */
  zSplit: PLAN_CM.Z_ROW / 100,
  zBack: (PLAN_CM.Z_ROW + PLAN_CM.Z_UPPER) / 100,
  wallT: 0.14,
  wallH: 2.72,
  floorY: 0.058,
  ceilingY: 2.74,
} as const;

/** Parquet benzeri ince dokulu zemin */
function parquetTexture(): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = 64;
  cv.height = 64;
  const cx = cv.getContext("2d")!;
  cx.fillStyle = "#dfc9a8";
  cx.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 12; i++) {
    cx.strokeStyle = i % 2 ? "#ceb896" : "#e8dcc4";
    cx.lineWidth = 1;
    cx.beginPath();
    cx.moveTo(i * 6, 0);
    cx.lineTo(i * 6 + 12, 64);
    cx.stroke();
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(14, 10);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function bathTileTex(): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = 32;
  cv.height = 32;
  const c = cv.getContext("2d")!;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      c.fillStyle = (x + y) % 2 === 0 ? "#7eb8d9" : "#e8f4fc";
      c.fillRect(x * 8, y * 8, 9, 9);
    }
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 6);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function verandaTileTex(): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = 32;
  cv.height = 32;
  const c = cv.getContext("2d")!;
  c.fillStyle = "#2a2a2a";
  c.fillRect(0, 0, 32, 32);
  c.fillStyle = "#f0f0f0";
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(32, 32);
  c.lineTo(32, 0);
  c.closePath();
  c.fill();
  c.beginPath();
  c.moveTo(0, 32);
  c.lineTo(0, 0);
  c.lineTo(32, 32);
  c.closePath();
  c.fill();
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 3);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const whiteWall = (): THREE.MeshStandardMaterial =>
  new THREE.MeshStandardMaterial({
    color: 0xfcfcfc,
    roughness: 0.91,
    metalness: 0.02,
    envMapIntensity: 0.35,
    side: THREE.DoubleSide,
  });

/** X sabit eksende dikey duvarkule (köşeden köşeye ince blok) */
function wallAlongX(
  parent: THREE.Group,
  wallT: number,
  wallH: number,
  y0: number,
  x: number,
  z0: number,
  z1: number,
  mat: THREE.Material
) {
  const lo = Math.min(z0, z1);
  const hi = Math.max(z0, z1);
  const len = hi - lo;
  if (len < 0.02) return;
  const m = new THREE.Mesh(new THREE.BoxGeometry(wallT, wallH, len + wallT), mat);
  m.position.set(x, y0 + wallH / 2, (lo + hi) / 2);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
}

function wallAlongZ(
  parent: THREE.Group,
  wallT: number,
  wallH: number,
  y0: number,
  z: number,
  x0: number,
  x1: number,
  mat: THREE.Material
) {
  const lo = Math.min(x0, x1);
  const hi = Math.max(x0, x1);
  const len = hi - lo;
  if (len < 0.02) return;
  const m = new THREE.Mesh(new THREE.BoxGeometry(len + wallT, wallH, wallT), mat);
  m.position.set((lo + hi) / 2, y0 + wallH / 2, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
}

function roomFloor(
  parent: THREE.Group,
  x0: number,
  x1: number,
  z0: number,
  z1: number,
  y: number,
  material: THREE.MeshStandardMaterial
) {
  const w = x1 - x0;
  const d = z1 - z0;
  if (w < 0.05 || d < 0.05) return;
  const fl = new THREE.Mesh(
    new THREE.PlaneGeometry(w - PLAN_BUILDING.wallT * 0.5, d - PLAN_BUILDING.wallT * 0.5),
    material
  );
  fl.rotation.x = -Math.PI / 2;
  fl.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
  fl.receiveShadow = true;
  parent.add(fl);
}

function glassWindow(parent: THREE.Group, cx: number, cz: number, w: number, h: number, rotY: number) {
  const g = new THREE.MeshPhysicalMaterial({
    color: 0xc8ecff,
    metalness: 0,
    roughness: 0.08,
    transmission: 0.65,
    thickness: 0.06,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    envMapIntensity: 1,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), g);
  mesh.position.set(cx, PLAN_BUILDING.floorY + PLAN_BUILDING.wallH * 0.48, cz);
  mesh.rotation.y = rotY;
  parent.add(mesh);
}

/** Tek katlı plan — merkezi (W/2, D/2) olacak şekilde içerik üretir; çağıran grupo `floorPlanRoot` olarak eklenir */
export function addSingleStoreyFloorPlan(villaGroup: THREE.Group): THREE.Group {
  const root = new THREE.Group();
  root.name = "single-storey-floor-plan";

  const { width: W, depth: D, wallT: T, wallH: H, floorY: fy, ceilingY: cy, zSplit: zs, zBack: zb } = PLAN_BUILDING;
  const ww = whiteWall();

  const xVer0 = PLAN_CM.X_BR3 / 100;
  const xLiv0 = xVer0 + PLAN_CM.X_VER / 100;
  const xB1 = PLAN_CM.X_BR1 / 100;
  const xBt = xB1 + PLAN_CM.X_BATH / 100;
  const xB2e = xBt + PLAN_CM.X_BR2 / 100;

  /** Alt sıra bölgeleri */
  const xBr3 = xVer0;
  const z0 = 0;
  /** Hol bandı yaklaşık 8 m² için veranda ile üst sıra arası merkezi şerit */
  const hallX0 = 3.05;
  const hallX1 = 7.18;
  const hallZ0 = 2.15;
  const hallZ1 = 4.35;

  const woodMap = parquetTexture();
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodMap,
    color: 0xf2e6d8,
    roughness: 0.88,
    metalness: 0.02,
    envMapIntensity: 0.45,
  });
  const bathMat = new THREE.MeshStandardMaterial({
    map: bathTileTex(),
    roughness: 0.62,
    metalness: 0.03,
    envMapIntensity: 0.38,
    color: 0xffffff,
  });
  const verMat = new THREE.MeshStandardMaterial({
    map: verandaTileTex(),
    roughness: 0.55,
    metalness: 0.06,
    envMapIntensity: 0.4,
    color: 0xffffff,
  });

  /** Zemin bölgeleri */
  roomFloor(root, 0, xBr3, z0, zs, fy + 0.002, woodMat.clone()); // BR3
  roomFloor(root, xVer0, xLiv0, z0, zs, fy + 0.003, verMat); // Veranda
  roomFloor(root, xLiv0, W, z0, zs, fy + 0.002, woodMat.clone()); // Salon alt

  roomFloor(root, 0, xB1, zs, zb, fy + 0.002, woodMat.clone()); // BR1
  roomFloor(root, xB1, xBt, zs, zb, fy + 0.003, bathMat); // Banyo
  roomFloor(root, xBt, xB2e, zs, zb, fy + 0.002, woodMat.clone()); // BR2
  roomFloor(root, xB2e, W, zs, zb, fy + 0.002, woodMat.clone()); // Salon üst
  /** İç duvarküller */
  wallAlongX(root, T, H, fy, xVer0, z0, zs, ww.clone());
  wallAlongX(root, T, H, fy, xLiv0, z0, zs, ww.clone());
  wallAlongZ(root, T, H, fy, zs, 0, xLiv0, ww.clone()); // kesit — salon birleşik
  wallAlongX(root, T, H, fy, xB1, zs, zb, ww.clone());
  wallAlongX(root, T, H, fy, xBt, zs, zb, ww.clone());
  wallAlongX(root, T, H, fy, xB2e, zs, zb, ww.clone());

  /** BR1 doğrusu ile alt blok hizası (dolap şeridi) */
  wallAlongX(root, T, H, fy, xB1, z0, zs, ww.clone());

  /** Dış çeper */
  wallAlongX(root, T, H, fy, 0, z0, zb, ww.clone());
  wallAlongX(root, T, H, fy, W, z0, zb, ww.clone());
  wallAlongZ(root, T, H, fy, z0, 0, W, ww.clone());
  wallAlongZ(root, T, H, fy, zb, 0, W, ww.clone());

  /** Pencereler (dışa bakan düzlemler) */
  glassWindow(root, 0.04, zb * 0.45, 0.02, 1.5, Math.PI / 2);
  glassWindow(root, W - 0.04, zb * 0.35, 0.02, 1.5, -Math.PI / 2);
  glassWindow(root, W * 0.88, zb * 0.54, 1.32, 1.38, Math.PI);
  glassWindow(root, W * 0.92, zs * 0.28 + zb * 0.18, 1.06, 1.08, Math.PI);

  /** Hol halı */
  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(hallX1 - hallX0 - 0.4, hallZ1 - hallZ0 - 0.35),
    new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.92 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set((hallX0 + hallX1) / 2, fy + 0.018, (hallZ0 + hallZ1) / 2);
  rug.receiveShadow = true;
  root.add(rug);

  /** --- Mobilya ( bloklar ) --- */
  const wood = new THREE.MeshStandardMaterial({ color: 0xc4a574, roughness: 0.72 });

  /** BR1 yatak */
  const bedDb = new THREE.Mesh(
    new RoundedBoxGeometry(1.76, 0.42, 2.06, 2, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.74 })
  );
  bedDb.position.set(xB1 / 2, fy + 0.38, zb - (zb - zs) / 2 - 0.2);
  bedDb.castShadow = true;
  root.add(bedDb);

  /** BR2 iki koltuk */
  const ch = new THREE.Mesh(
    new RoundedBoxGeometry(0.62, 0.46, 0.58, 2, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xb83838 })
  );
  const ch2 = ch.clone();
  ch.position.set(xBt + PLAN_CM.X_BR2 / 200 - 0.35, fy + 0.36, zb - 0.91);
  ch2.position.set(xBt + PLAN_CM.X_BR2 / 200 + 0.38, fy + 0.36, zb - 1.62);
  ch.castShadow = ch2.castShadow = true;
  root.add(ch, ch2);
  const tbl = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.06, 20), wood);
  tbl.position.set(xBt + PLAN_CM.X_BR2 / 200, fy + 0.09, zb - 1.25);
  tbl.castShadow = true;
  root.add(tbl);

  /** BR3 tek kişilik + masa */
  const bedS = new THREE.Mesh(
    new RoundedBoxGeometry(0.94, 0.36, 1.94, 2, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xf5f7fa })
  );
  bedS.position.set(0.55, fy + 0.32, zs / 2);
  bedS.castShadow = true;
  root.add(bedS);
  const desk = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.05, 0.58, 2, 0.02), wood);
  desk.position.set(xBr3 - 0.55, fy + 0.46, zs * 0.65);
  desk.castShadow = true;
  root.add(desk);

  /** Banyo */
  const sh = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, H * 0.42, 0.85),
    new THREE.MeshPhysicalMaterial({
      color: 0xa8cce8,
      roughness: 0.08,
      metalness: 0.06,
      transmission: 0.5,
      opacity: 0.45,
      transparent: true,
    })
  );
  sh.position.set((xB1 + xBt) / 2 + 0.22, fy + H * 0.25, zb - (zb - zs) / 4);
  sh.castShadow = true;
  root.add(sh);

  /** Salon + mutfak L tezgah */
  const kX = W - 0.65;
  const kZ = zb - 0.55;
  const kitA = new THREE.Mesh(
    new RoundedBoxGeometry(2.2, 0.92, 0.56, 2, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x1a1c20, roughness: 0.45, metalness: 0.15 })
  );
  kitA.position.set(kX - 0.9, fy + 0.46, kZ);
  kitA.castShadow = true;
  root.add(kitA);
  const kitB = new THREE.Mesh(
    new RoundedBoxGeometry(0.52, 0.92, 1.8, 2, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x1a1c20, roughness: 0.45, metalness: 0.15 })
  );
  kitB.position.set(W - 0.38, fy + 0.46, kZ - 1.2);
  kitB.castShadow = true;
  root.add(kitB);

  const sofa = new THREE.Mesh(
    new RoundedBoxGeometry(2.45, 0.44, 0.96, 3, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xe8eaef, roughness: 0.82 })
  );
  sofa.position.set(W - 1.55, fy + 0.36, zs + (zb - zs) * 0.28);
  sofa.castShadow = true;
  root.add(sofa);

  const din = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.5, 0.05, 28), wood);
  din.position.set(W - 1.35, fy + 0.1, zs + (zb - zs) * 0.58);
  din.castShadow = true;
  root.add(din);
  for (let c = 0; c < 4; c++) {
    const ang = (c / 4) * Math.PI * 2 + 0.4;
    const chair = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.18, 0.38, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    chair.position.set(din.position.x + Math.cos(ang) * 0.85, fy + 0.24, din.position.z + Math.sin(ang) * 0.85);
    chair.castShadow = true;
    root.add(chair);
  }

  /** Planı dünya merkezine taşı (x,z) */
  root.position.set(-W / 2, 0, -D / 2);

  villaGroup.add(root);
  return root;
}
