/**
 * Cinematic showroom hero — technical label → serif title → lead → supporting copy.
 * Nav labels (`navLabel*`) mirror the uppercase technical eyebrow above the title.
 * Images: showcase art is paused for this skin — `showcaseImageSrc` reserved for reinstatement later.
 */
export type ShowcaseHudDatum = {
  readonly labelTr: string;
  readonly labelEn: string;
  readonly valueTr: string;
  readonly valueEn: string;
};

export type CinematicShowcaseSlideDef = {
  readonly id: string;
  /** Route param for `/urunler/$slug` */
  readonly productSlug: string;
  readonly showcaseImageSrc: string;
  readonly showcaseImageAltTr: string;
  readonly showcaseImageAltEn: string;
  readonly imageObjectPosition: string;
  readonly titleTr: string;
  readonly titleEn: string;
  /** Ana serif satırı (örn. Yangın). */
  readonly headlinePrimaryTr: string;
  readonly headlinePrimaryEn: string;
  /** İtalik cyan ikinci satır (boş bırakılabilir). */
  readonly headlineAccentTr: string;
  readonly headlineAccentEn: string;
  /** Büyük arkada çıkan görsel anahtar sözcük (dekora). */
  readonly watermarkGlyphTr: string;
  readonly watermarkGlyphEn: string;
  /** Kısa editoryal ara başlık (mimari ton) */
  readonly subtitleTr: string;
  readonly subtitleEn: string;
  /** Destekleyici paragraf */
  readonly descriptionTr: string;
  readonly descriptionEn: string;
  readonly navLabelTr: string;
  readonly navLabelEn: string;
  /** Vitrin HUD — sahne için dekoratif referanslar (ölçüm değeri iddiası değildir). */
  readonly hudFrameIdTr: string;
  readonly hudFrameIdEn: string;
  readonly hudTelemetry: readonly ShowcaseHudDatum[];
};

