import * as THREE from "three";
import { PLAN_BUILDING } from "@/three/singleStoreyFloorPlan";

/**
 * Plan (cm → m) dış hattına oturan, üstü tamamen açık kabuk (çatı yok).
 * İç mekân (floor plan) aynı merkezde kalır.
 */
export function addOpenPlanShell(parent: THREE.Group): THREE.Group {
  const grp = new THREE.Group();
  grp.name = "open-plan-shell";

  const W = PLAN_BUILDING.width;
  const D = PLAN_BUILDING.depth;
  const T = PLAN_BUILDING.wallT;
  const h = Math.max(PLAN_BUILDING.ceilingY, PLAN_BUILDING.wallH) + 0.06;
  const hx = W / 2;
  const hz = D / 2;

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x626d78,
    roughness: 0.82,
    metalness: 0.05,
    envMapIntensity: 0.42,
    side: THREE.DoubleSide,
  });

  const yWall = PLAN_BUILDING.floorY + h / 2;

  const north = new THREE.Mesh(new THREE.BoxGeometry(W, h, T), wallMat.clone());
  north.position.set(0, yWall, -hz + T / 2);
  north.castShadow = north.receiveShadow = true;
  grp.add(north);

  const south = new THREE.Mesh(new THREE.BoxGeometry(W, h, T), wallMat.clone());
  south.position.set(0, yWall, hz - T / 2);
  south.castShadow = south.receiveShadow = true;
  grp.add(south);

  const west = new THREE.Mesh(new THREE.BoxGeometry(T, h, D - 2 * T), wallMat.clone());
  west.position.set(-hx + T / 2, yWall, 0);
  west.castShadow = west.receiveShadow = true;
  grp.add(west);

  const east = new THREE.Mesh(new THREE.BoxGeometry(T, h, D - 2 * T), wallMat.clone());
  east.position.set(hx - T / 2, yWall, 0);
  east.castShadow = east.receiveShadow = true;
  grp.add(east);

  parent.add(grp);
  return grp;
}
