import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Cpu, Flame, Layers, LayoutDashboard, Wind } from "lucide-react";
import acIndoorTex from "@/assets/ac-indoor.png";
import { applyTwinProfessionalLook } from "@/three/twinProfessionalLook";
import { addOpenPlanShell } from "@/three/openPlanShell";
import { addTwinConstructionSite, TWIN_FOUNDATION_TOP_Y } from "@/three/twinConstructionSite";
import { addSingleStoreyFloorPlan, PLAN_BUILDING } from "@/three/singleStoreyFloorPlan";
import { GRID_CELL, LAYOUT, SCALE, snapGrid } from "@/three/villaLayout";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const PORTAL_DESCRIPTIONS: Record<string, string> = {
  manifold: "Hidronik düğüm · kollektör",
  boiler: "Mekanik oda · üretici",
  tank: "Tampon · depolama",
  pump: "Sirkülasyon · ErP-A",
  underfloor: "Yapı · yerden ısıtma",
  radiators: "Üst düzey · panel yayılımı",
  "ac-units": "Iklim · iç ünite hattı",
};

interface Villa3DProps {
  highlightedKey: string | null;
  /** Seçili ürün kartı görseli — yüksek çözünürlüklü doku olarak uygulanır */
  productImageUrl?: string | null;
}

type OrbitState = {
  yaw: number;
  pitch: number;
  radius: number;
  target: THREE.Vector3;
};

type CatalogSurfaceMaterial = THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;

function isCatalogTexturedMat(
  mat: THREE.Material
): mat is CatalogSurfaceMaterial & { _isTextured: true } {
  return "_isTextured" in mat && Boolean((mat as { _isTextured?: boolean })._isTextured);
}

const ACCENT_C = 0x5b8dff;
/** Seçili / vurgu — Vega yeşili (CTA ile uyumlu) */
const HIGHLIGHT_C = 0x00c853;

/** Kamera — temel + iç hacim ortası */
const ORBIT_HOME_Y = 1.55;

/** Tek kat planda görünsün diye radyatör / IK yüksekliği iki katılı şemadan indirilir */
const EQUIP_Y_DROP_SINGLE_STORY = 2.92;

/**
 * Dijital ikiz: şantiye zemini (çim, çakıl, temel, turuncu grid), plan ölçülü açık üst kabuk,
 * iç kat planı, Poly Haven IBL/PBR, GSAP orbit, katalog dokusu.
 */
