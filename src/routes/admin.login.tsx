import { createFileRoute } from "@tanstack/react-router";

import { CinematicAdminLogin } from "@/components/admin/CinematicAdminLogin";

export const Route = createFileRoute("/admin/login")({
  component: LoginRoutePage,
});

function LoginRoutePage() {
  return <CinematicAdminLogin />;
}
