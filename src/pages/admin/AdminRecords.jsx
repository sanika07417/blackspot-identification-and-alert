import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ErrorState,
  Field,
  Loading,
  PageHeader,
  SampleNotice,
  selectCls,
  fmt,
} from "@/components/kit";
import { CsvImporter } from "@/components/CsvImporter";
import { useApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AREAS } from "@/lib/sample-data";

const PAGE = 10;

function AdminRecordsContent() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useApi("/api/accidents");
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [sev, setSev] = useState("");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(null);
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const rows = useMemo(
    () =>
      (data ?? []).filter(
        (r) =>
          (!q || `${r.id} ${r.location}`.toLowerCase().includes(q.toLowerCase())) &&
          (!area || r.area === area) &&
          (!sev || r.severity === sev),
      ),
    [data, q, area, sev],
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const shown = rows.slice((page - 1) * PAGE, page * PAGE);

  return (
    <>
      <PageHeader
        title="Accident Records"
        description="Historical dataset (starting from the project accident CSV)."
        actions={
          <>
            <Button variant="safe" onClick={() => setEdit({})}>
              <Plus />
              Add record
            </Button>
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload />
              Import CSV
            </Button>
          </>
        }
      />
      <SampleNotice className="mb-4" />
      <div className="card-surface mb-4 grid gap-3 p-4 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search ID or location…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className={selectCls}
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            setPage(1);
          }}
          aria-label="Area"
        >
          <option value="">All areas</option>
          {AREAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <select
          className={selectCls}
          value={sev}
          onChange={(e) => {
            setSev(e.target.value);
            setPage(1);
          }}
          aria-label="Severity"
        >
          <option value="">All severities</option>
          {["Fatal", "Grievous", "Minor", "Damage only"].map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>
      <div className="card-surface overflow-x-auto">
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <div className="p-4">
            <ErrorState />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                {[
                  "ID",
                  "Date/time",
                  "Location",
                  "Lat",
                  "Lng",
                  "Inj.",
                  "Fatal",
                  "Severity",
                  "Weather",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmt(r.datetime)}</td>
                  <td className="px-3 py-2">{r.location}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.lat}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.lng}</td>
                  <td className="px-3 py-2">{r.injuries}</td>
                  <td className="px-3 py-2">{r.fatalities}</td>
                  <td className="px-3 py-2">{r.severity}</td>
                  <td className="px-3 py-2">{r.weather}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="View"
                        onClick={() => setView(r)}
                      >
                        <Eye />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Edit"
                        onClick={() => setEdit(r)}
                      >
                        <Pencil />
                      </Button>
                      {user?.role === "ADMIN" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Delete"
                          onClick={() => setDel(r.id)}
                        >
                          <Trash2 className="text-danger" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex items-center justify-between border-t p-3 text-sm">
          <span className="text-muted-foreground">
            {rows.length} records · page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{edit?.id ? `Edit ${edit.id}` : "Add accident record"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date & time">
              <Input type="datetime-local" defaultValue={edit?.datetime} />
            </Field>
            <Field label="Area">
              <select className={selectCls} defaultValue={edit?.area}>
                {AREAS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
            <div className="col-span-2">
              <Field label="Location">
                <Input defaultValue={edit?.location} />
              </Field>
            </div>
            <Field label="Latitude">
              <Input defaultValue={edit?.lat} />
            </Field>
            <Field label="Longitude">
              <Input defaultValue={edit?.lng} />
            </Field>
            <Field label="Injuries">
              <Input type="number" min={0} defaultValue={edit?.injuries} />
            </Field>
            <Field label="Fatalities">
              <Input type="number" min={0} defaultValue={edit?.fatalities} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Record saved (POST /api/accidents).");
                setEdit(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{view?.id}</DialogTitle>
          </DialogHeader>
          {view && (
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(view).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd>{String(v)}</dd>
                </div>
              ))}
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Import accident CSV</DialogTitle>
          </DialogHeader>
          <CsvImporter />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {del}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the record and will affect hotspot analysis. Admin only.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => toast.success(`${del} deleted.`)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function AdminRecords() {
  return (
    <>
      <AdminRecordsContent />
    </>
  );
}
