import * as THREE from "three";

/**
 * Modern iki katlı cephe (~m). Eskiden kullanılan 6×4 şematik gövde ile hizalı.
 */
export const MODERN_HOUSE = {
  halfW: 3,
  halfD: 2,
  slabY: 3,
  gfTopY: 3,
  plateTopY: 5.4,
  wt: 0.12,
  frontOverhang: 0.88,
  plinthLift: 0.14,
} as const;

const DARK_PANEL = new THREE.Color(0x2f343a);
const TRIM = new THREE.Color(0xf8fafc);
const CONCRETE = new THREE.Color(0xbdc4cc);

function glassMat(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: 0xd8f6ff,
    metalness: 0,
    roughness: 0.04,
    transmission: 0.78,
    thickness: 0.18,
    ior: 1.52,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    envMapIntensity: 1.15,
    clearcoat: 0.65,
    clearcoatRoughness: 0.08,
    side: THREE.DoubleSide,
  });
}

/** Görüntüdeki dış cephe + peyzaj; dijital ikiz bileşenleri (iç düzen) olduğu yerde kalır */
export function addModernHouseExterior(root: THREE.Group): THREE.Group {
  const grp = new THREE.Group();
  grp.name = "modern-house-exterior";

  const hw = MODERN_HOUSE.halfW;
  const hd = MODERN_HOUSE.halfD;
  const wt = MODERN_HOUSE.wt;
  const plTop = MODERN_HOUSE.plinthLift;
  const slabY = MODERN_HOUSE.slabY;
  const uh = MODERN_HOUSE.plateTopY - slabY;
  const zFront = hd;
  const zBack = -hd;
  const fo = MODERN_HOUSE.frontOverhang;

  const panelMat = new THREE.MeshStandardMaterial({
    color: DARK_PANEL,
    roughness: 0.55,
    metalness: 0.06,
    envMapIntensity: 0.45,
  });

  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2 + 0.42, MODERN_HOUSE.plinthLift + 0.05, hd * 2 + 0.36),
    new THREE.MeshStandardMaterial({
      color: CONCRETE,
      roughness: 0.88,
      metalness: 0.06,
      envMapIntensity: 0.32,
    })
  );
  plinth.position.y = plTop / 2;
  plinth.receiveShadow = true;
  plinth.castShadow = true;
  grp.add(plinth);

  const doorW = 1.62;
  const gap = 0.38;
  const doorBottom = plTop + 0.12;
  const doorH = slabY - doorBottom - 0.06;
  const dz = wt * 1.08;

  /** Zemin kat üç cam aksı (−2, 0, 2 civarı beyaz doğrama bloklarıyla) */
  const doorXs = [-doorW - gap, 0, doorW + gap];
  /** Cam dış yüz kenarları (x ekseninde) — aralarına koyu panel */
  const doorL = doorXs.map((cx) => cx - doorW / 2);
  const doorR = doorXs.map((cx) => cx + doorW / 2);

  const innerX = -hw + wt;

  /** Arka duvar */
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2, MODERN_HOUSE.plateTopY - plTop, wt),
    panelMat.clone()
  );
  backWall.position.set(0, (MODERN_HOUSE.plateTopY + plTop) / 2, zBack + wt / 2);
  backWall.receiveShadow = true;
  backWall.castShadow = true;
  grp.add(backWall);

  /** Sağ yüz */
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wt, MODERN_HOUSE.plateTopY - plTop - 0.45, hd * 2.02),
    panelMat.clone()
  );
  rightWall.position.set(hw - wt / 2, (MODERN_HOUSE.plateTopY + plTop + 0.42) / 2, 0);
  rightWall.receiveShadow = rightWall.castShadow = true;
  grp.add(rightWall);

  /** Sol yüz gövdesi */
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wt, MODERN_HOUSE.plateTopY - plTop, hd * 2 - wt * 0.5),
    panelMat.clone()
  );
  leftWall.position.set(-hw + wt / 2, (MODERN_HOUSE.plateTopY + plTop) / 2, hd * -0.04);
  leftWall.receiveShadow = leftWall.castShadow = true;
  grp.add(leftWall);

  /** Sol yüz iki pencere — duvardan dışarı taşır */
  const sideXInner = -hw + wt + 0.04;
  const sideWinY = doorBottom + 0.94;
  for (let i = 0; i < 2; i++) {
    const zp = zBack + 0.45 + i * (hd * 0.92);
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(wt + 0.06, 0.94, 0.94),
      new THREE.MeshStandardMaterial({ color: TRIM, roughness: 0.35 })
    );
    frame.position.set(sideXInner + wt * 0.58, sideWinY, zp);
    frame.castShadow = true;
    grp.add(frame);

    const wn = glassMat();
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.8, 0.8), wn);
    win.position.set(sideXInner + wt + 0.08, sideWinY, zp);
    grp.add(win);
  }

  const sillH = Math.max(doorBottom - plTop + 0.02, 0.14);
  const sillBand = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2 - wt * 0.4, sillH, wt),
    panelMat.clone()
  );
  sillBand.position.set(0, plTop + sillH / 2, zFront + dz);
  sillBand.receiveShadow = true;
  grp.add(sillBand);

  function frontPillar(centerX: number, widthX: number) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(widthX, doorH + 0.04, wt), panelMat.clone());
    p.position.set(centerX, doorBottom + doorH / 2, zFront + dz);
    p.castShadow = p.receiveShadow = true;
    grp.add(p);
  }

  /** Camlar arası dikey bloklar (+ çok dar yanlar) */
  frontPillar((innerX + doorL[0]) / 2, Math.max(doorL[0] - innerX, wt));
  frontPillar((doorR[0] + doorL[1]) / 2, doorL[1] - doorR[0]);
  frontPillar((doorR[1] + doorL[2]) / 2, doorL[2] - doorR[1]);
  const innerRight = hw - wt;
  frontPillar((doorR[2] + innerRight) / 2, innerRight - doorR[2]);

  /** Beyaz doğrama ve cam yüzleri */
  for (let i = 0; i < 3; i++) {
    const cx = doorXs[i];
    const fr = new THREE.Mesh(
      new THREE.BoxGeometry(doorW + 0.14, doorH + 0.08, wt * 2.05),
      new THREE.MeshPhysicalMaterial({
        color: TRIM,
        roughness: 0.32,
        metalness: 0.08,
        clearcoat: 0.42,
      })
    );
    fr.position.set(cx, doorBottom + doorH / 2, zFront + dz + 0.038);
    fr.castShadow = true;
    grp.add(fr);
    const gl = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.06, doorH - 0.06, 0.028), glassMat());
    gl.position.set(cx, doorBottom + doorH / 2, zFront + dz + wt * 0.66);
    grp.add(gl);
  }

  const headBandH = slabY + uh - (doorBottom + doorH);
  const headBandGreyH = Math.max(headBandH * 0.32, uh * 0.16);
  const headBand = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2 - 0.12, headBandGreyH, wt * 0.92),
    new THREE.MeshStandardMaterial({ color: TRIM, roughness: 0.36 })
  );
  headBand.position.set(-0.04, slabY + headBandGreyH / 2 + 0.1, zFront + dz);
  headBand.receiveShadow = true;
  grp.add(headBand);

  /** Beton çıkış basamakları */
  const stepMat = new THREE.MeshStandardMaterial({ color: 0xb0b9c2, roughness: 0.78, metalness: 0.05 });
  for (let s = 0; s < 3; s++) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(2.85 - s * 0.08, 0.1, 0.42 - s * 0.04), stepMat.clone());
    st.position.set(0.02, plTop * 0.38 + s * 0.1, hd + fo * 1.06 + s * 0.18);
    st.receiveShadow = st.castShadow = true;
    grp.add(st);
  }

  /** Carport yan ön sıva sonlandırması */
  const rightFill = new THREE.Mesh(new THREE.BoxGeometry(wt, slabY - plTop + 0.16, wt * 1.65), panelMat.clone());
  rightFill.position.set(hw - wt / 2, (slabY + plTop) / 2, zFront + wt * 0.18);
  rightFill.receiveShadow = true;
  grp.add(rightFill);

  /** İki sıra ince yapı kolonları */
  for (const px of [-1.38, 1.38]) {
    const col = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, MODERN_HOUSE.gfTopY + 0.08, 0.09),
      new THREE.MeshStandardMaterial({ color: TRIM })
    );
    col.position.set(px, (MODERN_HOUSE.gfTopY + plTop) / 2, zFront + 0.65);
    col.castShadow = col.receiveShadow = true;
    grp.add(col);
  }

  /** Teras döşemesi öne taşmış */
  const deckZ = hd + fo * 0.28;
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(hw * 2.06, 0.14, hd * 0.5 + fo * 0.5),
    new THREE.MeshStandardMaterial({ color: CONCRETE, roughness: 0.74, metalness: 0.05 })
  );
  deck.position.set(0.04, MODERN_HOUSE.plateTopY + 0.06, deckZ + 0.04);
  deck.castShadow = deck.receiveShadow = true;
  grp.add(deck);

  /** Cam korkuluğu */
  const rm = glassMat();
  rm.opacity = 0.42;
  rm.transmission = 0.52;
  const zRailF = hd + fo * 0.36;
  const zRailB = hd + fo * 0.86;
  for (const rz of [zRailF, zRailB]) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.9, 0.56, 0.026), rm.clone());
    r.position.set(-0.04, MODERN_HOUSE.plateTopY + 0.73, rz);
    grp.add(r);
  }

  /** Üst kat üçlü cam */
  const upDoorH = uh * 0.58 - 0.02;
  const upYbase = slabY + uh * 0.54 - upDoorH * 0.5;
  for (let i = 0; i < 3; i++) {
    const cx = doorXs[i];
    const fr = new THREE.Mesh(
      new THREE.BoxGeometry(doorW + 0.1, upDoorH + 0.1, wt * 2.1),
      new THREE.MeshStandardMaterial({ color: TRIM })
    );
    fr.position.set(cx, upYbase + upDoorH / 2, zFront + wt * 0.55);
    grp.add(fr);
    const gd = glassMat();
    const gl = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.08, upDoorH, 0.028), gd);
    gl.position.set(cx, upYbase + upDoorH / 2, zFront + wt * 0.94);
    grp.add(gl);
  }

  /** Ana çatı yok — kuşbakışında iç zemini ve düzen görülsün */

  /** Carport */
  const carp = new THREE.Group();
  const cx0 = hw + 3.15;
  const cz0 = -0.15;
  const carW = 3.88;
  const carD = 2.65;
  const pilH = MODERN_HOUSE.gfTopY + 0.65;
  const pilMat = new THREE.MeshPhysicalMaterial({
    color: TRIM,
    roughness: 0.38,
    metalness: 0.05,
    clearcoat: 0.15,
    envMapIntensity: 0.55,
  });
  for (const [sx, sz] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ] as const) {
    const pil = new THREE.Mesh(new THREE.BoxGeometry(0.16, pilH, 0.18), pilMat.clone());
    pil.position.set(cx0 + sx * (carW * 0.5 - 0.14), pilH * 0.5 - 0.08, cz0 + sz * (carD * 0.5 - 0.14));
    pil.castShadow = pil.receiveShadow = true;
    carp.add(pil);
  }
  const carpRoof = new THREE.Mesh(
    new THREE.BoxGeometry(carW + 0.66, 0.12, carD + 0.88),
    new THREE.MeshStandardMaterial({ color: TRIM, roughness: 0.35, metalness: 0.08 })
  );
  carpRoof.position.set(cx0, pilH + 0.08, cz0 + 0.02);
  carpRoof.receiveShadow = true;
  carp.add(carpRoof);
  grp.add(carp);

  /** SUV */
  const suv = new THREE.Group();
  suv.position.set(cx0, plTop + 0.58, cz0 + 0.18);
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.72, 0.96),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.48, envMapIntensity: 0.88 })
  );
  body.position.y = 0.05;
  suv.add(body);
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.4, 0.86),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.58, envMapIntensity: 0.95 })
  );
  cabin.position.set(0, 0.54, -0.04);
  suv.add(cabin);
  const w = glassMat();
  w.opacity = 0.48;
  const wind = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.26, 0.02), w);
  wind.position.set(0, 0.54, -0.11);
  suv.add(wind);
  suv.rotation.y = 0.1;
  suv.traverse((c) => {
    const m = c as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
  grp.add(suv);

  /** Ön yürüyüş yolu — taş şeritler */
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xc4cbd4, roughness: 0.85 });
  for (let row = 0; row < 16; row++) {
    for (let col = -4; col <= 4; col++) {
      if ((row + col) % 2 !== 0) continue;
      const stone = new THREE.Mesh(
        new THREE.BoxGeometry(0.48 + (row % 3) * 0.04, 0.05, 0.44 + (col % 2) * 0.06),
        pathMat.clone()
      );
      stone.position.set(col * 0.44, plTop * 0.35, hd + fo + 0.14 + row * 0.34);
      stone.rotation.y = ((row * 7 + col * 3) % 10) * 0.08;
      stone.receiveShadow = true;
      grp.add(stone);
    }
  }

  root.add(grp);
  return grp;
}
