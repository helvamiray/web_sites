import { createFileRoute } from "@tanstack/react-router";
import { VegaCatalogFooter } from "@/components/catalog/VegaCatalogFooter";
import { VegaCatalogHeader } from "@/components/catalog/VegaCatalogHeader";
import { DigitalTwinConfiguratorPage } from "@/components/DigitalTwinConfiguratorPage";

export const Route = createFileRoute("/dijital-ikiz")({
  component: DijitalIkizPage,
});

function DijitalIkizPage() {
  return (
    <div className="landing-page min-h-screen overflow-x-hidden text-foreground">
      <VegaCatalogHeader />

      <main className="midnight-section midnight-section--products min-h-0 px-4 py-8 md:px-6 lg:py-14">
        <div className="container">
          <DigitalTwinConfiguratorPage />
        </div>
      </main>

      <VegaCatalogFooter />
    </div>
  );
}
