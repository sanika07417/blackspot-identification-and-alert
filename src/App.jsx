import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { Seo } from "@/components/Seo";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import Home from "@/pages/Home";
import MapPage from "@/pages/MapPage";
import Analysis from "@/pages/Analysis";
import AlertsList from "@/pages/AlertsList";
import AlertDetail from "@/pages/AlertDetail";
import BlackspotDetail from "@/pages/BlackspotDetail";
import Report from "@/pages/Report";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminHome from "@/pages/admin/AdminHome";
import AdminRecords from "@/pages/admin/AdminRecords";
import AdminBlackspots from "@/pages/admin/AdminBlackspots";
import AdminVerification from "@/pages/admin/AdminVerification";
import AdminAlerts from "@/pages/admin/AdminAlerts";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminImport from "@/pages/admin/AdminImport";

const queryClient = new QueryClient();

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Seo title="Page not found – RoadGuard" />
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This road doesn't lead anywhere.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Public site shell: header + footer around every non-admin page. */
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

/** Scroll back to the top whenever the page changes. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="map" element={<MapPage />} />
              <Route path="analysis" element={<Analysis />} />
              <Route path="alerts" element={<AlertsList />} />
              <Route path="alerts/:id" element={<AlertDetail />} />
              <Route path="blackspots/:id" element={<BlackspotDetail />} />
              <Route path="report" element={<Report />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="records" element={<AdminRecords />} />
              <Route path="blackspots" element={<AdminBlackspots />} />
              <Route path="verification" element={<AdminVerification />} />
              <Route path="alerts" element={<AdminAlerts />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="import" element={<AdminImport />} />
            </Route>
          </Routes>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
