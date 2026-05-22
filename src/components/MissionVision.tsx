/**
 * MissionVision — Engineering manifesto: editorial typography + holographic centerpiece.
 */
import { motion } from "framer-motion";

import { AboutEngineeringStudioVisual } from "@/components/AboutEngineeringStudioVisual";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { IconMission, IconVision } from "@/components/MissionVisionDecor";

const COLUMN_REVEAL = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.06,
    },
  },
};

const LINE_REVEAL = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
  },
};

const MissionVision = () => (
  <section
    id="hakkimizda"
    className="about-section lux-about lux-about--manifesto lux-about--engineering-studio midnight-section midnight-section--about"
    aria-labelledby="lux-about-heading"
  >
    <div className="lux-about__particles" aria-hidden />
    <div className="lux-about__light-sweep" aria-hidden />
    <div className="lux-about__ambient" aria-hidden />
    <div className="lux-about__glow-orb" aria-hidden />
    <div className="lux-about__inner">
      <div className="lux-about__layout">
        <motion.div
          className="lux-about__manifesto-col"
          variants={COLUMN_REVEAL}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px", amount: 0.2 }}
        >
          <motion.p className="lux-about__eyebrow" variants={LINE_REVEAL}>
            Mühendislik felsefesi · Studio VEGA
          </motion.p>

          <motion.h2 id="lux-about-heading" className="lux-about__title lux-about__title--mega" variants={LINE_REVEAL}>
            İklim,
            <span className="lux-about__title-accent">bir sistem mimarisidir.</span>
          </motion.h2>

          <motion.div className="lux-about__manifesto-stack" variants={LINE_REVEAL}>
            <p className="lux-about__manifesto-line">
              Tek çatı altında seçilmiş HVAC vitrininden fazlası: enerji yoğunluğu, sessiz çalışma ve otomasyon
              katmanları birlikte düşünülür.
            </p>
            <p className="lux-about__manifesto-line lux-about__manifesto-line--italic">
              Görsel vitrin değil — parametrik iklim mühendisliği ve uzun ömürlü sahne tasarımı.
            </p>
          </motion.div>

          <motion.div className="lux-about-stats" variants={LINE_REVEAL}>
            <div className="lux-about-stat">
              <span className="lux-about-stat__num">
                <AnimatedCounter end={1000} suffix="+" duration={2.35} className="lux-about-stat__counter" />
              </span>
              <span className="lux-about-stat__label">vizyon projesi bandı</span>
            </div>
            <div className="lux-about-stat">
              <span className="lux-about-stat__num">
                <AnimatedCounter end={40} suffix="+" duration={1.85} className="lux-about-stat__counter" />
              </span>
              <span className="lux-about-stat__label">premium üretici ortaklığı</span>
            </div>
            <div className="lux-about-stat lux-about-stat--static">
              <span className="lux-about-stat__num lux-about-stat__num--mono">2030</span>
              <span className="lux-about-stat__label">karbon-disiplinli hedef ekseni</span>
            </div>
          </motion.div>

          <motion.div className="lux-about__cards lux-about__cards--manifesto" variants={LINE_REVEAL}>
            <motion.article
              className="lux-about-card lux-about-card--mission"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="lux-about-card__head">
                <div className="lux-about-card__icon-wrap">
                  <IconMission />
                </div>
                <h3 className="lux-about-card__label">Misyonumuz</h3>
              </div>
              <p className="lux-about-card__body">
                Konut ve sanayiden hastanelere kadar her ölçekteki yapıyı en verimli ısıtma ve soğutma çözümleriyle
                donatmak; müşteri memnuniyeti, enerji verimliliği ve uzun ömürlü mühendislik kalitesini her projede
                merkeze almak.
              </p>
            </motion.article>

            <motion.article
              className="lux-about-card lux-about-card--vision"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="lux-about-card__head">
                <div className="lux-about-card__icon-wrap">
                  <IconVision />
                </div>
                <h3 className="lux-about-card__label">Vizyonumuz</h3>
              </div>
              <p className="lux-about-card__body">
                2030’a kadar Türkiye’nin en güvenilir bölgesel iklim mühendisliği markası olmak; ısı pompası ve düşük
                karbonlu çözümlerde referans konuma ulaşmak ve 1.000 tamamlanan proje sınırını aşmak.
              </p>
            </motion.article>
          </motion.div>
        </motion.div>

        <motion.div
          className="lux-about-visual lux-about-visual--manifesto lux-about-visual--engineering-studio"
          initial={{ opacity: 0, x: 28, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px", amount: 0.2 }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <AboutEngineeringStudioVisual />
        </motion.div>
      </div>
    </div>
  </section>
);

export default MissionVision;
