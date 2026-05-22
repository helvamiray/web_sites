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
  const { lang } = useLanguage();
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
          <div className="premium-about-manifesto__title-stage">
            <h2 id="pam-heading" className="premium-about-manifesto__screen-title">
              <span className="premium-about-manifesto__sr-only">
                {isTr ? "Hakkımızda" : "About us"}
              </span>
              {/* H + figür: sütun genişliği yalnızca H — A’ya yapışık okunur */}
              <span className="premium-about-manifesto__mega" aria-hidden>
                <span className="premium-about-manifesto__h-cluster">
                  <span className="premium-about-manifesto__mega-h">H</span>
                  <div className="premium-about-manifesto__tech-figure">
                    <img
                      src={ABOUT_MANIFESTO_IMAGES.technician}
                      alt=""
                      width={240}
                      height={432}
                      decoding="async"
                      className="premium-about-manifesto__tech-img"
                    />
                  </div>
                </span>
                <span className="premium-about-manifesto__mega-a">A</span>
                <span className="premium-about-manifesto__mega-rest">KKIMIZDA</span>
              </span>
            </h2>
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
              <motion.div
                className="premium-about-manifesto__truck-float"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        x: [0, 5, -3, 0],
                        opacity: [0.88, 1, 0.92, 0.88],
                      }
                }
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={ABOUT_MANIFESTO_IMAGES.truck}
                  alt=""
                  width={420}
                  height={260}
                  decoding="async"
                  className="premium-about-manifesto__truck-img"
                />
              </motion.div>
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
