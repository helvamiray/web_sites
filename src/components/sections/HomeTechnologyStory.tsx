const STORY_SCENES = [
  {
    id: "mechanical",
    categoryLabel: "Mekanik sistemler",
    displayTitle: "MEKANİK",
    lines: ["Sessiz akış.", "Yüksek verim."],
    imageSrc: "/img/story-cinematic-mechanical.png",
    imageAlt: "Mekanik elemanların sinematik vitrin sahnesi",
    reverseLayout: false,
  },
  {
    id: "heatpump",
    categoryLabel: "Isı pompası sistemleri",
    displayTitle: "ISI POMPASI",
    lines: ["Yeni nesil iklim mimarisi."],
    imageSrc: "/img/story-cinematic-heatpump.png",
    imageAlt: "Yeni nesil ısı pompası mühendislik vitrini",
    reverseLayout: true,
  },
  {
    id: "fancoil",
    categoryLabel: "Fan coil sistemleri",
    displayTitle: "FANCOİL",
    lines: ["Gizli tavan yüzeyi.", "Konfor mikrofonu."],
    imageSrc: "/img/story-cinematic-fancoil.png",
    imageAlt: "Fancoil ünite sinematik atmosferde",
    reverseLayout: false,
  },
] as const;

/**
 * Horizontal storytelling track — native overflow scroll (no pin / no scroll-scrub tweening).
 */
export function HomeTechnologyStory() {
  return (
    <section
      id="teknoloji"
      className="hp-tech-story hp-tech-story--film"
      aria-label="Mühendislik anahtarı — sinematik ürün akışı"
    >
      <div className="hp-tech-story__ambient hp-tech-story__ambient--film" aria-hidden />
      <div className="hp-tech-story__glow hp-tech-story__glow--a" aria-hidden />
      <div className="hp-tech-story__glow hp-tech-story__glow--b" aria-hidden />
      <div className="hp-tech-story__glow hp-tech-story__glow--c" aria-hidden />

      <div className="hp-tech-story__viewport">
        <div className="hp-tech-story__track hp-tech-story__track--film">
          {STORY_SCENES.map((scene, index) => (
            <article
              key={scene.id}
              className={`hp-tech-story__scene${scene.reverseLayout ? " hp-tech-story__scene--reverse" : ""}`}
              aria-label={`Sahne ${index + 1} — ${scene.categoryLabel}`}
            >
              <div className="hp-tech-story__scene-inner">
                <div className="hp-tech-story__scene-copy">
                  <span className="hp-tech-story__scene-label">{scene.categoryLabel}</span>
                  <h2 className="hp-tech-story__scene-title">{scene.displayTitle}</h2>
                  <div className="hp-tech-story__scene-lines">
                    {scene.lines.map((line) => (
                      <p key={line} className="hp-tech-story__scene-line">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="hp-tech-story__scene-visual-wrap">
                  <div className="hp-tech-story__scene-halo" aria-hidden />
                  <div className="hp-tech-story__scene-haze" aria-hidden />
                  <img
                    src={scene.imageSrc}
                    alt={scene.imageAlt}
                    width={1440}
                    height={980}
                    decoding="async"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "low"}
                    className="hp-tech-story__scene-img"
                    draggable={false}
                  />
                  <div className="hp-tech-story__scene-vignette" aria-hidden />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="hp-tech-story__film-hint">
        <span className="hp-tech-story__film-hint-track" aria-hidden />
        Kaydır · sekans
      </p>
    </section>
  );
}
