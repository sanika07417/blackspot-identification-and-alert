import { Seo } from "@/components/Seo";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/kit";
import { Logo } from "@/components/SiteHeader";
import { AuthShell } from "@/components/AuthShell";
import registerBg from "@/assets/register-bg.jpg";
import { apiSend, IS_SAMPLE } from "@/lib/api";
import { USERS } from "@/lib/sample-data";
import { isEmail, passwordStrength, validatePassword } from "@/lib/validation";

function RegisterContent() {
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", pw: "", pw2: "", terms: false });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const st = passwordStrength(f.pw);

  async function submit(e) {
    e.preventDefault();
    const v = {
      name: f.name.trim().length >= 2 ? undefined : "Enter your full name.",
      email: isEmail(f.email) ? undefined : "Enter a valid email.",
      pw: validatePassword(f.pw),
      pw2: f.pw === f.pw2 ? undefined : "Passwords do not match.",
      terms: f.terms ? undefined : "Please accept the privacy policy and terms.",
    };
    setErr(v);
    if (Object.values(v).some(Boolean)) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 500));
    if (IS_SAMPLE && USERS.some((u) => u.email.toLowerCase() === f.email.toLowerCase())) {
      setBusy(false);
      setErr({ email: "An account with this email already exists." });
      return;
    }
    // Role is always PUBLIC — assigned by the server, never chosen here.
    await apiSend("/api/auth/register", "POST", { name: f.name, email: f.email, password: f.pw });
    setBusy(false);
    toast.success("Account created. Please verify your email, then log in.");
    navigate("/login");
  }

  return (
    <AuthShell
      image={registerBg}
      imageAlt="Sunrise over green farmland beside a two-lane highway near Jaysingpur"
      overlay="bg-gradient-to-br from-navy/88 via-navy/72 to-navy/92"
    >
      <div className="card-surface w-full max-w-md p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          For citizens. Police and admin accounts are issued by administrators.
        </p>
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <Field label="Full name" error={err.name}>
            <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </Field>
          <Field label="Email" error={err.email}>
            <Input
              type="email"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
            />
          </Field>
          <Field label="Password" error={err.pw}>
            <Input
              type="password"
              value={f.pw}
              onChange={(e) => setF({ ...f, pw: e.target.value })}
            />
            {f.pw && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i < st.score ? (st.score >= 3 ? "bg-safe" : "bg-caution") : "bg-muted"}`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {st.label} — use 8+ characters with letters, numbers and a symbol.
                </p>
              </div>
            )}
          </Field>
          <Field label="Confirm password" error={err.pw2}>
            <Input
              type="password"
              value={f.pw2}
              onChange={(e) => setF({ ...f, pw2: e.target.value })}
            />
          </Field>
          <div>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox
                checked={f.terms}
                onCheckedChange={(c) => setF({ ...f, terms: c === true })}
                className="mt-0.5"
              />
              I agree to the{" "}
              <Link to="/about" className="text-safe underline">
                privacy policy and terms
              </Link>
              .
            </label>
            {err.terms && <p className="mt-1 text-xs font-medium text-danger">{err.terms}</p>}
          </div>
          <Button type="submit" variant="safe" size="lg" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <UserPlus />}Register
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-safe hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function Register() {
  return (
    <>
      <Seo
        title={"Create an Account – RoadGuard"}
        description="Register as a citizen to report incidents and track their verification status."
      />
      <RegisterContent />
    </>
  );
}
