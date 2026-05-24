import { useEffect, useRef } from "react";

import {
  LUX_CURSOR_BUTTON_DEFAULT,
  LUX_CURSOR_LINK_DEFAULT,
  LUX_CURSOR_SUMMARY_DEFAULT,
} from "@/constants/luxCursorDefaults";
import "@/styles/premium-luxury-cursor.css";

const BODY_CLASS = "lux-premium-cursor";

/** Targets that pull the cursor (magnetic) and expand the halo. */
const SELECTOR_MAGNETIC =
  "a[href], button, input, textarea, select, summary, [role='button'], .lux-magnetic, .grav-nav-cta, .grav-nav-cart, .ultra-premium-hero__cta-primary, .ultra-premium-hero__cta-secondary";

/** Slightly tighter lerps → fewer RAF frames spent settling. */
const DOT_LERP = 0.38;
const RING_LERP = 0.22;
const GLOW_LERP = 0.12;

/** Minimum pixel delta before RAF keeps settling (combined approx). */
const SETTLE_DOT = 0.35;
const SETTLE_SLOW = 0.55;

function pointerState(clientX: number, clientY: number): {
  targetX: number;
  targetY: number;
  interactive: boolean;
  labelText: string;
} {
  const target = document.elementFromPoint(clientX, clientY);
  if (!target) {
    return {
      targetX: clientX,
      targetY: clientY,
      interactive: false,
      labelText: "",
    };
  }

  const magnetic = target.closest(SELECTOR_MAGNETIC);
  let targetX = clientX;
  let targetY = clientY;

  if (magnetic) {
    const r = magnetic.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = cx - clientX;
    const dy = cy - clientY;
    const dist = Math.hypot(dx, dy) || 1;
    const span = Math.max(r.width, r.height);
    const pull = Math.min(0.26, (span / (dist + span * 0.38)) * 0.16);
    targetX = clientX + dx * pull;
    targetY = clientY + dy * pull;
  }

  return {
    targetX,
    targetY,
    interactive: magnetic !== null,
    labelText: resolveLabel(target),
  };
}

function resolveLabel(target: Element | null): string {
  if (!target) return "";
  const labeled = target.closest("[data-lux-cursor]");
  if (labeled?.hasAttribute("data-lux-cursor")) {
    const raw = labeled.getAttribute("data-lux-cursor")?.trim() ?? "";
    if (raw !== "") return raw;
    return "";
  }

  const interactive = target.closest(SELECTOR_MAGNETIC);
  if (!interactive) return "";
  if (interactive.matches("input, textarea, select")) return "";
  if (interactive.matches("a[href]")) return LUX_CURSOR_LINK_DEFAULT;
  if (interactive.matches("button, [role='button']")) return LUX_CURSOR_BUTTON_DEFAULT;
  if (interactive.matches("summary")) return LUX_CURSOR_SUMMARY_DEFAULT;
  return "";
}

export function PremiumLuxuryCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(min-width: 1024px)");
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const coarse = window.matchMedia("(pointer: coarse)");

    if (!fine.matches || !motionOk.matches || coarse.matches) {
      return undefined;
    }

    document.body.classList.add(BODY_CLASS);

    const raw = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: raw.x, y: raw.y };
    const ring = { x: raw.x, y: raw.y };
    const glow = { x: raw.x, y: raw.y };

    let rafId = 0;

    /** Hit-test synced with raw pointer — no extra `elementFromPoint` per tick. */
    let hit = pointerState(raw.x, raw.y);

    const spawnEnergy = (clientX: number, clientY: number) => {
      const root = rootRef.current;
      if (!root) return;
      const node = document.createElement("div");
      node.className = "lux-cursor-energy";
      node.style.left = `${clientX}px`;
      node.style.top = `${clientY}px`;
      root.appendChild(node);
      node.addEventListener(
        "animationend",
        () => {
          node.remove();
        },
        { once: true },
      );
    };

    const applyTransforms = () => {
      const { interactive: rawInteractive, labelText } = hit;

      const labelEl = labelRef.current;
      if (labelEl) {
        labelEl.textContent = labelText;
        labelEl.dataset.visible = labelText ? "true" : "false";
      }

      const ringScale = rawInteractive
        ? labelText
          ? Math.min(2.72, 1.82 + labelText.length * 0.036)
          : 1.62
        : 1;
      const dotScale = rawInteractive ? 0.92 : 1;
      const glowAlpha = rawInteractive ? 0.9 : 0.76;

      const dotEl = dotRef.current;
      const ringEl = ringRef.current;
      const glowEl = glowRef.current;

      if (dotEl) {
        dotEl.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringEl.classList.toggle("lux-cursor-ring--hover", rawInteractive);
        ringEl.style.setProperty("--lux-scroll-stretch", "1");
      }
      if (glowEl) {
        glowEl.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0) translate(-50%, -50%)`;
        glowEl.style.opacity = String(Math.min(1, glowAlpha));
      }

      if (rootRef.current) {
        rootRef.current.style.setProperty("--lux-scroll-pulse", "0");
      }
    };

    const needsContinuation = (tx: number, ty: number): boolean => {
      const dDot = Math.hypot(tx - dot.x, ty - dot.y);
      const dRing = Math.hypot(tx - ring.x, ty - ring.y);
      const dGlow = Math.hypot(tx - glow.x, ty - glow.y);
      return dDot > SETTLE_DOT || dRing > SETTLE_SLOW || dGlow > SETTLE_SLOW;
    };

    const tick = () => {
      rafId = 0;
      if (document.hidden) return;

      const { targetX: tx, targetY: ty } = hit;

      dot.x += (tx - dot.x) * DOT_LERP;
      dot.y += (ty - dot.y) * DOT_LERP;
      ring.x += (tx - ring.x) * RING_LERP;
      ring.y += (ty - ring.y) * RING_LERP;
      glow.x += (tx - glow.x) * GLOW_LERP;
      glow.y += (ty - glow.y) * GLOW_LERP;

      applyTransforms();

      if (needsContinuation(tx, ty)) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const ensureTick = () => {
      if (document.hidden) return;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const syncPointer = (clientX: number, clientY: number) => {
      raw.x = clientX;
      raw.y = clientY;
      hit = pointerState(clientX, clientY);
      ensureTick();
    };

    const onMove = (e: MouseEvent) => {
      syncPointer(e.clientX, e.clientY);
    };

    const onPointerDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      spawnEnergy(e.clientX, e.clientY);
    };

    const onVisibility = (): void => {
      if (!document.hidden) syncPointer(raw.x, raw.y);
      else cancelAnimationFrame(rafId);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onPointerDown, { capture: true });
    syncPointer(raw.x, raw.y);

    return () => {
      document.body.classList.remove(BODY_CLASS);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onPointerDown, { capture: true });
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={rootRef} className="lux-cursor-root" aria-hidden="true">
      <div ref={glowRef} className="lux-cursor-glow" />
      <div ref={ringRef} className="lux-cursor-ring">
        <span ref={labelRef} className="lux-cursor-label" data-visible="false" />
      </div>
      <div ref={dotRef} className="lux-cursor-dot" />
    </div>
  );
}
