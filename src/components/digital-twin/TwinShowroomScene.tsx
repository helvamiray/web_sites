import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Grid, Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useLayoutEffect } from "react";
import { Color, MeshStandardMaterial, Vector3, type Mesh } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  DIGITAL_TWIN_CYAN,
  DIGITAL_TWIN_CYAN_SOFT,
  DIGITAL_TWIN_GLASS,
  DIGITAL_TWIN_HVAC_ZONES,
} from "@/constants/digitalTwinShowroom";
import {
  resolveTwinCameraPreset,
  useDigitalTwinExperience,
} from "@/context/DigitalTwinExperienceContext";

const tmpCamPos = new Vector3();
const tmpTarget = new Vector3();

const CAMERA_LERP = 3.2;
const TRANSITION_EPS = 0.045;

const ATT_CYAN = new Color(DIGITAL_TWIN_CYAN_SOFT);

function ResizeListener() {
  const gl = useThree((s) => s.gl);
  useLayoutEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }, [gl]);
  return null;
}

function ShowroomCameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { activeRoom, selectedZoneId, setCameraTransitioning } =
    useDigitalTwinExperience();
  const prevMoving = useRef<boolean | null>(null);

  useFrame((_, delta) => {
    const preset = resolveTwinCameraPreset(activeRoom, selectedZoneId);
    tmpCamPos.set(...preset.position);
    tmpTarget.set(...preset.target);

    const k = 1 - Math.exp(-delta * CAMERA_LERP);
    camera.position.lerp(tmpCamPos, k);

    const ctrl = controlsRef.current;
    if (ctrl) {
      ctrl.target.lerp(tmpTarget, k);
      ctrl.update();
    }

    const arrived =
      camera.position.distanceTo(tmpCamPos) < TRANSITION_EPS &&
      (!ctrl || ctrl.target.distanceTo(tmpTarget) < TRANSITION_EPS);
    const moving = !arrived;
    if (prevMoving.current !== moving) {
      prevMoving.current = moving;
      setCameraTransitioning(moving);
    }
  });

  const inspectZoom = !!selectedZoneId;

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableDamping
      dampingFactor={0.06}
      minDistance={inspectZoom ? 3.2 : 7}
      maxDistance={inspectZoom ? 22 : 34}
      maxPolarAngle={Math.PI / 2 - 0.06}
      rotateSpeed={0.72}
      zoomSpeed={0.65}
      target={[0, 1.2, 0]}
    />
  );
}

interface TwinBuildingShellProps {
  wallOpacity: number;
  roofLift: number;
}

function TwinBuildingShell({ wallOpacity, roofLift }: TwinBuildingShellProps) {
  const glass = DIGITAL_TWIN_GLASS;

  return (
    <group position={[0, 0, -0.5]}>
      <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[6, 2.2, 4]} />
        <meshPhysicalMaterial
          color={glass}
          metalness={0.12}
          roughness={0.42}
          transmission={wallOpacity < 0.95 ? 0.62 : 0}
          thickness={0.35}
          transparent={wallOpacity < 1}
          opacity={wallOpacity}
          clearcoat={0.55}
          clearcoatRoughness={0.22}
          envMapIntensity={1}
          attenuationColor={ATT_CYAN}
          attenuationDistance={2}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[1.8, 0.85, 2.05]}>
        <boxGeometry args={[2.2, 1.7, 1]} />
        <meshPhysicalMaterial
          color={glass}
          metalness={0.12}
          roughness={0.42}
          transmission={wallOpacity < 0.95 ? 0.58 : 0}
          thickness={0.35}
          transparent={wallOpacity < 1}
          opacity={wallOpacity}
          clearcoat={0.48}
          envMapIntensity={0.95}
          attenuationColor={ATT_CYAN}
          attenuationDistance={1.8}
        />
      </mesh>
      <mesh castShadow position={[0, 2.55 + roofLift, 0]}>
        <boxGeometry args={[6.4, 0.25, 4.4]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.15} roughness={0.72} />
      </mesh>
    </group>
  );
}

interface HvacHotspotsProps {
  selectedZoneId: string | null;
  energyPulse: boolean;
  cutawayHighlight: boolean;
}

