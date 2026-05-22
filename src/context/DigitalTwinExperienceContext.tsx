import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DIGITAL_TWIN_HVAC_ZONES,
  DIGITAL_TWIN_ROOM_CAMERAS,
  DIGITAL_TWIN_SHOWROOM_CAMERA,
} from "@/constants/digitalTwinShowroom";
import { resolveTwinProductId } from "@/data/twinProductBridge";
import { useCart } from "@/providers/CartContext";
import type { TwinRoomId } from "@/types";
import { toast } from "sonner";

export interface DigitalTwinExperienceContextValue {
  activeRoom: TwinRoomId;
  setActiveRoom: (room: TwinRoomId) => void;
  selectedZoneId: string | null;
  selectedTwinProductId: string | null;
  selectedZoneLabel: string | null;
  selectZone: (zoneId: string | null) => void;
  clearSelection: () => void;
  xRayMode: boolean;
  toggleXRay: () => void;
  airflowSim: boolean;
  toggleAirflow: () => void;
  energyOverlay: boolean;
  toggleEnergy: () => void;
  technicalOverlay: boolean;
  toggleTechnical: () => void;
  cutawayOpen: boolean;
  toggleCutaway: () => void;
  /** True while camera lerps after room / inspect change */
  cameraTransitioning: boolean;
  setCameraTransitioning: (v: boolean) => void;
  addSelectionToProject: () => void;
}

const DigitalTwinExperienceContext =
  createContext<DigitalTwinExperienceContextValue | null>(null);

export function DigitalTwinExperienceProvider({ children }: { children: ReactNode }) {
  const { add, openCart } = useCart();
  const [activeRoom, setActiveRoomState] = useState<TwinRoomId>("SHOWROOM");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [xRayMode, setXRayMode] = useState(false);
  const [airflowSim, setAirflowSim] = useState(false);
  const [energyOverlay, setEnergyOverlay] = useState(false);
  const [technicalOverlay, setTechnicalOverlay] = useState(false);
  const [cutawayOpen, setCutawayOpen] = useState(false);
  const [cameraTransitioning, setCameraTransitioning] = useState(false);

  const zoneMeta = useMemo(() => {
    if (!selectedZoneId)
      return { twinId: null as string | null, label: null as string | null };
    const z = DIGITAL_TWIN_HVAC_ZONES.find((r) => r.id === selectedZoneId);
    return { twinId: z?.twinProductId ?? null, label: z?.labelTr ?? null };
  }, [selectedZoneId]);

  const setActiveRoom = useCallback((room: TwinRoomId) => {
    setActiveRoomState(room);
    setSelectedZoneId(null);
    setCutawayOpen(false);
    setCameraTransitioning(true);
  }, []);

  const selectZone = useCallback((zoneId: string | null) => {
    setSelectedZoneId(zoneId);
    setCutawayOpen(!!zoneId);
    setCameraTransitioning(true);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedZoneId(null);
    setCutawayOpen(false);
  }, []);

  const addSelectionToProject = useCallback(() => {
    const tid = zoneMeta.twinId;
    if (!tid) {
      toast.message("Önce bir sistem seçin", {
        description: "Sahnedeki parlayan bileşene tıklayın.",
      });
      return;
    }
    const product = resolveTwinProductId(tid);
    if (!product) {
      toast.error("Ürün eşlemesi bulunamadı");
      return;
    }
    add(product, 1);
    openCart();
    toast.success("Projeye eklendi", { description: product.name });
  }, [add, openCart, zoneMeta.twinId]);

  const value = useMemo<DigitalTwinExperienceContextValue>(
    () => ({
      activeRoom,
      setActiveRoom,
      selectedZoneId,
      selectedTwinProductId: zoneMeta.twinId,
      selectedZoneLabel: zoneMeta.label,
      selectZone,
      clearSelection,
      xRayMode,
      toggleXRay: () => setXRayMode((v) => !v),
      airflowSim,
      toggleAirflow: () => setAirflowSim((v) => !v),
      energyOverlay,
      toggleEnergy: () => setEnergyOverlay((v) => !v),
      technicalOverlay,
      toggleTechnical: () => setTechnicalOverlay((v) => !v),
      cutawayOpen,
      toggleCutaway: () => setCutawayOpen((v) => !v),
      cameraTransitioning,
      setCameraTransitioning,
      addSelectionToProject,
    }),
    [
      activeRoom,
      setActiveRoom,
      selectedZoneId,
      zoneMeta.twinId,
      zoneMeta.label,
      selectZone,
      clearSelection,
      xRayMode,
      airflowSim,
      energyOverlay,
      technicalOverlay,
      cutawayOpen,
      cameraTransitioning,
      addSelectionToProject,
    ],
  );

  return (
    <DigitalTwinExperienceContext.Provider value={value}>
      {children}
    </DigitalTwinExperienceContext.Provider>
  );
}

export function useDigitalTwinExperience() {
  const ctx = useContext(DigitalTwinExperienceContext);
  if (!ctx)
    throw new Error(
      "useDigitalTwinExperience must be used within DigitalTwinExperienceProvider",
    );
  return ctx;
}

/** Resolved camera preset for current navigation + optional inspect zoom */
export function resolveTwinCameraPreset(
  activeRoom: TwinRoomId,
  selectedZoneId: string | null,
): {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
} {
  if (selectedZoneId) {
    const zone = DIGITAL_TWIN_HVAC_ZONES.find((z) => z.id === selectedZoneId);
    if (zone) return zone.inspectCamera;
  }
  if (activeRoom === "SHOWROOM") return DIGITAL_TWIN_SHOWROOM_CAMERA;
  return DIGITAL_TWIN_ROOM_CAMERAS[activeRoom];
}
