import { Seo } from "@/components/Seo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Container, Field, PageHeader, StatusBadge } from "@/components/kit";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { validatePassword } from "@/lib/validation";

function ProfileContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [pw, setPw] = useState({ cur: "", next: "", conf: "" });
  const [pwErr, setPwErr] = useState();
  const [prefs, setPrefs] = useState({ reportUpdates: true, redAlerts: true, weekly: false });

  const changePw = () => {
    const e = !pw.cur
      ? "Enter your current password."
      : (validatePassword(pw.next) ??
        (pw.next !== pw.conf ? "Passwords do not match." : undefined));
    setPwErr(e);
    if (!e) {
      toast.success("Password updated.");
      setPw({ cur: "", next: "", conf: "" });
    }
  };

  return (
    <Container className="max-w-3xl py-8">
      <PageHeader
        title="Profile & Settings"
        actions={
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut />
            Logout
          </Button>
        }
      />
      <div className="space-y-6">
        <section className="card-surface space-y-4 p-6">
          <h2 className="font-bold">Account</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email">
              <Input value={user?.email} disabled />
            </Field>
            <Field label="Role" hint="Roles are assigned by administrators.">
              <Input value={user?.role} readOnly disabled />
            </Field>
            <div>
              <span className="text-sm font-medium">Account status</span>
              <div className="mt-2">
                <StatusBadge status={user?.status ?? "ACTIVE"} />
              </div>
            </div>
          </div>
        </section>
        <section className="card-surface space-y-4 p-6">
          <h2 className="font-bold">Change password</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Current password">
              <Input
                type="password"
                value={pw.cur}
                onChange={(e) => setPw({ ...pw, cur: e.target.value })}
              />
            </Field>
            <Field label="New password">
              <Input
                type="password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
              />
            </Field>
            <Field label="Confirm new">
              <Input
                type="password"
                value={pw.conf}
                onChange={(e) => setPw({ ...pw, conf: e.target.value })}
              />
            </Field>
          </div>
          {pwErr && <p className="text-sm text-danger">{pwErr}</p>}
          <Button variant="outline" onClick={changePw}>
            Update password
          </Button>
        </section>
        <section className="card-surface space-y-3 p-6">
          <h2 className="font-bold">Notifications</h2>
          {[
            ["reportUpdates", "Email me when my report status changes"],
            ["redAlerts", "Red Alerts in my area (when supported)"],
            ["weekly", "Weekly road-safety summary"],
          ].map(([k, l]) => (
            <label
              key={k}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              {l}
              <Switch checked={prefs[k]} onCheckedChange={(v) => setPrefs({ ...prefs, [k]: v })} />
            </label>
          ))}
        </section>
        <Button variant="safe" size="lg" onClick={() => toast.success("Changes saved.")}>
          <Save />
          Save Changes
        </Button>
      </div>
    </Container>
  );
}

export default function Profile() {
  return (
    <>
      <Seo
        title={"Profile & Settings – RoadGuard"}
        description="Manage your RoadGuard profile, password and notification preferences."
      />
      <RequireAuth>
        <ProfileContent />
      </RequireAuth>
    </>
  );
}
