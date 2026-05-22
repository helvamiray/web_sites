import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/** Varsayılan varlıklar (Poly Havens API üzerinden URL çözülür). */
export const POLY_DEFAULTS = {
  hdriId: "studio_small_09",
  floorWoodId: "wood_cabinet_worn_long",
  wallConcreteId: "concrete_wall_003",
} as const;

type PolyHiRes = Record<string, { hdr?: { url: string } }>;

type PolyChan = Record<string, { jpg?: { url: string } } | undefined>;

type PolyFilesJson = {
  hdri?: PolyHiRes;
  [key: string]: unknown;
};

function pickHdri(files: PolyFilesJson, resKey: string) {
  const h = files.hdri;
  const entry = h?.[resKey] ?? h?.["1k"];
  return entry?.hdr?.url;
}

function pickTexJpg(files: PolyFilesJson, channel: string) {
  const ch = files[channel] as PolyChan | undefined;
  const one = ch?.["1k"];
  return one?.jpg?.url;
}

export async function fetchPolyhavenFileMap(assetId: string): Promise<PolyFilesJson> {
  const r = await fetch(`https://api.polyhaven.com/files/${encodeURIComponent(assetId)}`);
  if (!r.ok) throw new Error(`Poly Haven: ${r.status}`);
  return (await r.json()) as PolyFilesJson;
}

export type TwinLookResolved = {
  hdrUrl: string;
  floor: { diff: string; rough: string; nor: string };
  wall: { diff: string; rough: string; nor: string };
};

export async function resolveTwinLookFromInternet(
  ids: Partial<{ hdriId: string; floorWoodId: string; wallConcreteId: string }> = {}
): Promise<TwinLookResolved> {
  const hid = ids.hdriId ?? POLY_DEFAULTS.hdriId;
  const fid = ids.floorWoodId ?? POLY_DEFAULTS.floorWoodId;
  const wid = ids.wallConcreteId ?? POLY_DEFAULTS.wallConcreteId;

  const [hdrJ, floorJ, wallJ] = await Promise.all([
    fetchPolyhavenFileMap(hid),
    fetchPolyhavenFileMap(fid),
    fetchPolyhavenFileMap(wid),
  ]);

  const hdrUrl = pickHdri(hdrJ, "1k");
  if (!hdrUrl) throw new Error("HDRI URL yok");

  const fd = pickTexJpg(floorJ, "Diffuse");
  const fr = pickTexJpg(floorJ, "Rough");
  const fn = pickTexJpg(floorJ, "nor_gl");
  const wd = pickTexJpg(wallJ, "Diffuse");
  const wr = pickTexJpg(wallJ, "Rough");
  const wn = pickTexJpg(wallJ, "nor_gl");
  if (!fd || !fr || !fn || !wd || !wr || !wn) throw new Error("PBR kanal eksik");

  return { hdrUrl, floor: { diff: fd, rough: fr, nor: fn }, wall: { diff: wd, rough: wr, nor: wn } };
}

export type TwinLookTargets = {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  exteriorGround: THREE.Mesh;
  /** Yoksa gövdesel cephe için saydam iç kabuk atanmaz (solid dış model kullanılıyorsa boş geçilir). */
  wallLower?: THREE.Mesh;
  wallUpper?: THREE.Mesh;
  interiorFloorLower: THREE.Mesh;
  interiorFloorUpper: THREE.Mesh;
  ceilingLower: THREE.Mesh;
  ceilingUpper: THREE.Mesh;
};

function loadTexCrossOrigin(url: string): Promise<THREE.Texture> {
  const l = new THREE.TextureLoader();
  l.setCrossOrigin("anonymous");
  return new Promise((resolve, reject) =>
    l.load(url, resolve, undefined, (e) => reject(e ?? new Error(url)))
  );
}

function tuneRepeat(t: THREE.Texture, rx: number, ry: number) {
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.needsUpdate = true;
}

function disposeMat(m?: THREE.Material | THREE.Material[]): void {
  if (!m) return;
  const list = Array.isArray(m) ? m : [m];
  for (const mat of list) {
    mat.dispose();
  }
}

