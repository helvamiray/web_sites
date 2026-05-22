import { Building2, Home, LayoutGrid, Layers, Wrench } from "lucide-react";
import { useDigitalTwinExperience } from "@/context/DigitalTwinExperienceContext";
import { cn } from "@/lib/utils";
import type { TwinRoomId } from "@/types";

export interface RoomNavigatorProps {
  className?: string;
}

const ROOMS: { id: TwinRoomId; label: string; icon: typeof Building2 }[] = [
  { id: "SHOWROOM", label: "GENEL", icon: LayoutGrid },
  { id: "ÇATI", label: "ÇATI", icon: Layers },
  { id: "YATAK", label: "YATAK", icon: Home },
  { id: "SALON", label: "SALON", icon: Building2 },
  { id: "MEKANİK", label: "MEKANİK", icon: Wrench },
];

export function RoomNavigator({ className }: RoomNavigatorProps) {
  const { activeRoom, setActiveRoom } = useDigitalTwinExperience();

  return (
    <div
      className={cn(
        "pointer-events-auto flex flex-col gap-2 rounded-2xl border border-white/12 bg-black/45 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl",
        className,
      )}
      role="navigation"
      aria-label="Oda seçimi"
    >
      {ROOMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setActiveRoom(id)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide transition-all",
            activeRoom === id
              ? "border border-cyan-400/35 bg-cyan-400/15 text-cyan-50 shadow-[0_0_16px_-8px_rgba(34,211,238,0.65)]"
              : "border border-transparent text-white hover:bg-white/10",
          )}
        >
          <Icon className="size-4 shrink-0 text-cyan-300" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
