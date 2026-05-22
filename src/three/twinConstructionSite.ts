import * as THREE from "three";
import { PLAN_BUILDING } from "@/three/singleStoreyFloorPlan";
import { GRID_CELL, snapGrid } from "@/three/villaLayout";

/** Temel üst yüzeyinin dünya Y konumu (kutu merkezi slabH/2, üst = slabH). */
export const TWIN_FOUNDATION_TOP_Y = 0.11;

const GRASS = 0x355d78;
const GRAVEL = 0x8a94a0;
const FOUNDATION_TOP = 0x3a4552;
/** Ana sayfa lacivert şeridiyle uyumlu şantiye grid’i */
const SITE_GRID = 0x3d7ce8;
const STONE_WALL = 0x7a8490;

export interface TwinConstructionSiteResult {
  /** Geniş çim — Poly Haven hedefi (isteğe bağlı) */
  grassMesh: THREE.Mesh;
  siteRoot: THREE.Group;
}

/**
 * Referans “ground prepared” sahnesi: çim, çakıl yol, hazır temel döşemesi,
 * turuncu şantiye grid’i, düşük taş çevre.
 */
export function addTwinConstructionSite(scene: THREE.Scene): TwinConstructionSiteResult {
  const siteRoot = new THREE.Group();
  siteRoot.name = "twin-construction-site";

  const W = PLAN_BUILDING.width;
  const D = PLAN_BUILDING.depth;
  const slabPad = 0.55;
  const slabW = W + slabPad * 2;
  const slabD = D + slabPad * 2;
  const slabH = TWIN_FOUNDATION_TOP_Y;

  const grassMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(96, 96, 1, 1),
    new THREE.MeshStandardMaterial({
      color: GRASS,
      roughness: 0.88,
      metalness: 0.04,
    })
  );
  grassMesh.rotation.x = -Math.PI / 2;
  grassMesh.receiveShadow = true;
  grassMesh.name = "twin-site-grass";
  siteRoot.add(grassMesh);

  const lowWallH = 0.38;
  const lowWallT = 0.22;
  const plotPad = 8;
  const plotW = slabW + plotPad * 2;
  const plotD = slabD + plotPad * 2;
  const wallMat = new THREE.MeshStandardMaterial({
    color: STONE_WALL,
    roughness: 0.9,
    metalness: 0.05,
    envMapIntensity: 0.28,
  });
  for (const [px, pz, rw, rd] of [
    [0, -plotD / 2 + lowWallT / 2, plotW, lowWallT] as const,
    [0, plotD / 2 - lowWallT / 2, plotW, lowWallT] as const,
    [-plotW / 2 + lowWallT / 2, 0, lowWallT, plotD - lowWallT * 2] as const,
    [plotW / 2 - lowWallT / 2, 0, lowWallT, plotD - lowWallT * 2] as const,
  ]) {
    const seg = new THREE.Mesh(new THREE.BoxGeometry(rw, lowWallH, rd), wallMat.clone());
    seg.position.set(px, lowWallH / 2, pz);
    seg.castShadow = true;
    seg.receiveShadow = true;
    siteRoot.add(seg);
  }

  const foundation = new THREE.Mesh(
    new THREE.BoxGeometry(slabW, slabH, slabD),
    new THREE.MeshStandardMaterial({
      color: FOUNDATION_TOP,
      roughness: 0.91,
      metalness: 0.06,
      envMapIntensity: 0.32,
    })
  );
  foundation.position.y = slabH / 2;
  foundation.castShadow = true;
  foundation.receiveShadow = true;
  siteRoot.add(foundation);

  const gravelMat = new THREE.MeshStandardMaterial({
    color: GRAVEL,
    roughness: 0.92,
    metalness: 0.02,
    envMapIntensity: 0.22,
  });
  const pathW = 1.35;
  const pathLen = plotD * 0.42 + 6;
  const gravelPath = new THREE.Mesh(new THREE.BoxGeometry(pathW, 0.06, pathLen), gravelMat);
  gravelPath.position.set(-plotW * 0.22, 0.04, -plotD * 0.12);
  gravelPath.rotation.y = 0.28;
  gravelPath.receiveShadow = true;
  gravelPath.castShadow = true;
  siteRoot.add(gravelPath);

  const topY = slabH + 0.04;
  const gridPts: THREE.Vector3[] = [];
  const hx = slabW / 2 - 0.06;
  const hz = slabD / 2 - 0.06;
  for (let x = snapGrid(-hx); x <= snapGrid(hx); x += GRID_CELL) {
    gridPts.push(new THREE.Vector3(x, topY, -hz), new THREE.Vector3(x, topY, hz));
  }
  for (let z = snapGrid(-hz); z <= snapGrid(hz); z += GRID_CELL) {
    gridPts.push(new THREE.Vector3(-hx, topY, z), new THREE.Vector3(hx, topY, z));
  }
  const siteGrid = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(gridPts),
    new THREE.LineBasicMaterial({
      color: SITE_GRID,
      transparent: true,
      opacity: 0.92,
      depthTest: true,
    })
  );
  siteRoot.add(siteGrid);

  const outlinePts = [
    new THREE.Vector3(-hx, topY + 0.008, -hz),
    new THREE.Vector3(hx, topY + 0.008, -hz),
    new THREE.Vector3(hx, topY + 0.008, hz),
    new THREE.Vector3(-hx, topY + 0.008, hz),
    new THREE.Vector3(-hx, topY + 0.008, -hz),
  ];
  const footprintOutline = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(outlinePts),
    new THREE.LineBasicMaterial({ color: SITE_GRID, transparent: true, opacity: 1 })
  );
  siteRoot.add(footprintOutline);

  const poleMat = new THREE.MeshStandardMaterial({ color: SITE_GRID, emissive: SITE_GRID, emissiveIntensity: 0.35 });
  const flagPositions: [number, number][] = [
    [-hx + GRID_CELL * 2, -hz + GRID_CELL * 2],
    [hx - GRID_CELL * 2, hz - GRID_CELL * 2],
    [0, hz - GRID_CELL],
    [hx - GRID_CELL, -hz + GRID_CELL * 3],
  ];
  for (const [fx, fz] of flagPositions) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.55, 8), poleMat.clone());
    pole.position.set(fx, slabH + 0.28, fz);
    pole.castShadow = true;
    siteRoot.add(pole);
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.12, 0.02),
      new THREE.MeshStandardMaterial({ color: SITE_GRID, emissive: SITE_GRID, emissiveIntensity: 0.5 })
    );
    flag.position.set(fx + 0.12, slabH + 0.52, fz);
    flag.castShadow = true;
    siteRoot.add(flag);
  }

  scene.add(siteRoot);

  return { grassMesh, siteRoot };
}