export const CINEMATIC_SHOWCASE_HERO_SLIDES: readonly CinematicShowcaseSlideDef[] = [
  {
    id: "klima",
    productSlug: "p-ac-residential",
    showcaseImageSrc: "/img/hero-klima-showcase.png",
    showcaseImageAltTr:
      "Duvar tipi klima — sinematik karanlık gövde ve cyan cephe aydınlatması",
    showcaseImageAltEn:
      "Wall indoor AC — cinematic dark casing with cyan-accent lighting",
    imageObjectPosition: "52% 48%",
    titleTr: "Klima",
    titleEn: "Climate",
    headlinePrimaryTr: "Klima",
    headlinePrimaryEn: "Climate",
    headlineAccentTr: "çözümleri",
    headlineAccentEn: "engineering",
    watermarkGlyphTr: "KLIMA",
    watermarkGlyphEn: "CLIMATE",
    subtitleTr: "Konfor ve enerji verimini aynı iklim yüzeyinde kuruyoruz.",
    subtitleEn: "Comfort and efficiency composed on a single climate plane.",
    descriptionTr:
      "İç mimari ile uyumlu, düşük gürültülü inverter çözümlerden VRF omurgasına kadar seçimi doğruluyor, sahada ölçülebilir performans teslim ediyoruz.",
    descriptionEn:
      "From low-noise inverter solutions harmonised with interiors to validated VRF backbones—we engineer measurable performance in the field.",
    navLabelTr: "Klima",
    navLabelEn: "Climate",
    hudFrameIdTr: "PAC-R / IK-01",
    hudFrameIdEn: "PAC-R / ID-01",
    hudTelemetry: [
      {
        labelTr: "Ses baskısı",
        labelEn: "Sound pressure",
        valueTr: "≤ 41 dBA",
        valueEn: "≤ 41 dBA",
      },
      {
        labelTr: "Soğutma kapasitesi",
        labelEn: "Cooling capacity",
        valueTr: "3.8 kW",
        valueEn: "3.8 kW",
      },
      {
        labelTr: "Soğutucu çevrim",
        labelEn: "Refrigerant loop",
        valueTr: "R32",
        valueEn: "R32",
      },
    ],
  },
  {
    id: "fancoil",
    productSlug: "p-ac-daikin",
    showcaseImageSrc: "/img/hero-fancoil-showcase.png",
    showcaseImageAltTr:
      "Premium iç iklim ünitesi — cam kontrol yüzeyi ve cyan nümerik halo",
    showcaseImageAltEn:
      "Premium indoor climate unit — glass control fascia with cyan-lit dial",
    imageObjectPosition: "50% 52%",
    titleTr: "Fancoil",
    titleEn: "Fan Coil",
    headlinePrimaryTr: "Fancoil",
    headlinePrimaryEn: "Fan coil",
    headlineAccentTr: "üniteleri",
    headlineAccentEn: "units",
    watermarkGlyphTr: "FANCOİL",
    watermarkGlyphEn: "FAN COIL",
    subtitleTr: "Premium iç yüzelerde sessiz ve homojen havalandırma disiplini.",
    subtitleEn: "Quiet, even airflow discipline across premium indoor planes.",
    descriptionTr:
      "Kasetten kanallı sahnelere kadar seçilen ünite ailelerinde hava dağılımını ve akustiği tasarımdan devreye alma anına kadar tek çizgede koruyoruz.",
    descriptionEn:
      "From cassette to ducted ensembles we keep airflow and acoustics on one engineering trace—from design intent through commissioning.",
    navLabelTr: "Fancoil",
    navLabelEn: "Fan coil",
    hudFrameIdTr: "FCU-STUDIO / VG-ΔT",
    hudFrameIdEn: "FCU-STUDIO / VG-ΔT",
    hudTelemetry: [
      {
        labelTr: "Nominal akustik",
        labelEn: "Nominal acoustics",
        valueTr: "≤ 19 dBA",
        valueEn: "≤ 19 dBA",
      },
      {
        labelTr: "Hava debisi",
        labelEn: "Air transport",
        valueTr: "850 m³/h",
        valueEn: "850 m³/h",
      },
      {
        labelTr: "Kontrol hattı",
        labelEn: "Controls path",
        valueTr: "BACnet • MODBUS",
        valueEn: "BACnet • MODBUS",
      },
    ],
  },
  {
    id: "mekanik",
    productSlug: "p-pump-wilo",
    showcaseImageSrc: "/img/hero-mekanik-showcase.png",
    showcaseImageAltTr:
      "Mekanik malzeme seçkisi — valf, fitting ve bağlantı elemanları sinematik vitrin",
    showcaseImageAltEn:
      "Mechanical components showcase — valves, fittings and piping in cinematic layout",
    imageObjectPosition: "48% 45%",
    titleTr: "Mekanik Sistemler",
    titleEn: "Mechanical Systems",
    headlinePrimaryTr: "Mekanik",
    headlinePrimaryEn: "Mechanical",
    headlineAccentTr: "sistemleri",
    headlineAccentEn: "systems",
    watermarkGlyphTr: "MEKANİK",
    watermarkGlyphEn: "MECHANICAL",
    subtitleTr: "Hidrolik omurganın her bileşeninde teknik doğrulama ve sıkı seçim.",
    subtitleEn: "Validated selection across every joint of the hydronic backbone.",
    descriptionTr:
      "Pompadan eşanjöre, regülasyon elemandan yangın uyumlu hatlara kadar marka bağımsız teknik filtreden sahaya hazır paketlene kadar yanınızdayız.",
    descriptionEn:
      "From pumps and exchangers to regulation assets and code-aware routing—we partner from unbiased technical filtration to site-ready assemblies.",
    navLabelTr: "Mekanik Sistemler",
    navLabelEn: "Mechanical",
    hudFrameIdTr: "HYD-STUDIO / PKG-Ω",
    hudFrameIdEn: "HYD-STUDIO / PKG-Ω",
    hudTelemetry: [
      {
        labelTr: "Hat sınıfı",
        labelEn: "Circuit class",
        valueTr: "PN16 • DN25–80",
        valueEn: "PN16 • DN25–80",
      },
      {
        labelTr: "Basınç toleransı",
        labelEn: "ΔP envelope",
        valueTr: "2.8 bar",
        valueEn: "2.8 bar",
      },
      {
        labelTr: "Malzeme alaşım",
        labelEn: "Alloy trace",
        valueTr: "CW617N / SS316L",
        valueEn: "CW617N / SS316L",
      },
    ],
  },
  {
    id: "isi-pompasi",
    productSlug: "p-heatpump-daikin",
    showcaseImageSrc: "/img/hero-heatpump-showcase.png",
    showcaseImageAltTr:
      "Isı pompası dış ünite — mat metal gövde ve sinematik cyan rim ışık",
    showcaseImageAltEn:
      "Outdoor heat pump unit — matte metal shell with cinematic cyan rim glow",
    imageObjectPosition: "46% 50%",
    titleTr: "Isı Pompası",
    titleEn: "Heat Pump",
    headlinePrimaryTr: "Isı",
    headlinePrimaryEn: "Heat",
    headlineAccentTr: "pompası",
    headlineAccentEn: "pump",
    watermarkGlyphTr: "ISI·POMPA",
    watermarkGlyphEn: "HEAT PUMP",
    subtitleTr: "Yenilenebilir enerji omurgasında yüksek COP mimarisi.",
    subtitleEn: "High-COP architectures on renewable-ready backbones.",
    descriptionTr:
      "Hava-su ve kapasite eşlemesinden SCOP raporlarına kadar ünite seçiminde şeffaf mühendislik; devreye alma süreçlerinde ölçülebilir verim takibi.",
    descriptionEn:
      "Transparent engineering from air-water matching to seasonal performance narratives—with measurable commissioning discipline.",
    navLabelTr: "Isı Pompası",
    navLabelEn: "Heat pump",
    hudFrameIdTr: "HP-OUT / SCOP-TRACE",
    hudFrameIdEn: "HP-OUT / SCOP-TRACE",
    hudTelemetry: [
      {
        labelTr: "Sezon verimi",
        labelEn: "Seasonal COP",
        valueTr: "SCOP ~4.62",
        valueEn: "SCOP ~4.62",
      },
      {
        labelTr: "Taşıyıcı akış",
        labelEn: "Brine loop",
        valueTr: "−8°C → 55°C",
        valueEn: "−8°C → 55°C",
      },
      {
        labelTr: "Inverter aralığı",
        labelEn: "Inverter span",
        valueTr: "18–120 Hz",
        valueEn: "18–120 Hz",
      },
    ],
  },
  {
    id: "yangin",
    productSlug: "p-fire-tyco",
    showcaseImageSrc: "/img/hero-yangin-showcase.png",
    showcaseImageAltTr:
      "Yangın güvenliği — sprinkler, hidrant ve basınç göstergesi sinematik kompozisyon",
    showcaseImageAltEn:
      "Fire protection — sprinkler, hydrant piping and gauges in cinematic scene",
    imageObjectPosition: "50% 46%",
    titleTr: "Yangın Sistemleri",
    titleEn: "Fire Systems",
    headlinePrimaryTr: "Yangın",
    headlinePrimaryEn: "Fire",
    headlineAccentTr: "sistemleri",
    headlineAccentEn: "systems",
    watermarkGlyphTr: "YANGIN",
    watermarkGlyphEn: "FIRE",
    subtitleTr: "Kritik alanlar için yüksek güvenlikli söndürme mimarisi.",
    subtitleEn: "High-assurance suppression architecture for critical envelopes.",
    descriptionTr:
      "FM-200, sprinkler ve algılama altyapılarını tek mühendislik dili altında birleştiriyoruz.",
    descriptionEn:
      "FM-200, sprinkler, and detection stacks unified under one disciplined engineering voice.",
    navLabelTr: "Yangın Sistemleri",
    navLabelEn: "Fire systems",
    hudFrameIdTr: "SUPP-A / ZONE-Ω",
    hudFrameIdEn: "SUPP-A / ZONE-Ω",
    hudTelemetry: [
      {
        labelTr: "Test basıncı",
        labelEn: "Hydro test",
        valueTr: "12 bar",
        valueEn: "12 bar",
      },
      {
        labelTr: "Bulb tetik sıcaklığı",
        labelEn: "Bulb trigger",
        valueTr: "68°C sınıfı",
        valueEn: "68°C class",
      },
      {
        labelTr: "Algılama omurgası",
        labelEn: "Detection bus",
        valueTr: "Addressable",
        valueEn: "Addressable",
      },
      {
        labelTr: "Standart uyum",
        labelEn: "Code trace",
        valueTr: "TS EN 12845 · NFPA uyumlu",
        valueEn: "TS EN 12845 · NFPA aligned",
      },
    ],
  },
] as const;
