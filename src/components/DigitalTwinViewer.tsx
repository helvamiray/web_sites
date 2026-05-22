import { Canvas } from "@react-three/fiber";
import {
  Boxes,
  Layers,
  ShoppingBag,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { TwinShowroomScene } from "@/components/digital-twin/TwinShowroomScene";
import { DIGITAL_TWIN_HVAC_ZONES } from "@/constants/digitalTwinShowroom";
import { useDigitalTwinExperience } from "@/context/DigitalTwinExperienceContext";
import { RoomNavigator } from "@/components/RoomNavigator";
import { cn } from "@/lib/utils";

interface DigitalTwinViewerProps {
  className?: string;
}

function TwinHudChrome({ className }: { className?: string }) {
  const {
    selectedZoneLabel,
    selectedZoneId,
    technicalOverlay,
    toggleTechnical,
    xRayMode,
    toggleXRay,
    airflowSim,
    toggleAirflow,
    energyOverlay,
    toggleEnergy,
    cutawayOpen,
    toggleCutaway,
    cameraTransitioning,
    addSelectionToProject,
    clearSelection,
  } = useDigitalTwinExperience();

  const zoneDetail =
    selectedZoneId &&
    DIGITAL_TWIN_HVAC_ZONES.find((z) => z.id === selectedZoneId);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 md:p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="pointer-events-auto flex max-w-[min(100%,240px)] items-start gap-2 rounded-2xl border border-cyan-400/25 bg-black/45 px-3 py-2.5 text-[10px] leading-snug text-slate-300 shadow-[0_8px_40px_-16px_rgba(34,211,238,0.35)] backdrop-blur-xl">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-cyan-300" aria-hidden />
          <div>
            <span className="font-semibold tracking-[0.2em] text-white">DİJİTAL İKİZ</span>
            <p className="mt-1 text-[9px] text-slate-400">
              Mimari showroom · sistem seçimi · teknik katmanlar
            </p>
            {cameraTransitioning ? (
              <p className="mt-1.5 text-[9px] font-medium uppercase tracking-wide text-cyan-300/90">
                Kamera geçişi…
              </p>
            ) : null}
          </div>
        </div>

        <RoomNavigator className="hidden md:flex" />

        <div className="hidden w-10 shrink-0 md:block" aria-hidden />
      </div>

      <div className="pointer-events-none flex justify-center pt-10 md:pt-4">
        <p className="rounded-full border border-white/15 bg-black/40 px-5 py-2 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-slate-300 backdrop-blur-md">
          Sahneyi sürekleyin · parlak küreye dokunun · yakınlaştırın
        </p>
      </div>

      <div className="pointer-events-none flex flex-col gap-3 pt-10 md:flex-row md:flex-wrap md:items-end md:justify-between md:pt-4">
        <div className="pointer-events-auto flex flex-wrap gap-2 rounded-2xl border border-white/12 bg-black/40 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:max-w-[min(100%,380px)]">
          <HudToggle active={xRayMode} onClick={toggleXRay} label="X-Ray">
            <Layers className="size-3.5" aria-hidden />
          </HudToggle>
          <HudToggle active={airflowSim} onClick={toggleAirflow} label="Hava">
            <Wind className="size-3.5" aria-hidden />
          </HudToggle>
          <HudToggle active={energyOverlay} onClick={toggleEnergy} label="Enerji">
            <Zap className="size-3.5" aria-hidden />
          </HudToggle>
          <HudToggle active={technicalOverlay} onClick={toggleTechnical} label="Şema">
            <Boxes className="size-3.5" aria-hidden />
          </HudToggle>
          <HudToggle active={cutawayOpen} onClick={toggleCutaway} label="Kesit">
            <Layers className="size-3.5 rotate-90" aria-hidden />
          </HudToggle>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-stretch gap-2 md:justify-end">
          <button
            type="button"
            onClick={addSelectionToProject}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-400/15 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-100 shadow-[0_0_24px_-8px_rgba(34,211,238,0.65)] transition-colors hover:bg-cyan-400/25 md:flex-none"
          >
            <ShoppingBag className="size-4 shrink-0" aria-hidden />
            Projeye ekle
          </button>
          {selectedZoneId ? (
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-xl border border-white/15 bg-black/35 px-3 py-2.5 text-[11px] font-medium text-slate-300 backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Seçimi temizle
            </button>
          ) : null}
        </div>

        {technicalOverlay || selectedZoneLabel ? (
          <div className="pointer-events-auto w-full max-w-[min(100%,320px)] space-y-2 rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-black/55 via-black/40 to-cyan-950/25 px-4 py-3 text-[10px] leading-relaxed text-slate-300 shadow-[0_12px_48px_-20px_rgba(34,211,238,0.45)] backdrop-blur-xl md:ml-auto md:w-auto">
            <p className="font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Teknik panel
            </p>
            <p className="text-white">{selectedZoneLabel ?? "Genel cephe görünümü"}</p>
            {zoneDetail ? (
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 border-t border-white/10 pt-2 text-[9px] text-slate-400">
                <dt>COP (sim.)</dt>
                <dd className="text-right font-mono text-cyan-100/90">4.38</dd>
                <dt>EER</dt>
                <dd className="text-right font-mono text-cyan-100/90">3.92</dd>
                <dt>Hava akışı</dt>
                <dd className="text-right font-mono text-cyan-100/90">
                  {airflowSim ? "Animasyonlu" : "—"}
                </dd>
              </dl>
            ) : (
              <p className="text-[9px] text-slate-500">
                Bir sistem seçildiğinde kesit ve enerji katmanları sisteme göre güncellenir.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface HudToggleProps {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}

function HudToggle({ active, onClick, label, children }: HudToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-semibold uppercase tracking-wide transition-all",
        active
          ? "border border-cyan-400/45 bg-cyan-400/20 text-cyan-50 shadow-[0_0_20px_-10px_rgba(34,211,238,0.75)]"
          : "border border-transparent bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200",
      )}
    >
      {children}
      <span className="max-[380px]:sr-only">{label}</span>
    </button>
  );
}

export function DigitalTwinViewer({ className }: DigitalTwinViewerProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/90 shadow-[0_24px_80px_-40px_rgba(34,211,238,0.35),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl",
        className,
      )}
    >
      <TwinHudChrome />

      <div className="pointer-events-auto absolute right-3 top-[5.5rem] z-10 md:hidden">
        <RoomNavigator />
      </div>

      <div className="min-h-[280px] w-full md:min-h-[360px] lg:min-h-[min(560px,calc(100vh-11rem))]">
        {ready ? (
          <Canvas
            shadows
            className="h-full w-full touch-none [&>div]:h-full"
            camera={{ position: [11.8, 7.8, 14.2], fov: 40, near: 0.1, far: 90 }}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          >
            <TwinShowroomScene />
          </Canvas>
        ) : (
          <div className="flex h-full min-h-[inherit] items-center justify-center bg-black/35 text-sm text-slate-400">
            Sahne yükleniyor…
          </div>
        )}
      </div>
    </div>
  );
}
