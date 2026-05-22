import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type Transition,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

import { prefersSmoothHashScroll } from "@/utils/navigateToHashSection";
import {
  CINEMATIC_SHOWCASE_HERO_SLIDES,
  type CinematicShowcaseSlideDef,
} from "@/constants/cinematicShowcaseHeroSlides";
import { useSyncedCinematicHeroSlides } from "@/hooks/useSyncedSiteCms";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import { ShowcaseHudOverlay } from "@/components/showroom/ShowcaseHudOverlay";

const SLIDE_DURATION_MS = 9800;
const PROGRESS_TICK_MS = 50;

const EASE_APPLE = [0.16, 1, 0.3, 1] as const;
const TEX_EASE_CINEMA: Transition = {
  duration: 0.94,
  ease: EASE_APPLE,
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

interface ShowroomHeroVisualColumnProps {
  heroRef: RefObject<HTMLElement | null>;
  slideDef: CinematicShowcaseSlideDef;
  motionOff: boolean;
  isTr: boolean;
  onHotChange: (hot: boolean) => void;
}

/** Sağ sütun: vitrin, parallax, HUD — yalnızca `showVisualStage` ile mount edilir. */
function ShowroomHeroVisualColumn({
  heroRef,
  slideDef,
  motionOff,
  isTr,
  onHotChange,
}: ShowroomHeroVisualColumnProps) {
  const visualStageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], motionOff ? [0, 0] : [0, 14]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], motionOff ? [1, 1] : [1, 1.004]);

  /** Subtle cinematic tilt */
  useEffect(() => {
    const stage = visualStageRef.current;
    if (!stage || motionOff) return;

    const onMove = (ev: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (ev.clientX - cx) / Math.max(r.width / 2, 1);
      const dy = (ev.clientY - cy) / Math.max(r.height / 2, 1);
      setTilt({
        ry: clamp(dx * 3.25, -3.25, 3.25),
        rx: clamp(-dy * 2.5, -2.5, 2.5),
      });
    };

    const onLeave = () => setTilt({ rx: 0, ry: 0 });

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [motionOff, slideDef.id]);

  const hudLocalized = useMemo(
    () => ({
      frameId: isTr ? slideDef.hudFrameIdTr : slideDef.hudFrameIdEn,
      cards: slideDef.hudTelemetry.map((row) => ({
        label: isTr ? row.labelTr : row.labelEn,
        value: isTr ? row.valueTr : row.valueEn,
      })),
    }),
    [isTr, slideDef.hudFrameIdEn, slideDef.hudFrameIdTr, slideDef.hudTelemetry],
  );

  const tiltStyle: CSSProperties = motionOff
    ? {}
    : {
        transform: `perspective(1400px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transformStyle: "preserve-3d",
      };

  const productVariants = {
    hidden: motionOff ? {} : { opacity: 0, x: 40, scale: 0.985 },
    show: motionOff
      ? {}
      : {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: {
            duration: 1.12,
            ease: EASE_APPLE,
            delay: 0.1,
          },
        },
    exit: motionOff ? {} : { opacity: 0, x: -28, scale: 0.992, transition: { duration: 0.58, ease: EASE_APPLE } },
  };

  return (
    <div className="ultra-premium-hero__visual studio-vega-hero__present-visual">
      <div
        ref={visualStageRef}
        className="ultra-premium-hero__visual-stage studio-vega-hero__present-stage"
        onMouseEnter={() => onHotChange(true)}
        onMouseLeave={() => onHotChange(false)}
      >
        <span className="studio-vega-hero__scene-noise" aria-hidden />
        <div className="ultra-premium-hero__frame-wrap studio-vega-hero__present-frame-shell">
          <div className="studio-vega-hero__render-atmosphere" aria-hidden>
            <span className="studio-vega-hero__render-halo" />
            <span className="studio-vega-hero__render-halo-secondary" />
          </div>
          <div className="ultra-premium-hero__glow studio-vega-hero__cyan-aura studio-vega-hero__cyan-aura--soft" aria-hidden />
          <div
            className="ultra-premium-hero__energy-core studio-vega-hero__present-core-glow studio-vega-hero__present-core-glow--premium"
            aria-hidden
          />
          <div className="ultra-premium-hero__fog-local studio-vega-hero__local-haze" aria-hidden />
          <span className="studio-vega-hero__ambient-rays" aria-hidden />
          <div className="studio-vega-hero__immersive-render-root">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={slideDef.id}
                variants={productVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="studio-vega-hero__present-visual-inner studio-vega-hero__present-visual-inner--immersive"
              >
                <div className="studio-vega-hero__product-tilt" style={tiltStyle}>
                  <motion.div
                    className="studio-vega-hero__cinematic-parallax-shell"
                    style={{ y: parallaxY, scale: parallaxScale }}
                  >
                    <motion.div
                      className="studio-vega-hero__cinematic-float-shell"
                      animate={
                        motionOff
                          ? undefined
                          : {
                              y: ["0%", "-1.05%", "0%"],
                              rotateZ: [-0.25, 0.28, -0.25],
                            }
                      }
                      transition={{
                        duration: 13,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "mirror",
                      }}
                    >
                      <div className="studio-vega-hero__cinematic-viewport studio-vega-hero__cinematic-viewport--bleed">
                        <div className="studio-vega-hero__cinematic-photo-wrap">
                          <div className="studio-vega-hero__showroom-focal" aria-hidden />
                        </div>
                        <div className="studio-vega-hero__cinematic-rim-overlay" aria-hidden />
                        <div className="ultra-premium-hero__product-reflection studio-vega-hero__reflection studio-vega-hero__cinematic-reflection" aria-hidden />
                        <div className="studio-vega-hero__cinematic-sheen" aria-hidden />
                        <div className="studio-vega-hero__cinematic-volumetric-floor" aria-hidden />
                        <div className="studio-vega-hero__cinematic-light-rays" aria-hidden />
                        <div className="studio-vega-hero__cinematic-depth-vignette" aria-hidden />
                        <ShowcaseHudOverlay
                          motionKey={slideDef.id}
                          frameId={hudLocalized.frameId}
                          cards={hudLocalized.cards}
                          reducedMotion={motionOff}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  nextSectionId?: string;
  /**
   * `false`: anasayfa — sağ vitrin / HUD kutucukları yok, sadece sol editoryal + arka plan.
   */
  showVisualStage?: boolean;
}

/**
 * Fullscreen cinematic hero — immersive engineering showcase (editorial pacing).
 */
export function InteractiveShowroomHero({
  nextSectionId = "hakkimizda",
  showVisualStage = true,
}: Props) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const magneticExploreRef = useMagneticButton(0.26);

  const [slideIndex, setSlideIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [reduceMotionSys, setReduceMotionSys] = useState(false);
  const [visualHot, setVisualHot] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const slides = useSyncedCinematicHeroSlides();
  const slideCount = slides.length || 1;

  const motionOff = prefersReducedMotion || reduceMotionSys;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotionSys(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (motionOff) {
      setHeroReady(true);
      return undefined;
    }
    const id = window.setTimeout(() => setHeroReady(true), 120);
    return () => clearTimeout(id);
  }, [motionOff]);

  /** Cursor-linked ambient spotlight */
  useEffect(() => {
    const root = heroRef.current;
    if (!root || motionOff) return;

    const handle = (ev: PointerEvent) => {
      const r = root.getBoundingClientRect();
      root.style.setProperty(
        "--uph-ptr-x",
        `${((ev.clientX - r.left) / Math.max(r.width, 1)) * 100}%`,
      );
      root.style.setProperty(
        "--uph-ptr-y",
        `${((ev.clientY - r.top) / Math.max(r.height, 1)) * 100}%`,
      );
    };

    root.addEventListener("pointermove", handle, { passive: true });
    return () => root.removeEventListener("pointermove", handle);
  }, [motionOff]);

  useEffect(() => {
    if (slides.length === 0) return;
    setSlideIndex((idx) => Math.min(Math.max(0, idx), slides.length - 1));
  }, [slides.length]);

  useEffect(() => {
    if (!showVisualStage) setVisualHot(false);
  }, [showVisualStage]);

  const slideDef: CinematicShowcaseSlideDef =
    slides[slideIndex] ??
    slides[0] ??
    CINEMATIC_SHOWCASE_HERO_SLIDES[0]!;
  const isTr = lang === "tr";

  const localized = useMemo(
    () => ({
      subtitle: isTr ? slideDef.subtitleTr : slideDef.subtitleEn,
      description: isTr ? slideDef.descriptionTr : slideDef.descriptionEn,
      watermark: isTr ? slideDef.watermarkGlyphTr : slideDef.watermarkGlyphEn,
      headlinePrimary: isTr ? slideDef.headlinePrimaryTr : slideDef.headlinePrimaryEn,
      headlineAccent: isTr ? slideDef.headlineAccentTr : slideDef.headlineAccentEn,
      studioRibbon:
        lang === "tr"
          ? "Studio Vega · iklim mühendisliği"
          : "Studio Vega · climate engineering",
    }),
    [
      isTr,
      lang,
      slideDef.descriptionEn,
      slideDef.descriptionTr,
      slideDef.headlineAccentEn,
      slideDef.headlineAccentTr,
      slideDef.headlinePrimaryEn,
      slideDef.headlinePrimaryTr,
      slideDef.subtitleEn,
      slideDef.subtitleTr,
      slideDef.watermarkGlyphEn,
      slideDef.watermarkGlyphTr,
    ],
  );

  const scrollToNext = () => {
    const smooth = prefersSmoothHashScroll();
    const el = document.getElementById(nextSectionId);
    if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    else window.scrollBy({ top: window.innerHeight, behavior: smooth ? "smooth" : "auto" });
  };

  const scrollToProductShowcase = () => {
    const smooth = prefersSmoothHashScroll();
    const el = document.getElementById("product-showcase");
    if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  const openProduct = (slug: string) => {
    navigate({ to: "/urunler/$slug", params: { slug } });
  };

  const bumpSlide = useCallback(
    (delta: number) => {
      progressRef.current = 0;
      setProgressPct(0);
      setSlideIndex((i) => (i + delta + slideCount) % slideCount);
    },
    [slideCount],
  );

  useEffect(() => {
    if (motionOff) {
      setProgressPct(0);
      return undefined;
    }
    const id = window.setInterval(() => {
      let p = progressRef.current;
      p += 100 / (SLIDE_DURATION_MS / PROGRESS_TICK_MS);
      if (p >= 100) {
        p = 0;
        setSlideIndex((i) => (i + 1) % slideCount);
      }
      progressRef.current = p;
      setProgressPct(p);
    }, PROGRESS_TICK_MS);
    return () => clearInterval(id);
  }, [motionOff, slideCount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") bumpSlide(1);
      else if (e.key === "ArrowLeft") bumpSlide(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bumpSlide]);

  const textBlockVariants = {
    hidden: { opacity: motionOff ? 1 : 0 },
    exit: motionOff
      ? { opacity: 1 }
      : { opacity: 0, x: -18, transition: { duration: 0.5, ease: EASE_APPLE } },
    show: {
      opacity: 1,
      transition: motionOff
        ? { duration: 0 }
        : {
            staggerChildren: 0.145,
            delayChildren: 0.08,
            when: "beforeChildren" as const,
          },
    },
  };

  const lineVariants = {
    hidden: motionOff ? {} : { opacity: 0, x: 32, filter: "blur(8px)" },
    show: motionOff
      ? {}
      : {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          transition: TEX_EASE_CINEMA,
        },
    exit: motionOff ? {} : { opacity: 0, x: -22, transition: { duration: 0.48, ease: EASE_APPLE } },
  };

  const hoverClass =
    showVisualStage && visualHot ? " studio-vega-hero--showcase-visual-hover" : "";

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`studio-vega-hero showroom-hero-fixed ultra-premium-hero hero-cinematic midnight-section midnight-section--hero studio-vega-hero--engineering-showcase studio-vega-hero--premium-keynote${showVisualStage ? "" : " studio-vega-hero--copy-only-home"}${hoverClass}${heroReady ? " studio-vega-hero--ready" : ""}`}
      style={
        {
          position: "relative",
          width: "100vw",
          "--vega-hero-progress": `${progressPct}%`,
          "--uph-ptr-x": "52%",
          "--uph-ptr-y": "40%",
          "--sv-navy": "#07111F",
          "--sv-midnight": "#0A2236",
          "--sv-cyan": "#5BE7FF",
          "--sv-mist": "#C9D7E3",
        } as CSSProperties
      }
      aria-label={
        lang === "tr"
          ? "Studio Vega — sinematik iklim mühendisliği"
          : "Studio Vega — cinematic climate engineering"
      }
    >
      <div className="ultra-premium-hero__ambient studio-vega-hero__ambient-layers" aria-hidden />
      <div className="ultra-premium-hero__grid-layer studio-vega-hero__grid-animated" aria-hidden />
      <div className="ultra-premium-hero__fog studio-vega-hero__volumetric" aria-hidden />
      <div className="studio-vega-hero__mouse-glow" aria-hidden />

      <div className="ultra-premium-hero__inner studio-vega-hero__premium-canopy">
        <AnimatePresence initial={false} mode="sync">
          <motion.p
            key={localized.watermark}
            aria-hidden
            className="studio-vega-hero__showroom-watermark"
            initial={motionOff ? false : { opacity: 0, x: "1.25vw", filter: "blur(14px)" }}
            animate={{
              opacity: motionOff ? 0.07 : 0.056,
              x: motionOff ? 0 : "0%",
              filter: motionOff ? "blur(0px)" : "blur(0px)",
            }}
            exit={
              motionOff
                ? { opacity: 0.07 }
                : { opacity: 0, x: "-1vw", filter: "blur(14px)", transition: { duration: 0.45, ease: EASE_APPLE } }
            }
            transition={{ duration: 0.75, ease: EASE_APPLE }}
          >
            {localized.watermark}
          </motion.p>
        </AnimatePresence>
        <div className="studio-vega-hero__premium-particle-field" aria-hidden />

        <div className="ultra-premium-hero__split studio-vega-hero__present-split">
          <div className="ultra-premium-hero__copy relative studio-vega-hero__present-copy">
            <div className="hero-cinematic__copy-spotlight studio-vega-hero__copy-spotlight--soft" aria-hidden />

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={slideDef.id}
                className="relative z-[2] studio-vega-hero__editorial-stack"
                variants={textBlockVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.p
                  variants={lineVariants}
                  className="studio-vega-hero__present-slide-index"
                  aria-hidden
                >
                  {String(slideIndex + 1).padStart(2, "0")}
                </motion.p>
                <motion.p variants={lineVariants} className="studio-vega-hero__present-studiov-tag">
                  {localized.studioRibbon}
                </motion.p>

                <motion.h2 variants={lineVariants} className="studio-vega-hero__present-category">
                  <span className="studio-vega-hero__present-category-primary">
                    {localized.headlinePrimary}
                  </span>
                  {localized.headlineAccent.trim() ? (
                    <span className="studio-vega-hero__present-category-accent">
                      {" "}
                      <span className="studio-vega-hero__present-category-accent-italic">
                        {localized.headlineAccent.trim()}
                      </span>
                    </span>
                  ) : null}
                </motion.h2>
                <motion.p variants={lineVariants} className="studio-vega-hero__present-subtitle">
                  {localized.subtitle}
                </motion.p>
                <motion.p variants={lineVariants} className="studio-vega-hero__present-description">
                  {localized.description}
                </motion.p>

                <motion.div
                  variants={lineVariants}
                  className="studio-vega-hero__cta-duo ultra-premium-hero__actions"
                >
                  <button
                    ref={magneticExploreRef}
                    type="button"
                    className="studio-vega-hero__cta-primary studio-vega-hero__cta-explore hero-cinematic-btn lux-magnetic"
                    onClick={() => openProduct(slideDef.productSlug)}
                  >
                    <span className="studio-vega-hero__cta-explore-label">
                      {lang === "tr" ? "Sistemi İncele" : "Explore system"}
                    </span>
                    <ArrowRight
                      className="studio-vega-hero__cta-explore-arrow"
                      size={18}
                      strokeWidth={1.85}
                      aria-hidden
                    />
                  </button>
                  <button
                    type="button"
                    className="studio-vega-hero__cta-secondary studio-vega-hero__cta-explore-outline hero-cinematic-btn"
                    onClick={scrollToProductShowcase}
                  >
                    {lang === "tr" ? "Katalog akışı" : "Explore catalogue"}
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {showVisualStage ? (
            <ShowroomHeroVisualColumn
              heroRef={heroRef}
              slideDef={slideDef}
              motionOff={motionOff}
              isTr={isTr}
              onHotChange={setVisualHot}
            />
          ) : null}
        </div>

        <nav
          className="ultra-premium-hero__chrome studio-vega-hero__present-nav-shell"
          aria-label={lang === "tr" ? "Ürün vitrin seçici" : "Showcase navigator"}
        >
          <div
            className="studio-vega-hero__present-nav"
            role="tablist"
          >
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === slideIndex}
                className={`studio-vega-hero__present-tab${i === 2 ? " studio-vega-hero__present-tab--hot" : ""} ${i === slideIndex ? "is-active" : ""}`}
                onClick={() => {
                  progressRef.current = 0;
                  setProgressPct(0);
                  setSlideIndex(i);
                }}
              >
                <span className="studio-vega-hero__present-tab-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="studio-vega-hero__present-tab-sep" aria-hidden>
                  ·
                </span>
                <span className="studio-vega-hero__present-tab-name">
                  {isTr ? s.navLabelTr : s.navLabelEn}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="hero-scroll-cta-shell">
        <div className="hero-scroll-cta-bounce">
          <button
            type="button"
            className="hero-scroll-cta lux-magnetic"
            onClick={scrollToNext}
            aria-label={
              lang === "tr"
                ? "Aşağı kaydır — sonraki bölüme git"
                : "Scroll down — go to next section"
            }
          >
            <ChevronDown className="hero-scroll-cta__icon" size={24} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>

      <div className="ultra-premium-hero__progress">
        <div className="ultra-premium-hero__progress-fill" />
      </div>
    </section>
  );
}

export default InteractiveShowroomHero;
