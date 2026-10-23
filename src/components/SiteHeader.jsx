import { Link, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LogOut, Menu, ShieldCheck, User as UserIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { homeFor, useAuth } from "@/lib/auth";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/map", label: "Black Spots Map" },
  { to: "/analysis", label: "Risk Analysis" },
  { to: "/alerts", label: "Alerts & Incidents" },
  { to: "/report", label: "Report Incident" },
  { to: "/about", label: "About" },
];

export function Logo({ light = false }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-lg bg-safe text-accent-foreground">
        <ShieldCheck className="size-5" />
      </span>
      <span className="leading-tight">
        <span
          className={`block font-display text-lg font-extrabold ${light ? "text-navy-foreground" : "text-navy"}`}
        >
          RoadGuard
        </span>
        <span
          className={`block text-[10px] font-semibold uppercase tracking-widest ${light ? "text-navy-foreground/70" : "text-muted-foreground"}`}
        >
          Black Spot Alerts
        </span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const linkCls =
    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground";
  const navCls = ({ isActive }) => cn(linkCls, isActive && "bg-secondary text-foreground");

  const doLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"} className={navCls}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <UserIcon />
                  {user.name.split(" ")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  {user.email}
                  <span className="block text-xs font-normal text-muted-foreground">
                    Role: {user.role}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(homeFor(user.role))}>
                  My dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile & settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={doLogout}>
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="safe" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="border-t bg-card px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setOpen(false)}
                className={navCls}
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 border-t pt-3">
              {user ? (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to={homeFor(user.role)} onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setOpen(false);
                      doLogout();
                    }}
                  >
                    <LogOut />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button variant="safe" className="flex-1" asChild>
                    <Link to="/register" onClick={() => setOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-navy text-navy-foreground">
      <div className="road-stripe" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="space-y-3">
          <Logo light />
          <p className="text-sm text-navy-foreground/70">
            Black Spot Identification and Alert System — an SIH project (SIH26001) for Jaysingpur,
            Sangli, Miraj, Ichalkaranji, Kurundwad and nearby areas.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Explore</h4>
          <ul className="space-y-2 text-sm text-navy-foreground/70">
            {NAV.slice(1).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-navy-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Data sources</h4>
          <ul className="space-y-2 text-sm text-navy-foreground/70">
            <li>Historical accident CSV dataset (project)</li>
            <li>Verified citizen & police reports</li>
            <li>Map tiles © OpenStreetMap contributors</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Contact & privacy</h4>
          <ul className="space-y-2 text-sm text-navy-foreground/70">
            <li>
              <Link to="/about" className="hover:text-navy-foreground">
                Help, feedback & contact
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-navy-foreground">
                Privacy policy
              </Link>
            </li>
            <li>
              In an emergency call <b className="text-navy-foreground">112</b>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-navy-foreground/60 md:px-6">
          Safety disclaimer: RoadGuard provides advisory information only. Risk levels are estimates
          from historical data and are not official black-spot designations. Always follow traffic
          laws and on-ground instructions.
        </p>
      </div>
    </footer>
  );
}
