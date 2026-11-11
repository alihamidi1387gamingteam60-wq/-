# Ali Voryn Portfolio

Next.js App Router + React + TypeScript + Tailwind CSS foundation for the portfolio.

## Commands

- `npm run dev` — start the development server on `0.0.0.0:3000`.
- `npm run build` — create a production build.
- `npm run start` — serve the production build.
- `npm run lint` — run ESLint.
- `npm run typecheck` — run TypeScript without emitting files.

Node.js 20.9+ is required.

## Structure

```text
src/
  app/                 App Router routes, root layout and global styles
  components/          Reusable, mostly server-rendered UI components
    dialogs/
    hero/
    layout/
    sections/
  features/             Feature-local behavior and browser integrations
    about/
    effects/
    hero/
    search/
    theme/
public/
  fonts/               Self-hosted Vazir and Estedad fonts
```

Add route segments under `src/app` (for example, `src/app/projects/page.tsx`) and reusable UI under `src/components`. Keep browser-only state and APIs inside small Client Components; prefer Server Components for static content. Put feature-specific logic under `src/features/<feature>` and avoid placing page-specific code in the root layout.

The current canvas and legacy DOM interactions are isolated in `PortfolioEffects` and imported from feature folders so the UI can be migrated incrementally to idiomatic React hooks/components without mixing them into server-rendered page markup. Course search is prepared to index real course titles once they are added; it intentionally does not invent results.

## Security and operations

- React escapes interpolated text by default; do not introduce `dangerouslySetInnerHTML` for user-provided content.
- Keep secrets in environment variables and out of client components.
- Use same-origin relative URLs for future browser-facing API calls.
- Basic security response headers are configured in `next.config.mjs`; no permissive remote image domains or public secrets are configured.
