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

const DOT_LERP = 0.32;
const RING_LERP = 0.15;
const GLOW_LERP = 0.075;
const TRAIL_LERPS = [0.17, 0.11, 0.07] as const;

const SCROLL_DECAY = 0.91;
const SCROLL_IMPULSE = 0.22;

function applyMagnetic(
  clientX: number,
  clientY: number,
): { x: number; y: number; target: Element | null } {
  const target = document.elementFromPoint(clientX, clientY);
  if (!target) return { x: clientX, y: clientY, target: null };
  const magnetic = target.closest(SELECTOR_MAGNETIC);
  if (!magnetic) return { x: clientX, y: clientY, target };

  const r = magnetic.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const dx = cx - clientX;
  const dy = cy - clientY;
  const dist = Math.hypot(dx, dy) || 1;
  const span = Math.max(r.width, r.height);
  const pull = Math.min(0.26, (span / (dist + span * 0.38)) * 0.16);

  return {
    x: clientX + dx * pull,
    y: clientY + dy * pull,
    target,
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

function isOverInteractive(clientX: number, clientY: number): boolean {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) return false;
  return el.closest(SELECTOR_MAGNETIC) !== null;
}

export function PremiumLuxuryCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trail0Ref = useRef<HTMLDivElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(min-width: 1024px)");
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const coarse = window.matchMedia("(pointer: coarse)");

    if (!fine.matches || !motionOk.matches || coarse.matches) {
      return undefined;
    }

    document.body.classList.add(BODY_CLASS);

    const trailRefs = [trail0Ref, trail1Ref, trail2Ref] as const;

    const raw = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: raw.x, y: raw.y };
    const ring = { x: raw.x, y: raw.y };
    const glow = { x: raw.x, y: raw.y };
    const trail = [
      { x: raw.x, y: raw.y },
      { x: raw.x, y: raw.y },
      { x: raw.x, y: raw.y },
    ];
    let scrollPulse = 0;
    let lastScrollY = window.scrollY;
    let raf = 0;

    const spawnEnergy = (clientX: number, clientY: number, classExtra = "") => {
      const root = rootRef.current;
      if (!root) return;
      const node = document.createElement("div");
      node.className = `lux-cursor-energy${classExtra ? ` ${classExtra}` : ""}`;
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
      const mag = applyMagnetic(raw.x, raw.y);
      const rawInteractive = isOverInteractive(raw.x, raw.y);
      const labelText = resolveLabel(mag.target);
      const stretch = 1 + scrollPulse * 0.55;

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
      const glowAlpha = rawInteractive ? 0.94 + scrollPulse * 0.06 : 0.78 + scrollPulse * 0.1;

      const dotEl = dotRef.current;
      const ringEl = ringRef.current;
      const glowEl = glowRef.current;

      if (dotEl) {
        dotEl.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${ringScale * (1 + scrollPulse * 0.04)})`;
        ringEl.classList.toggle("lux-cursor-ring--hover", rawInteractive);
        ringEl.style.setProperty("--lux-trail-stretch", String(stretch));
      }
      if (glowEl) {
        glowEl.style.transform = `translate3d(${glow.x}px, ${glow.y}px, 0) translate(-50%, -50%)`;
        glowEl.style.opacity = String(Math.min(1, glowAlpha));
        glowEl.style.filter = `blur(${14 + scrollPulse * 6}px)`;
      }

      let prevX = dot.x;
      let prevY = dot.y;
      trailRefs.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;
        const lp = TRAIL_LERPS[i] * (1 + scrollPulse * 0.35);
        trail[i].x += (prevX - trail[i].x) * lp;
        trail[i].y += (prevY - trail[i].y) * lp;
        const tMag = rawInteractive ? 1.15 - i * 0.1 : 1 - i * 0.08;
        el.style.transform = `translate3d(${trail[i].x}px, ${trail[i].y}px, 0) translate(-50%, -50%) scale(${tMag * stretch}, ${tMag * (1 - scrollPulse * 0.06)})`;
        el.style.opacity = rawInteractive
          ? String(0.52 - i * 0.1)
          : String(0.38 - i * 0.09 + scrollPulse * 0.06);
        prevX = trail[i].x;
        prevY = trail[i].y;
      });

      if (rootRef.current) {
        rootRef.current.style.setProperty("--lux-scroll-pulse", String(scrollPulse));
      }
    };

    const tick = () => {
      const mag = applyMagnetic(raw.x, raw.y);
      const tx = mag.x;
      const ty = mag.y;

      dot.x += (tx - dot.x) * DOT_LERP;
      dot.y += (ty - dot.y) * DOT_LERP;
      ring.x += (tx - ring.x) * RING_LERP;
      ring.y += (ty - ring.y) * RING_LERP;
      glow.x += (tx - glow.x) * GLOW_LERP;
      glow.y += (ty - glow.y) * GLOW_LERP;

      scrollPulse *= SCROLL_DECAY;
      applyTransforms();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      raw.x = e.clientX;
      raw.y = e.clientY;
    };

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      scrollPulse = Math.min(1, scrollPulse + SCROLL_IMPULSE + Math.min(0.35, dy * 0.0025));
    };

    const onPointerDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      spawnEnergy(e.clientX, e.clientY);
      window.setTimeout(() => {
        spawnEnergy(e.clientX, e.clientY, "lux-cursor-energy--echo");
      }, 72);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousedown", onPointerDown, { capture: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove(BODY_CLASS);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousedown", onPointerDown, { capture: true });
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="lux-cursor-root" aria-hidden="true">
      <div ref={glowRef} className="lux-cursor-glow" />
      <div ref={trail2Ref} className="lux-cursor-trail lux-cursor-trail--2" />
      <div ref={trail1Ref} className="lux-cursor-trail lux-cursor-trail--1" />
      <div ref={trail0Ref} className="lux-cursor-trail" />
      <div ref={ringRef} className="lux-cursor-ring">
        <span ref={labelRef} className="lux-cursor-label" data-visible="false" />
      </div>
      <div ref={dotRef} className="lux-cursor-dot" />
    </div>
  );
}
