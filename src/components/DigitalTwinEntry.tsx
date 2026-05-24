import { lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useMagneticButton } from "@/hooks/useMagneticButton";

const Mini3DPreview = lazy(() => import("@/components/Mini3DPreview"));

const DigitalTwinEntry = () => {
  const magneticRef = useMagneticButton(0.3);
  const navigate = useNavigate();

  const handleCTAClick = () => {
    void navigate({ to: "/dijital-ikiz" });
  };

  return (
    <section
      className="digital-twin-entry"
      aria-label="Dijital İkiz Deneyimi"
      data-reveal
    >
      <div className="twin-preview" aria-hidden="true">
        <Suspense fallback={null}>
          <Mini3DPreview kind="heatpump" spinning />
        </Suspense>
      </div>

      <div className="twin-text">
        <span className="twin-label">● CANLI · DİJİTAL İKİZ</span>
        <h2 className="twin-headline">
          Binanızın İçini
          <br />
          3D Keşfedin
        </h2>
        <p className="twin-body">
          Isı pompasından yangın sistemine, zemin ısıtmadan klimaya — tüm
          mekanik sistemleri interaktif 3D modelde görün.
        </p>
        <button
          ref={magneticRef}
          className="twin-cta btn-send"
          onClick={handleCTAClick}
          aria-label="Dijital İkiz Deneyimini Başlat"
        >
          <span>Dijital İkiz Deneyimini Başlat</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default DigitalTwinEntry;
