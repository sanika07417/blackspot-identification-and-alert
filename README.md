# RoadGuard – React (JavaScript) + Vite + Tailwind CSS

Black Spot Identification and Alert System. Plain **React 19 + JavaScript (.jsx)**, **Vite**,
**Tailwind CSS v4**, **React Router**, Leaflet/OpenStreetMap and Recharts. No TypeScript.

## Run locally

Requires Node.js 20.19+ (or 22+).

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build
npm test           # vitest
```

Demo accounts (any password of 6+ characters): `user@demo.in`, `reviewer@demo.in`, `admin@demo.in`.
Set `VITE_API_BASE_URL` (see `.env.example`) to use a real backend instead of the sample data.

## Structure

- `index.html`, `src/main.jsx`, `src/App.jsx` – entry point and all routes
- `src/pages/` – one file per page; `src/pages/admin/` – admin/reviewer screens
- `src/components/` – shared components; `src/components/ui/` – shadcn/ui components
- `src/lib/` – API adapter, demo auth, sample data, validation, risk helpers
- `src/styles.css` – Tailwind v4 theme and global styles

See `CHANGES.md` for what changed from the TypeScript/TanStack Start version.
