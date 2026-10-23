import { lazy, Suspense, useEffect, useState } from "react";
import { MapPin } from "lucide-react";

const MapView = lazy(() => import("./MapView"));

function Fallback() {
  return (
    <div className="grid h-full w-full place-items-center bg-muted text-muted-foreground">
      <MapPin className="size-6 animate-pulse" />
    </div>
  );
}

export function LazyMap(props) {
  // Leaflet needs the browser, so only mount it after the first client render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Fallback />;
  return (
    <Suspense fallback={<Fallback />}>
      <MapView {...props} />
    </Suspense>
  );
}
