import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";

import { Loading } from "./kit";
import { Button } from "./ui/button";

/** UX-only gate. Real authorization is enforced by Spring Security on every API call. */
export function RequireAuth({ roles, children }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  useEffect(() => {
    if (!ready || user) return;
    // Already on the sign-in page: redirecting again would stack ?redirect params inside each other.
    if (loc.pathname === "/login" || loc.pathname.startsWith("/login/")) return;
    const href = loc.pathname + loc.search + loc.hash;
    const target = href.startsWith("/login") ? "/" : href;
    navigate(`/login?redirect=${encodeURIComponent(target)}`, { replace: true });
  }, [ready, user, loc.pathname, loc.search, loc.hash, navigate]);
  if (!ready || !user) return <Loading label="Checking your session…" />;
  if (roles && !roles.includes(user.role))
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-20 text-center">
        <Lock className="size-10 text-danger" />
        <h2 className="text-xl font-bold">Not authorized</h2>
        <p className="text-muted-foreground">
          Your account role ({user.role}) does not have access to this area.
        </p>
        <Button asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    );
  return <>{children}</>;
}