const Villa3D = ({ highlightedKey, productImageUrl }: Villa3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const highlightRef = useRef<string | null>(null);
  const orbitRef = useRef<OrbitState | null>(null);
  const productTexRef = useRef<THREE.Texture | null>(null);
  const acBaselineTexRef = useRef<THREE.Texture | null>(null);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const [pbrStatus, setPbrStatus] = useState<string | null>("Poly Haven: materyaller indiriliyor…");

  useEffect(() => {
    highlightRef.current = highlightedKey;
    componentsRef.current.forEach((obj, key) => {
      obj.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as CatalogSurfaceMaterial & { _isTextured?: boolean };
          if (!mat) return;
          if (isCatalogTexturedMat(mat)) {
            if (key === highlightedKey) {
              mat.color = new THREE.Color(HIGHLIGHT_C);
              if ("emissive" in mat) {
                mat.emissive = new THREE.Color(HIGHLIGHT_C);
                mat.emissiveIntensity = 1.2;
              }
            } else {
              mat.color = new THREE.Color(0xffffff);
              if ("emissive" in mat) {
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;
              }
            }
            return;
          }
          if (!("emissive" in mat)) return;
          if (key === highlightedKey) {
            mat.emissive = new THREE.Color(HIGHLIGHT_C);
            mat.emissiveIntensity = 1.4;
            mat.color = new THREE.Color(HIGHLIGHT_C);
          } else {
            mat.emissive = new THREE.Color(ACCENT_C);
            mat.emissiveIntensity = 0.25;
            mat.color = new THREE.Color(ACCENT_C);
          }
        });
      });
    });
  }, [highlightedKey]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    setCanvasError(null);

    const width = mount.clientWidth || 640;
    const height = mount.clientHeight || 400;

    const orbit: OrbitState = {
      yaw: 0.45,
      pitch: 0.32,
      radius: 21,
      target: new THREE.Vector3(0, ORBIT_HOME_Y, 0),
    };
    orbitRef.current = orbit;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0xa8bdd9, 0.017);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(8, 6, 10);
    camera.lookAt(orbit.target);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      if (!renderer.getContext()) throw new Error("WebGL bağlamı yok");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Tarayıcı 3D (WebGL) desteği eksik görünüyor.";
      setCanvasError(msg);
      return () => {};
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const ambient = new THREE.AmbientLight(0xe8f5ff, 0.42);
    scene.add(ambient);

    const hemiInterior = new THREE.HemisphereLight(0xfffef8, 0x5a7bb8, 0.62);
    scene.add(hemiInterior);

    const warmSunSide = new THREE.DirectionalLight(0xffefe0, 0.92);
    warmSunSide.position.set(-10, 6.5, 12);
    const warmSunTgt = new THREE.Object3D();
    warmSunTgt.position.set(-1.2, 1.2, 0);
    scene.add(warmSunTgt);
    warmSunSide.target = warmSunTgt;
    warmSunSide.castShadow = true;
    warmSunSide.shadow.mapSize.width = 1536;
    warmSunSide.shadow.mapSize.height = 1536;
    warmSunSide.shadow.camera.near = 4;
    warmSunSide.shadow.camera.far = 38;
    warmSunSide.shadow.camera.left = -14;
    warmSunSide.shadow.camera.right = 14;
    warmSunSide.shadow.camera.top = 16;
    warmSunSide.shadow.camera.bottom = -16;
    scene.add(warmSunSide);

    const keyFill = new THREE.DirectionalLight(0xe8fbff, 0.52);
    keyFill.position.set(-4, 8, -2);
    scene.add(keyFill);

    const dir = new THREE.DirectionalLight(0xffffff, 0.38);
    dir.position.set(6, 12, 5);
    dir.castShadow = false;
    dir.shadow.mapSize.width = 2048;
    dir.shadow.mapSize.height = 2048;
    dir.shadow.camera.near = 0.5;
    dir.shadow.camera.far = 40;
    dir.shadow.camera.left = -12;
    dir.shadow.camera.right = 12;
    dir.shadow.camera.top = 14;
    dir.shadow.camera.bottom = -12;
    dir.shadow.bias = -0.00025;
    dir.shadow.normalBias = 0.02;
    scene.add(dir);

    const rim = new THREE.PointLight(ACCENT_C, 0.16, 32);
    rim.position.set(-5, 3.5, -3);
    scene.add(rim);

    const { grassMesh: ground } = addTwinConstructionSite(scene);

    const villaGroup = new THREE.Group();
    villaGroup.position.y = TWIN_FOUNDATION_TOP_Y;

    const cyan = ACCENT_C;

    const floorHold = new THREE.MeshStandardMaterial({
      color: 0x18242e,
      roughness: 0.92,
      metalness: 0.06,
      envMapIntensity: 0.15,
    });
    const ceilHold = floorHold.clone();
    ceilHold.color = new THREE.Color(0xdce2e9);

    const floorW = PLAN_BUILDING.width - 0.06;
    const floorD = PLAN_BUILDING.depth - 0.06;
    const interiorFloorLower = new THREE.Mesh(new THREE.PlaneGeometry(floorW, floorD), floorHold);
    interiorFloorLower.rotation.x = -Math.PI / 2;
    interiorFloorLower.position.set(0, PLAN_BUILDING.floorY, 0);
    interiorFloorLower.receiveShadow = true;
    villaGroup.add(interiorFloorLower);

    const interiorFloorUpper = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), floorHold.clone());
    interiorFloorUpper.rotation.x = -Math.PI / 2;
    interiorFloorUpper.position.set(0, -2, 0);
    interiorFloorUpper.visible = false;
    villaGroup.add(interiorFloorUpper);

    const ceilingLower = new THREE.Mesh(new THREE.PlaneGeometry(floorW - 0.04, floorD - 0.04), ceilHold.clone());
    ceilingLower.rotation.x = Math.PI;
    ceilingLower.position.set(0, PLAN_BUILDING.ceilingY, 0);
    ceilingLower.receiveShadow = true;
    ceilingLower.visible = false;
    villaGroup.add(ceilingLower);

    const ceilingUpper = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), ceilHold.clone());
    ceilingUpper.rotation.x = Math.PI;
    ceilingUpper.position.set(0, -2, 0);
    ceilingUpper.visible = false;
    villaGroup.add(ceilingUpper);

    const blueprintDash = new THREE.LineDashedMaterial({
      color: 0x8ab4ff,
      transparent: true,
      opacity: 0.05,
      dashSize: GRID_CELL * 0.2,
      gapSize: GRID_CELL * 0.12,
    });
    const gw = PLAN_BUILDING.width / 2 + 0.4;
    const gd = PLAN_BUILDING.depth / 2 + 0.35;
    const microPts: THREE.Vector3[] = [];
    for (let gx = snapGrid(-gw); gx <= snapGrid(gw); gx += GRID_CELL) {
      microPts.push(new THREE.Vector3(gx, 0.02, snapGrid(-gd)), new THREE.Vector3(gx, 0.02, snapGrid(gd)));
    }
    for (let gz = snapGrid(-gd); gz <= snapGrid(gd); gz += GRID_CELL) {
      microPts.push(new THREE.Vector3(snapGrid(-gw), 0.02, gz), new THREE.Vector3(snapGrid(gw), 0.02, gz));
    }
    const microGeom = new THREE.BufferGeometry().setFromPoints(microPts);
    const microGrid = new THREE.LineSegments(microGeom, blueprintDash);
    microGrid.computeLineDistances();
    villaGroup.add(microGrid);

    const zoneMat = new THREE.LineBasicMaterial({
      color: cyan,
      transparent: true,
      opacity: 0.24,
    });
    const planWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(PLAN_BUILDING.width, PLAN_BUILDING.ceilingY, PLAN_BUILDING.depth)
      ),
      zoneMat
    );
    planWire.position.y = PLAN_BUILDING.ceilingY / 2;
    villaGroup.add(planWire);

    addSingleStoreyFloorPlan(villaGroup);
    addOpenPlanShell(villaGroup);

    const makeComp = (
      key: string,
      geom: THREE.BufferGeometry,
      pos: [number, number, number],
      scaleVec = new THREE.Vector3(1, 1, 1)
    ) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: ACCENT_C,
        emissive: ACCENT_C,
        emissiveIntensity: 0.2,
        metalness: 0.78,
        roughness: 0.34,
        clearcoat: 0.45,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1,
        transparent: true,
        opacity: 0.98,
      });
      mat.userData.slotForCatalog = key;
      const mesh = new THREE.Mesh(geom, mat);
      mesh.scale.copy(scaleVec);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(...pos);
      mesh.name = key;
      villaGroup.add(mesh);
      componentsRef.current.set(key, mesh);
      return mesh;
    };

    const texLoader = new THREE.TextureLoader();
    const acTex = texLoader.load(acIndoorTex);
    acTex.colorSpace = THREE.SRGBColorSpace;
    acBaselineTexRef.current = acTex;

    const makeTexturedUnit = (
      tex: THREE.Texture,
      width: number,
      height: number,
      pos: [number, number, number],
      rotY = 0,
      catalogKey?: string
    ) => {
      const group = new THREE.Group();
      const depth = rotY === Math.PI ? 0.036 : -0.036;
      const chassis = new THREE.Mesh(
        new RoundedBoxGeometry(width + 0.12, height + 0.12, 0.068, 3, 0.014),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xeef2f7),
          metalness: 0.66,
          roughness: 0.38,
          clearcoat: 0.08,
          envMapIntensity: 0.75,
        })
      );
      chassis.rotation.y = rotY;
      chassis.position.z = depth;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      group.add(chassis);

      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
        metalness: 0.12,
        roughness: 0.72,
        alphaTest: 0.05,
        envMapIntensity: 0.55,
      });
      (mat as CatalogSurfaceMaterial & { _isTextured?: boolean })._isTextured = true;
      if (catalogKey) mat.userData.slotForCatalog = catalogKey;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
      mesh.rotation.y = rotY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      const halo = new THREE.Mesh(
        new THREE.PlaneGeometry(width * 1.65, height * 1.85),
        new THREE.MeshBasicMaterial({
          color: HIGHLIGHT_C,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      halo.rotation.y = rotY;
      halo.position.z = -0.01;
      halo.userData.isHalo = true;
      group.add(halo);

      group.position.set(...pos);
      return group;
    };

    const sEq = SCALE.equipment;
    const sRad = SCALE.radiator;

    makeComp(
      "boiler",
      new THREE.CylinderGeometry(0.35 * sEq, 0.39 * sEq, 1.22 * sEq, 26),
      LAYOUT.boiler as [number, number, number]
    );
    makeComp(
      "tank",
      new THREE.CylinderGeometry(0.44 * sEq, 0.46 * sEq, 1.62 * sEq, 26),
      LAYOUT.tank as [number, number, number]
    );
    makeComp(
      "pump",
      new THREE.SphereGeometry(0.27 * sEq, 48, 48),
      LAYOUT.pump as [number, number, number],
      new THREE.Vector3(1, 1, 1)
    );
    makeComp(
      "manifold",
      new RoundedBoxGeometry(1.62 * sEq, 0.22 * sEq, 0.28 * sEq, 4, 0.036 * sEq),
      LAYOUT.manifold as [number, number, number]
    );

    const underGroup = new THREE.Group();
    const pipeTpl = new THREE.MeshPhysicalMaterial({
      color: ACCENT_C,
      emissive: ACCENT_C,
      emissiveIntensity: 0.16,
      metalness: 0.88,
      roughness: 0.38,
      clearcoat: 0.35,
      envMapIntensity: 0.9,
      transparent: true,
      opacity: 0.96,
    });
    pipeTpl.userData.slotForCatalog = "underfloor";
    LAYOUT.underfloorXs.forEach((x) => {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04 * sEq, 0.04 * sEq, 3.6 * sEq, 12),
        pipeTpl.clone()
      );
      (pipe.material as THREE.MeshPhysicalMaterial).userData.slotForCatalog = "underfloor";
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(x, 0.05, 0);
      pipe.castShadow = true;
      pipe.receiveShadow = true;
      underGroup.add(pipe);
    });
    underGroup.name = "underfloor";
    villaGroup.add(underGroup);
    componentsRef.current.set("underfloor", underGroup);

    const radGroup = new THREE.Group();
    LAYOUT.radiators.forEach((p) => {
      const core = new THREE.MeshPhysicalMaterial({
        color: ACCENT_C,
        emissive: ACCENT_C,
        emissiveIntensity: 0.22,
        metalness: 0.52,
        roughness: 0.34,
        clearcoat: 0.2,
        envMapIntensity: 0.92,
        transparent: true,
        opacity: 0.97,
      });
      core.userData.slotForCatalog = "radiators";
      const rg = 0.034 * sRad;
      const body = new THREE.Mesh(
        new RoundedBoxGeometry(0.93 * sRad, 0.72 * sRad, 0.14 * sRad, 4, rg),
        core
      );
      const finMat = core.clone();
      const finCount = 11;
      for (let i = 0; i < finCount; i++) {
        const t = (i - (finCount - 1) / 2) * 0.072 * sRad;
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(0.87 * sRad, 0.018 * sRad, 0.055 * sRad),
          finMat
        );
        fin.position.y = t;
        body.add(fin);
      }
      body.position.set(p[0], Math.max(0.5, p[1] - EQUIP_Y_DROP_SINGLE_STORY), p[2]);
      body.castShadow = true;
      body.receiveShadow = true;
      radGroup.add(body);
    });
    radGroup.name = "radiators";
    villaGroup.add(radGroup);
    componentsRef.current.set("radiators", radGroup);

    const acGroup = new THREE.Group();
    LAYOUT.acUnits.forEach((c) => {
      const ay = Math.max(1.02, c.pos[1] - EQUIP_Y_DROP_SINGLE_STORY);
      const unit = makeTexturedUnit(
        acTex,
        SCALE.acWidth * sEq,
        SCALE.acHeight * sEq,
        [c.pos[0], ay, c.pos[2]],
        c.rotY,
        "ac-units"
      );
      acGroup.add(unit);
    });
    acGroup.name = "ac-units";
    villaGroup.add(acGroup);
    componentsRef.current.set("ac-units", acGroup);

    scene.add(villaGroup);

    let disposeTwinAssets: (() => void) | null = null;
    let twinCancelled = false;

    void applyTwinProfessionalLook(
      {
        scene,
        renderer,
        exteriorGround: ground,
        interiorFloorLower,
        interiorFloorUpper,
        ceilingLower,
        ceilingUpper,
      },
      maxAniso,
      { skipExteriorGroundMaterial: true }
    )
      .then((dispose) => {
        if (twinCancelled) {
          dispose();
          return;
        }
        disposeTwinAssets = dispose;
        setPbrStatus(null);
      })
      .catch((err) => {
        console.warn("[Villa3D] Poly Haven PBR:", err);
        setPbrStatus(null);
      });

    let isDown = false;
    let prevX = 0;
    let prevY = 0;

    const onDown = (e: PointerEvent) => {
      isDown = true;
      prevX = e.clientX;
      prevY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onUp = (e: PointerEvent) => {
      isDown = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      orbit.yaw -= dx * 0.005;
      orbit.pitch = Math.max(-0.45, Math.min(1.15, orbit.pitch + dy * 0.005));
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbit.radius = Math.max(10, Math.min(48, orbit.radius + e.deltaY * 0.01));
    };

    const dom = renderer.domElement;
    dom.style.touchAction = "none";
    dom.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    dom.addEventListener("wheel", onWheel, { passive: false });

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    let raf = 0;
    let inViewport = true;

    const stopRenderLoop = (): void => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const renderFrame = (): void => {
      if (!inViewport || document.hidden) {
        raf = 0;
        return;
      }
      const o = orbit;
      camera.position.set(
        o.target.x + Math.sin(o.yaw) * Math.cos(o.pitch) * o.radius,
        o.target.y + Math.sin(o.pitch) * o.radius + 0.5,
        o.target.z + Math.cos(o.yaw) * Math.cos(o.pitch) * o.radius
      );
      camera.lookAt(o.target);

      componentsRef.current.forEach((obj, key) => {
        obj.traverse((c) => {
          const mesh = c as THREE.Mesh;
          if (mesh.userData.isHalo) {
            const m = mesh.material as THREE.MeshBasicMaterial;
            m.opacity = key === highlightRef.current ? 0 : 0;
          }
        });
      });
      if (highlightRef.current) {
        const obj = componentsRef.current.get(highlightRef.current);
        if (obj) {
          const t = performance.now() * 0.004;
          const k = 1.0 + Math.sin(t) * 0.4;
          obj.traverse((c) => {
            const mesh = c as THREE.Mesh;
            if (mesh.userData.isHalo) {
              const hm = mesh.material as THREE.MeshBasicMaterial;
              hm.opacity = 0.22 + Math.sin(t) * 0.12;
              return;
            }
            if (!mesh.isMesh) return;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((mm) => {
              const m = mm as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
              if (!m || !("emissiveIntensity" in m)) return;
              m.emissiveIntensity = 1.15 + k * 0.42;
            });
          });
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderFrame);
    };

    const startRenderLoop = (): void => {
      if (raf !== 0 || document.hidden || !inViewport) return;
      raf = requestAnimationFrame(renderFrame);
    };

    const viewportIo = new IntersectionObserver(
      ([e]) => {
        inViewport = Boolean(e?.isIntersecting);
        if (inViewport && !document.hidden) startRenderLoop();
        else stopRenderLoop();
      },
      { root: null, threshold: 0.04, rootMargin: "80px 0px" },
    );
    viewportIo.observe(mount);

    const onVisibility = (): void => {
      if (document.hidden) {
        stopRenderLoop();
        return;
      }
      startRenderLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    function clearCatalogTextures() {
      componentsRef.current.forEach((root) => {
        root.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mm) => {
            const mat = mm as CatalogSurfaceMaterial & { _isTextured?: boolean };
            if (!mat?.userData?.slotForCatalog) return;
            if (isCatalogTexturedMat(mat) && mat.userData.slotForCatalog === "ac-units" && acBaselineTexRef.current) {
              mat.map = acBaselineTexRef.current;
            } else {
              mat.map = null;
            }
            mat.needsUpdate = true;
          });
        });
      });
    }

    const applyProductTextureHandler = (payload: {
      texture: THREE.Texture | null;
      key: string | null;
    } | null) => {
      if (!payload?.texture || !payload.key) {
        if (productTexRef.current && productTexRef.current !== acBaselineTexRef.current) {
          productTexRef.current.dispose();
        }
        productTexRef.current = null;
        clearCatalogTextures();
        return;
      }

      const { texture, key } = payload;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, maxAniso);

      componentsRef.current.forEach((root) => {
        root.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const mat = m as CatalogSurfaceMaterial & { userData: { slotForCatalog?: string } };
            if (!mat?.userData?.slotForCatalog) return;
            if (mat.userData.slotForCatalog !== key) return;
            mat.map = texture;
            mat.needsUpdate = true;
          });
        });
      });

      const prevExtra = productTexRef.current;
      if (prevExtra && prevExtra !== texture && prevExtra !== acBaselineTexRef.current) {
        prevExtra.dispose();
      }
      productTexRef.current = texture;
    };

    (mount as HTMLElement & { __villaApplyProduct?: typeof applyProductTextureHandler }).__villaApplyProduct =
      applyProductTextureHandler;

    if (!document.hidden) {
      startRenderLoop();
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      viewportIo.disconnect();
      twinCancelled = true;
      disposeTwinAssets?.();
      disposeTwinAssets = null;
      delete (mount as HTMLElement & { __villaApplyProduct?: unknown }).__villaApplyProduct;
      cancelAnimationFrame(raf);
      ro.disconnect();
      dom.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      dom.removeEventListener("wheel", onWheel);
      if (productTexRef.current && productTexRef.current !== acBaselineTexRef.current) {
        productTexRef.current.dispose();
      }
      productTexRef.current = null;
      orbitRef.current = null;
      renderer.dispose();
      if (dom.parentNode) dom.parentNode.removeChild(dom);
      componentsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!orbitRef.current) return;
    const o = orbitRef.current;
    const reset = () => {
      gsap.killTweensOf(o.target);
      gsap.killTweensOf(o);
      gsap.to(o.target, { x: 0, y: ORBIT_HOME_Y, z: 0, duration: 1.1, ease: "power3.inOut" });
      gsap.to(o, { radius: 21, duration: 1.1, ease: "power3.inOut" });
    };

    const key = highlightedKey;
    if (!key) {
      reset();
      return;
    }

    const wp = new THREE.Vector3();
    const obj = componentsRef.current.get(key);
    if (obj) {
      obj.updateWorldMatrix(true, false);
      obj.getWorldPosition(wp);
    } else {
      wp.set(0, ORBIT_HOME_Y, 0);
    }

    gsap.killTweensOf(o.target);
    gsap.killTweensOf(o);
    const targetR =
      key === "underfloor" || key === "manifold"
        ? 17
        : key === "radiators" || key === "ac-units"
          ? 14
          : 12.8;
    gsap.to(o.target, {
      x: wp.x * 0.92,
      y: wp.y + 0.35,
      z: wp.z * 0.92,
      duration: 1.28,
      ease: "power3.inOut",
    });
    gsap.to(o, { radius: targetR, duration: 1.32, ease: "power3.inOut" });
  }, [highlightedKey]);

  useEffect(() => {
    const mount = mountRef.current as (HTMLElement & {
      __villaApplyProduct?: (p: { texture: THREE.Texture | null; key: string | null }) => void;
    }) | null;
    if (!mount) return;

    let cancelled = false;
    let loaded: THREE.Texture | null = null;
    let raf = 0;
    let retries = 0;
    const maxRetries = 90;

    const applyClear = () => mount.__villaApplyProduct?.({ texture: null, key: null });

    const schedule = () => {
      if (cancelled) return;
      const ap = mount.__villaApplyProduct;
      const key = highlightedKey ?? null;
      const url = productImageUrl?.trim() ?? null;

      if (!key || !url) {
        if (ap) applyClear();
        return;
      }

      if (!ap) {
        if (retries++ < maxRetries) {
          raf = requestAnimationFrame(schedule);
        }
        return;
      }

      const loader = new THREE.TextureLoader();
      loader.load(url, (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        loaded = tex;
        mount.__villaApplyProduct?.({ texture: tex, key });
      });
    };

    schedule();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (loaded) loaded.dispose();
    };
  }, [highlightedKey, productImageUrl]);

  const portalLabel = highlightedKey
    ? PORTAL_DESCRIPTIONS[highlightedKey] ?? highlightedKey.replace(/-/g, " ")
    : "Blueprint görünümü";

  return (
    <div
      className="relative w-full h-[520px] md:h-[600px] rounded-2xl overflow-hidden glass border-[rgba(91,141,255,0.25)] shadow-[0_0_0_1px_rgba(91,141,255,0.12),inset_0_1px_0_rgba(255,255,255,0.08),0_32px_64px_rgba(13,22,56,0.55)]"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl z-[1]"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, rgba(80, 130, 220, 0.08) 0%, transparent 32%, rgba(13, 22, 56, 0.55) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-6 rounded-xl border border-dashed border-[rgba(91,141,255,0.18)] opacity-55 z-[1]"
        aria-hidden
      />
      <div ref={mountRef} className="absolute inset-0 z-0" />
      {canvasError !== null && (
        <div className="absolute inset-0 z-[4] grid place-items-center rounded-2xl bg-background/92 p-6 text-center border border-destructive/30">
          <div>
            <p className="mb-2 font-display text-[10px] tracking-[0.25em] uppercase text-destructive">3D sahne</p>
            <p className="max-w-sm text-sm text-foreground/80">{canvasError}</p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 gap-3 p-3 md:p-5 z-[2] md:gap-5">
        <div className="flex flex-col items-start justify-start">
          <div className="rounded-lg bg-background/55 backdrop-blur-md border border-white/[0.1] px-3 py-2.5 max-w-[12rem] shadow-[0_8px_32px_rgba(0,0,0,0.28)]">
            <div className="flex items-center gap-2 text-[10px] font-display tracking-[0.3em] text-[#7eb0ff] uppercase">
              <LayoutDashboard className="w-3.5 h-3.5 text-[#7eb0ff] shrink-0 opacity-90 stroke-[2]" />
              Dijital ikiz
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-foreground/72 font-sans tracking-wide">
              Grid modül · {GRID_CELL} m · Yerleşim Mühendislik hassasiyetinde
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-start">
          <div className="rounded-lg bg-background/50 backdrop-blur-md border border-white/[0.08] px-2 py-2 space-y-1.5 text-[10px] font-display tracking-[0.2em] text-foreground/60 uppercase shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <span className="flex items-center gap-2 justify-end text-[#7eb0ff]/90">
              <Layers className="w-3 h-3 stroke-[2]" /> Çatı
            </span>
            <span className="flex items-center gap-2 justify-end">
              <Wind className="w-3 h-3 text-foreground/55 stroke-[2]" /> Yatak
            </span>
            <span className="flex items-center gap-2 justify-end">
              <Flame className="w-3 h-3 text-foreground/55 stroke-[2]" /> Salon
            </span>
            <span className="flex items-center gap-2 justify-end">
              <Cpu className="w-3 h-3 text-foreground/55 stroke-[2]" /> Mekanik
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start justify-end">
          {highlightedKey && (
            <div className="rounded-lg bg-background/58 backdrop-blur-md border border-[#00c853]/40 px-3 py-2 max-w-[15rem] shadow-[0_8px_32px_rgba(0,0,0,0.35)] animate-[var(--animate-fade-in)]">
              <div className="font-display text-[9px] tracking-[0.35em] text-[#00c853] uppercase mb-1">
                Portal hedef
              </div>
              <p className="text-[12px] text-foreground/88 leading-snug">{portalLabel}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end justify-end">
          <div className="rounded-lg px-3 py-2 bg-background/45 backdrop-blur-sm border border-white/[0.07] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            <span className="font-display text-[9px] tracking-[0.28em] text-foreground/50 uppercase block text-right mb-1">
              Blueprint şematik
            </span>
            <span className="text-[10px] text-[#7eb0ff]/90 font-mono tracking-tight tabular-nums block text-right">
              Ölçek 1:? · Yerleşim grid
            </span>
          </div>
          <div className="mt-2 font-display text-[9px] tracking-[0.22em] text-foreground/45 uppercase max-w-[11rem] text-right leading-relaxed">
            IBL (Poly Haven) · Yer döşeme & duvar dokuları
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center z-[3] opacity-95">
        {highlightedKey && (
          <div className="rounded-full bg-background/65 backdrop-blur-md border border-[#00c853]/35 px-4 py-2 font-display text-[10px] tracking-[0.25em] uppercase text-[#00c853] animate-[var(--animate-fade-in)] shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
            ▶ {portalLabel}
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute top-14 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2">
        {pbrStatus && (
          <div className="rounded-full bg-[rgba(91,141,255,0.12)] backdrop-blur-md border border-[rgba(91,141,255,0.38)] px-4 py-2 font-display text-[9px] tracking-[0.2em] uppercase text-[#9ec5ff] animate-pulse max-w-[92vw] text-center shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
            {pbrStatus}
          </div>
        )}
        <div className="rounded-full bg-black/35 backdrop-blur-md border border-white/[0.08] px-4 py-1.5 font-display text-[10px] tracking-[0.25em] text-foreground/60 uppercase">
          Sürükleyerek bak · Kaydır yakınlaştır
        </div>
      </div>
    </div>
  );
};

export default Villa3D;
