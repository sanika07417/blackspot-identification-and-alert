# Changes from the TypeScript version

## Language
- Every `.ts` / `.tsx` file is now `.js` / `.jsx`. All type annotations, interfaces, generics and
  `as` casts were removed; runtime behaviour is unchanged.
- Removed `tsconfig.json`, `typescript`, `typescript-eslint`, `@types/*`. Added `jsconfig.json`
  so the `@/` import alias still works in editors.

## Framework / build
- **TanStack Start (SSR, Nitro, Cloudflare) -> plain Vite SPA** with `index.html` + `src/main.jsx`.
- **TanStack Router file routes -> React Router (`react-router-dom`)**. Routes are declared in `src/App.jsx`.
  - `src/routes/*.tsx` -> `src/pages/*.jsx` (admin screens in `src/pages/admin/`).
  - `/blackspots/$id`, `/alerts/$id` -> `/blackspots/:id`, `/alerts/:id` (`useParams`).
  - Login `?redirect=` handled with `useSearchParams` (zod search validation removed).
  - Active nav links use `NavLink`; `navigate({ to })` -> `navigate(path)`.
- Page `<title>`/meta (old `head()`) -> small `<Seo />` component (React 19 hoists tags to `<head>`).
- Root error/404 components -> `ErrorBoundary` and `NotFound` in the app.
- Removed SSR-only files: `server.ts`, `start.ts`, `router.tsx`, `routeTree.gen`, error-capture,
  error-page, Lovable error reporting, `@lovable.dev/vite-tanstack-config`, `nitro`, `bun.lock`, `bunfig.toml`.
- `vite.config.ts` -> `vite.config.js` (React plugin + `@tailwindcss/vite` + `@` alias + Vitest config).
- ESLint config simplified for JavaScript. `components.json` now has `"tsx": false`.

## Tailwind CSS
- Unchanged: Tailwind v4 via `@tailwindcss/vite`, same theme in `src/styles.css`.

## Tests
- `validation.test.ts` -> `.js` (unchanged). Routing test rewritten with `MemoryRouter` (renders `/` and an unknown URL).

## Verified
`npm run build` succeeds, `npm test` passes (9 tests), ESLint has 0 errors, and every page (public, login,
protected redirect, admin screens, map markers) loaded in a browser with no console errors.
