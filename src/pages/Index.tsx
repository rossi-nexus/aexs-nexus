import { lazy, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AUTH_BYPASS_ACTIVE } from "@/lib/devAuthBypass";
import LoginPage from "@/components/nexus/LoginPage";
import LandingPage from "@/pages/LandingPage";

// Route-level code splitting: each layout (and everything it imports) becomes
// its own chunk, so e.g. admin/consultant code never loads for regular users.
const AppLayout = lazy(() => import("@/components/nexus/AppLayout"));
const ConsultantLayout = lazy(() => import("@/pages/ConsultantLayout"));
const AdminLayout = lazy(() => import("@/pages/AdminLayout"));

const RouteFallback = () => (
  <div className="h-screen bg-background flex items-center justify-center">
    <div className="text-foreground-muted text-body-sm">Loading...</div>
  </div>
);

const Index = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted text-body-sm">Loading...</div>
      </div>
    );
  }

  const isAuthed = AUTH_BYPASS_ACTIVE || !!user;

  // Public routes
  if (!isAuthed) {
    if (location.pathname === "/login") return <LoginPage />;
    if (location.pathname === "/") return <LandingPage />;
    return <Navigate to="/" replace />;
  }

  // Authed: / and /login redirect to pipeline
  if (location.pathname === "/" || location.pathname === "/login") {
    return <Navigate to="/pipeline" replace />;
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/consultant/*" element={<ConsultantLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Suspense>
  );
};

export default Index;