export async function applyTwinProfessionalLook(
  targets: TwinLookTargets,
  maxAniso: number,
  options?: Partial<{
    hdriId: string;
    floorWoodId: string;
    wallConcreteId: string;
    /** true: zeminde çim/dış peyzaj kalır, düz zemine beton dokusu uygulanmaz */
    skipExteriorGroundMaterial: boolean;
  }>
): Promise<() => void> {
  const urls = await resolveTwinLookFromInternet(options);

  const [fDiff, fRough, fNor, wDiff, wRough, wNor] = await Promise.all([
    loadTexCrossOrigin(urls.floor.diff),
    loadTexCrossOrigin(urls.floor.rough),
    loadTexCrossOrigin(urls.floor.nor),
    loadTexCrossOrigin(urls.wall.diff),
    loadTexCrossOrigin(urls.wall.rough),
    loadTexCrossOrigin(urls.wall.nor),
  ]);

  fDiff.colorSpace = THREE.SRGBColorSpace;
  wDiff.colorSpace = THREE.SRGBColorSpace;
  [fRough, fNor, wRough, wNor].forEach((x) => {
    x.colorSpace = THREE.NoColorSpace;
  });
  [fDiff, fRough, fNor, wDiff, wRough, wNor].forEach((x) => {
    x.anisotropy = Math.min(maxAniso, 10);
  });

  tuneRepeat(fDiff, 2.8, 2);
  tuneRepeat(fRough, 2.8, 2);
  tuneRepeat(fNor, 2.8, 2);

  tuneRepeat(wDiff, 1.1, 0.85);
  tuneRepeat(wRough, 1.1, 0.85);
  tuneRepeat(wNor, 1.1, 0.85);

  const hdrTex = await new Promise<THREE.DataTexture>((resolve, reject) => {
    const rl = new RGBELoader();
    rl.setCrossOrigin("anonymous");
    rl.load(urls.hdrUrl, resolve, undefined, (e) => reject(e ?? new Error("HDR")));
  });

  const pmrem = new THREE.PMREMGenerator(targets.renderer);
  pmrem.compileEquirectangularShader();
  const baked = pmrem.fromEquirectangular(hdrTex);
  targets.scene.environment = baked.texture;
  hdrTex.dispose();
  targets.scene.background = null;
  targets.scene.fog = new THREE.FogExp2(0xb8cae5, 0.021);

  const interiorFloorShared = new THREE.MeshStandardMaterial({
    map: fDiff,
    roughnessMap: fRough,
    normalMap: fNor,
    roughness: 0.94,
    metalness: 0.02,
    envMapIntensity: 0.75,
    color: new THREE.Color(0xf2efe9),
  });
  interiorFloorShared.normalScale = new THREE.Vector2(0.4, 0.4);

  disposeMat(targets.interiorFloorLower.material);
  disposeMat(targets.interiorFloorUpper.material);
  targets.interiorFloorLower.material = interiorFloorShared;
  targets.interiorFloorUpper.material = interiorFloorShared;

  const extWallClone = (
    wdClone: THREE.Texture,
    wrClone: THREE.Texture,
    wnClone: THREE.Texture,
    repeats: number
  ) => {
    const m = wdClone.clone();
    const mr = wrClone.clone();
    const mn = wnClone.clone();
    tuneRepeat(m, repeats, repeats);
    tuneRepeat(mr, repeats, repeats);
    tuneRepeat(mn, repeats, repeats);
    m.needsUpdate = true;
    mr.needsUpdate = true;
    mn.needsUpdate = true;
    return { m, mr, mn };
  };

  let groundPbrApplied = false;
  if (!options?.skipExteriorGroundMaterial) {
    const gExt = extWallClone(wDiff, wRough, wNor, 32);
    disposeMat(targets.exteriorGround.material);
    targets.exteriorGround.material = new THREE.MeshStandardMaterial({
      map: gExt.m,
      roughnessMap: gExt.mr,
      normalMap: gExt.mn,
      color: new THREE.Color(0x2c3a42),
      roughness: 0.93,
      metalness: 0.04,
      envMapIntensity: 0.35,
      transparent: true,
      opacity: 0.95,
    });
    groundPbrApplied = true;
  }

  if (targets.wallLower && targets.wallUpper) {
    disposeMat(targets.wallLower.material);
    disposeMat(targets.wallUpper.material);
    const shellShared = new THREE.MeshPhysicalMaterial({
      map: wDiff,
      roughnessMap: wRough,
      normalMap: wNor,
      color: new THREE.Color().setHSL(0.52, 0.06, 0.74),
      roughness: 0.91,
      metalness: 0.05,
      clearcoat: 0.06,
      envMapIntensity: 0.75,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false,
      transmission: 0.015,
      thickness: 0.08,
      ior: 1.42,
    });
    shellShared.normalScale = new THREE.Vector2(0.42, 0.42);

    targets.wallLower.material = shellShared;
    targets.wallUpper.material = shellShared;
  }

  disposeMat(targets.ceilingLower.material);
  disposeMat(targets.ceilingUpper.material);
  targets.ceilingLower.material = new THREE.MeshStandardMaterial({
    color: 0xeceff3,
    roughness: 0.74,
    metalness: 0.04,
    envMapIntensity: 0.5,
  });
  targets.ceilingUpper.material = new THREE.MeshStandardMaterial({
    color: 0xe8eaf0,
    roughness: 0.72,
    metalness: 0.05,
    envMapIntensity: 0.55,
  });

  rendererToneRefresh(targets.renderer);

  return () => {
    disposeMat(targets.interiorFloorLower.material);
    if (groundPbrApplied) disposeMat(targets.exteriorGround.material);
    if (targets.wallLower?.material && targets.wallUpper?.material) {
      disposeMat(targets.wallLower.material);
      disposeMat(targets.wallUpper.material);
    }

    disposeMat(targets.ceilingLower.material);
    disposeMat(targets.ceilingUpper.material);

    if (targets.scene.environment) {
      targets.scene.environment.dispose();
      targets.scene.environment = null;
    }

    pmrem.dispose();
    targets.scene.fog = null;
    rendererToneRefresh(targets.renderer);
  };
}

function rendererToneRefresh(renderer: THREE.WebGLRenderer) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
}
