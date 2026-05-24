import { motion, useReducedMotion } from "framer-motion";

import { ABOUT_MANIFESTO_IMAGES } from "@/constants/aboutManifesto";
import { useSyncedManifestoCopy } from "@/hooks/useSyncedSiteCms";
import { useLanguage } from "@/i18n/LanguageContext";

const COL_REVEAL = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
} as const;

const ITEM_REVEAL = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

/**
 * Cinematic three-column About / Mission / Vision — Apple-keynote engineering mood.
 */
export function PremiumAboutManifestoSection() {
  const { lang, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const isTr = lang === "tr";

  const copy = useSyncedManifestoCopy(isTr);

  return (
    <section
      id="hakkimizda"
      className="premium-about-manifesto midnight-section midnight-section--about"
      aria-labelledby="pam-heading"
    >
      <div className="premium-about-manifesto__wash" aria-hidden />
      <div className="premium-about-manifesto__glow premium-about-manifesto__glow--a" aria-hidden />
      <div className="premium-about-manifesto__glow premium-about-manifesto__glow--b" aria-hidden />
      <div className="premium-about-manifesto__grid-lines" aria-hidden />
      <div className="premium-about-manifesto__vignette" aria-hidden />

      <div className="premium-about-manifesto__inner">
        <motion.header
          className="premium-about-manifesto__hero"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-60px", amount: 0.25 }}
          variants={COL_REVEAL}
        >
          <div className="premium-about-manifesto__hero-layout">
            <div className="premium-about-manifesto__hero-copy">
              <div className="premium-about-manifesto__title-stage">
                <h2 id="pam-heading" className="premium-about-manifesto__screen-title">
                  <span className="premium-about-manifesto__sr-only">
                    {isTr ? "Hakkımızda" : "About us"}
                  </span>
                  {/* Decorative mega wordmark — typography only; figure sits in adjacent column */}
                  <span className="premium-about-manifesto__mega" aria-hidden>
                    <span className="premium-about-manifesto__h-cluster">
                      <span className="premium-about-manifesto__mega-h">H</span>
                    </span>
                    <span className="premium-about-manifesto__mega-a">A</span>
                    <span className="premium-about-manifesto__mega-rest">KKIMIZDA</span>
                  </span>
                </h2>
              </div>
              <p className="premium-about-manifesto__hero-subtitle">{t("about.manifesto.heroSubtitle")}</p>
            </div>
            <div className="premium-about-manifesto__hero-visual" aria-hidden>
              <img
                src={ABOUT_MANIFESTO_IMAGES.technician}
                alt=""
                width={360}
                height={440}
                decoding="async"
                loading="eager"
                className="premium-about-manifesto__hero-figure-img"
              />
            </div>
          </div>
        </motion.header>

        <motion.div
          className="premium-about-manifesto__columns"
          variants={COL_REVEAL}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-40px", amount: 0.15 }}
        >
          <motion.article
            className="premium-about-manifesto__card premium-about-manifesto__card--about"
            variants={ITEM_REVEAL}
          >
            <div className="premium-about-manifesto__about-head">
              <h3 className="premium-about-manifesto__card-kicker premium-about-manifesto__card-kicker--about">
                {copy.aboutTitle}
              </h3>
              <div className="premium-about-manifesto__about-thumb" aria-hidden>
                <img
                  src={ABOUT_MANIFESTO_IMAGES.teamTrio}
                  alt=""
                  width={88}
                  height={56}
                  decoding="async"
                  loading="lazy"
                  className="premium-about-manifesto__about-thumb-img"
                />
              </div>
            </div>
            <p className="premium-about-manifesto__lead">{copy.aboutLead}</p>
            <p className="premium-about-manifesto__body">{copy.aboutBody}</p>
          </motion.article>

          <motion.article
            className="premium-about-manifesto__card premium-about-manifesto__card--mission"
            variants={ITEM_REVEAL}
          >
            <h3 className="premium-about-manifesto__card-kicker">{copy.missionTitle}</h3>
            <p className="premium-about-manifesto__lead">{copy.missionLead}</p>
            <p className="premium-about-manifesto__body premium-about-manifesto__body--accent">
              {copy.missionClose}
            </p>
            <div className="premium-about-manifesto__truck-wrap" aria-hidden>
              <div
                className={`premium-about-manifesto__truck-float${reduceMotion ? " premium-about-manifesto__truck-float--static" : ""}`}
              >
                <img
                  src={ABOUT_MANIFESTO_IMAGES.truck}
                  alt=""
                  width={420}
                  height={260}
                  decoding="async"
                  loading="lazy"
                  className="premium-about-manifesto__truck-img"
                />
              </div>
            </div>
          </motion.article>

          <motion.article
            className="premium-about-manifesto__card premium-about-manifesto__card--vision"
            variants={ITEM_REVEAL}
          >
            <div className="premium-about-manifesto__vision-glow-shell" aria-hidden />
            <div className="premium-about-manifesto__vision-head">
              <h3 className="premium-about-manifesto__card-kicker premium-about-manifesto__card-kicker--vision">
                {copy.visionTitle}
              </h3>
              <div className="premium-about-manifesto__vision-thumb" aria-hidden>
                <img
                  src={ABOUT_MANIFESTO_IMAGES.visionEngineer}
                  alt=""
                  width={96}
                  height={72}
                  decoding="async"
                  loading="lazy"
                  className="premium-about-manifesto__vision-thumb-img"
                />
              </div>
            </div>
            <p className="premium-about-manifesto__lead premium-about-manifesto__lead--tight">{copy.visionLead}</p>
            <p className="premium-about-manifesto__vision-tag">{copy.visionTag}</p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
