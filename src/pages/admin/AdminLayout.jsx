import { Seo } from "@/components/Seo";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  Database,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  Settings,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/SiteHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN"] },
  { to: "/admin/records", label: "Accident Records", icon: Database, roles: ["ADMIN", "REVIEWER"] },
  { to: "/admin/blackspots", label: "Black Spots", icon: MapPinned, roles: ["ADMIN", "REVIEWER"] },
  {
    to: "/admin/verification",
    label: "Incident Verification",
    icon: ClipboardCheck,
    roles: ["ADMIN", "REVIEWER"],
  },
  { to: "/admin/alerts", label: "Alerts Management", icon: Bell, roles: ["ADMIN", "REVIEWER"] },
  { to: "/analysis", label: "Risk Analysis", icon: BarChart3, roles: ["ADMIN", "REVIEWER"] },
  { to: "/admin/users", label: "Users & Roles", icon: Users, roles: ["ADMIN"] },
  { to: "/admin/import", label: "Data Import", icon: Upload, roles: ["ADMIN"] },
  { to: "/profile", label: "Settings", icon: Settings, roles: ["ADMIN", "REVIEWER"] },
];

function AdminLayoutContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = ITEMS.filter((i) => user && i.roles.includes(user.role));

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          end={i.to === "/admin"}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive &&
                "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
            )
          }
        >
          <i.icon className="size-4" />
          {i.label}
        </NavLink>
      ))}
      <button
        onClick={() => {
          logout();
          navigate("/login", { replace: true });
        }}
        className="mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent"
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar lg:flex">
        <Link to="/" className="border-b border-sidebar-border p-4">
          <Logo light />
        </Link>
        {nav}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <aside className="flex w-64 flex-col bg-sidebar">
            <div className="flex items-center justify-between border-b border-sidebar-border p-4">
              <Logo light />
              <button
                onClick={() => setOpen(false)}
                className="text-sidebar-foreground"
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>
            {nav}
          </aside>
          <div className="flex-1 bg-navy/50" onClick={() => setOpen(false)} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </Button>
            <span className="text-sm font-semibold text-muted-foreground">
              {user?.role === "ADMIN" ? "Administrator" : "Police Reviewer"} Console
            </span>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <>
      <Seo
        title={"Admin & Police Dashboard – RoadGuard"}
        description="Protected tools for reviewers and administrators."
        noindex
      />
      <RequireAuth roles={["ADMIN", "REVIEWER"]}>
        <AdminLayoutContent />
      </RequireAuth>
    </>
  );
}
