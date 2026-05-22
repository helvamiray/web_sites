import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { PremiumAdminChrome } from "@/components/admin/PremiumAdminChrome";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";

export const Route = createFileRoute("/admin")({
  component: AdminParent,
});

function AdminParent() {
  return (
    <AdminAuthProvider>
      <AdminProtectedShell />
    </AdminAuthProvider>
  );
}

function AdminProtectedShell() {
  const pathnameRaw = useRouterState({ select: (s) => s.location.pathname });
  const pathname = pathnameRaw.replace(/\/$/, "") || "/";
  const isLogin = pathname === "/admin/login";
  const { isAuthed } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin || isAuthed) return;
    void navigate({ to: "/admin/login", replace: true });
  }, [isLogin, isAuthed, navigate]);

  if (isLogin) {
    return <Outlet />;
  }

  if (!isAuthed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/55 text-sm tracking-wide">
        Oturum doğrulanıyor…
      </div>
    );
  }

  return <PremiumAdminChrome />;
}
