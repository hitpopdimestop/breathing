# Repository Guidelines

## Project Structure & Module Organization

Product scope lives in `docs/ideas/breathing.md`, architectural decisions in `docs/decisions/`, implementation sequencing in `tasks/plan.md` plus `tasks/todo.md`, and the application is under `src/`.

The planned application structure is:

- `.agents/skills/`: project-local development workflows
- `.agents/references/`: shared quality and verification checklists
- `src/domain/`: pure breathing-cycle and timing logic
- `src/store/`: Zustand settings store and persistence
- `src/ui/`: React screens and visual components
- `src/i18n/`: Ukrainian and English dictionaries
- `src/styles/`: design tokens and tide animation styles
- `public/`: PWA manifest, icons, and static assets
- `e2e/`: browser-level user-flow tests

Keep tests next to source when practical: `breathing-session.ts` → `breathing-session.test.ts`.

## Build, Test, and Development Commands

The React/TypeScript/Vite foundation is scaffolded. Use these repository scripts:

- `yarn dev`: start the local Vite server
- `yarn build`: type-check and create the production build
- `yarn test`: run unit and component tests
- `yarn lint`: run static style checks
- `yarn typecheck`: run TypeScript without emitting files
- `yarn test:e2e`: run browser and PWA flows

Document any command changes in `README.md` and this file.

Before implementation, read `SPEC.md` and the relevant module spec in `specs/`. Update the spec before changing behavior or scope.

## Coding Style & Naming Conventions

Use TypeScript with two-space indentation and named exports. React components use PascalCase; functions, hooks, and Zustand actions use camelCase; files use kebab-case. Keep timer calculations pure and independent of React rendering or animation frames. Persist only breathing settings and language—never active-session state. Prefer CSS or platform APIs before adding visual libraries.

## Testing Guidelines

Use Vitest for domain and component tests and Playwright for end-to-end checks. Cover phase boundaries, complete-cycle duration, refresh behavior, offline launch, and persisted settings. Name tests `*.test.ts(x)` and browser specs `*.spec.ts`. Every bug fix should include a regression test.

## Commit & Pull Request Guidelines

Use Conventional Commits such as `feat: add breathing timeline` or `fix: preserve settings after reload`. Keep commits focused. Pull requests must reference the relevant task, summarize behavior changes, list verification performed, and include mobile/desktop screenshots for visual changes. PWA changes also require an offline or installed-app check.

## Architecture & Safety Boundaries

Follow `docs/decisions/001-web-application-stack.md`. Do not introduce Next.js, a backend, authentication, analytics containing breathing settings, or new dependencies without documenting the rationale. Never commit secrets or environment files.
