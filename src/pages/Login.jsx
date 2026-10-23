import { Seo } from "@/components/Seo";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/kit";
import { Logo } from "@/components/SiteHeader";
import { AuthShell } from "@/components/AuthShell";
import loginBg from "@/assets/login-bg.jpg";
import { IS_SAMPLE } from "@/lib/api";
import { homeFor, useAuth } from "@/lib/auth";
import { isEmail } from "@/lib/validation";

function LoginContent() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") ?? undefined;
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const v = {
      email: isEmail(email) ? undefined : "Enter a valid email.",
      pw: pw ? undefined : "Enter your password.",
    };
    setErr(v);
    if (v.email || v.pw) return;
    setBusy(true);
    try {
      const u = await login(email, pw);
      toast.success(`Welcome, ${u.name}`);
      const safe =
        redirect &&
        redirect.startsWith("/") &&
        !redirect.startsWith("//") &&
        !redirect.startsWith("/login");
      if (safe) navigate(redirect, { replace: true });
      else navigate(homeFor(u.role), { replace: true });
    } catch (ex) {
      setErr({ form: ex.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      image={loginBg}
      imageAlt="Monsoon night on a highway near Sangli: trucks with headlights on a wet road beside hazard markers"
      overlay="bg-gradient-to-br from-navy/85 via-navy/60 to-navy/90"
    >
      <div className="card-surface w-full max-w-md p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">Log in</h1>
        <p className="text-sm text-muted-foreground">
          One login for citizens, reviewers and admins. Your role is determined securely by the
          server.
        </p>
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          {err.form && (
            <p className="rounded-md bg-danger-soft p-3 text-sm text-danger">{err.form}</p>
          )}
          <Field label="Email" error={err.email}>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password" error={err.pw}>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute top-2 right-2 text-muted-foreground"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </Field>
          <div className="text-right">
            <button
              type="button"
              className="text-sm font-medium text-safe hover:underline"
              onClick={() =>
                toast.info("If an account exists for that email, a reset link will be sent.")
              }
            >
              Forgot password?
            </button>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <LogIn />}Login
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="font-semibold text-safe hover:underline">
            Create an account
          </Link>
        </p>
        {IS_SAMPLE && (
          <div className="mt-6 rounded-lg border border-caution/50 bg-caution-soft p-3 text-xs text-navy">
            <b>Demo accounts</b> (any password, 6+ chars):
            <br />
            user@demo.in · reviewer@demo.in · admin@demo.in
          </div>
        )}
      </div>
    </AuthShell>
  );
}

export default function Login() {
  return (
    <>
      <Seo
        title={"Login – RoadGuard"}
        description="Sign in to track your incident reports or access reviewer tools."
      />
      <LoginContent />
    </>
  );
}