function HvacHotspots({
  selectedZoneId,
  energyPulse,
  cutawayHighlight,
}: HvacHotspotsProps) {
  const { selectZone } = useDigitalTwinExperience();
  const meshRefs = useRef<(Mesh | null)[]>([]);
  /** Half the hotspot material updates (~30 Hz subjective) — same look, less GPU churn. */
  const frameStride = useRef(0);

  useFrame(({ clock }) => {
    frameStride.current = (frameStride.current + 1) % 2;
    if (frameStride.current !== 0) return;

    const t = clock.elapsedTime;
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh?.material) return;
      const mat = mesh.material as MeshStandardMaterial;
      const zone = DIGITAL_TWIN_HVAC_ZONES[i];
      const sel = zone?.id === selectedZoneId;
      const pulse = energyPulse ? Math.sin(t * 2.8 + i * 0.7) * 0.22 + 0.55 : 0.42;
      mat.emissiveIntensity = sel ? pulse + 0.35 : pulse * 0.65;
      mesh.scale.setScalar(sel ? 1.08 + Math.sin(t * 3.2) * 0.025 : 1);
    });
  });

  const cyan = DIGITAL_TWIN_CYAN;

  return (
    <group position={[0, 0, -0.5]}>
      {DIGITAL_TWIN_HVAC_ZONES.map((zone, i) => {
        const selected = zone.id === selectedZoneId;
        return (
          <mesh
            key={zone.id}
            ref={(el) => {
              meshRefs.current[i] = el;
            }}
            position={[...zone.position]}
            onClick={(e) => {
              e.stopPropagation();
              selectZone(selected ? null : zone.id);
            }}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "";
            }}
          >
            <sphereGeometry args={[cutawayHighlight && selected ? 0.26 : 0.2, 18, 18]} />
            <meshStandardMaterial
              color={cyan}
              metalness={0.35}
              roughness={0.28}
              emissive={cyan}
              emissiveIntensity={0.55}
              transparent
              opacity={selected ? 0.92 : 0.72}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function AirflowField({ enabled }: { enabled: boolean }) {
  const ribbons = useMemo(() => {
    const drift = [-0.42, -0.22, -1.05] as const;
    return DIGITAL_TWIN_HVAC_ZONES.slice(0, 3).map((z) => {
      const start: [number, number, number] = [
        z.position[0],
        z.position[1] - 0.08,
        z.position[2] - 0.12,
      ];
      const end: [number, number, number] = [
        start[0] + drift[0],
        start[1] + drift[1],
        start[2] + drift[2],
      ];
      const mid: [number, number, number] = [
        (start[0] + end[0]) / 2 + 0.08,
        (start[1] + end[1]) / 2 + 0.06,
        (start[2] + end[2]) / 2 - 0.05,
      ];
      const pts: [number, number, number][] = [start, mid, end];
      return { id: z.id, pts };
    });
  }, []);

  if (!enabled) return null;

  return (
    <group position={[0, 0, -0.5]}>
      {ribbons.map((r) => (
        <Line
          key={r.id}
          points={r.pts}
          color={DIGITAL_TWIN_CYAN}
          lineWidth={1.25}
          transparent
          opacity={0.26}
        />
      ))}
    </group>
  );
}

interface TwinOverlayPlanesProps {
  technicalOverlay: boolean;
}

/** Minimal holographic schematic panes inside the envelope. */
function TwinOverlayPlanes({ technicalOverlay }: TwinOverlayPlanesProps) {
  if (!technicalOverlay) return null;
  const cyan = DIGITAL_TWIN_CYAN;

  return (
    <group position={[0, 0, -0.5]}>
      <mesh position={[0, 1.15, 0.05]}>
        <planeGeometry args={[4.8, 1.85]} />
        <meshBasicMaterial color={cyan} transparent opacity={0.06} depthWrite={false} />
      </mesh>
      <mesh position={[2.05, 1.05, 2.08]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.35, 1.55]} />
        <meshBasicMaterial color={cyan} transparent opacity={0.055} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function TwinShowroomScene() {
  const {
    xRayMode,
    airflowSim,
    energyOverlay,
    technicalOverlay,
    cutawayOpen,
    selectedZoneId,
  } = useDigitalTwinExperience();

  const wallOpacity = xRayMode ? 0.22 : 1;
  const roofLift = cutawayOpen ? 0.85 : 0;

  return (
    <>
      <ResizeListener />

      <ambientLight intensity={0.48} />
      <directionalLight
        castShadow
        intensity={0.92}
        position={[10, 18, 10]}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.00025}
        color="#f8fafc"
      />
      <directionalLight intensity={0.28} position={[-8, 8, -6]} color={DIGITAL_TWIN_CYAN_SOFT} />
      <pointLight position={[2, 4.5, 4]} intensity={0.35} color={DIGITAL_TWIN_CYAN} distance={14} />

      <mesh rotation-x={Math.PI / 2} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.06} roughness={0.94} />
      </mesh>

      <Grid
        position={[0, 0.015, 0]}
        infiniteGrid
        fadeDistance={30}
        sectionSize={1}
        cellSize={0.25}
        sectionThickness={1}
        cellThickness={0.55}
        sectionColor="#64748b"
        cellColor="#475569"
      />

      <TwinBuildingShell wallOpacity={wallOpacity} roofLift={roofLift} />
      <TwinOverlayPlanes technicalOverlay={technicalOverlay} />
      <HvacHotspots
        selectedZoneId={selectedZoneId}
        energyPulse={energyOverlay}
        cutawayHighlight={cutawayOpen}
      />
      <AirflowField enabled={airflowSim} />

      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/empty_play_room_1k.hdr"
        background={false}
      />

      <ShowroomCameraRig />
    </>
  );
}
