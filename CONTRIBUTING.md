# Contributing

Thanks for your interest in contributing! This is a small, focused plugin — PRs for bug fixes and focused features are very welcome.

## Getting started

```bash
git clone https://github.com/jinhun-tqtteam/dsh-dashboard.git
cd dsh-dashboard
npm install --legacy-peer-deps
npm run build
npm run smoke
```

- `npm run build` bundles `src/client.jsx` into `lib/client.js` (the ModuleLoader CJS shape the DSH web shell loads).
- `npm run smoke` verifies bundle syntax, registration id, exported plugin face and slot wiring without a browser.

## Ground rules

- **`src/` is the source of truth.** `lib/` is committed only so the manual copy install works without a build step — always rebuild it and include it in the PR.
- The bundle's registered id is derived from `package.json` (`name`). Never hardcode it in source or build config.
- The loader entry `name` must equal the package name; don't change one without the other in docs.
- Use DSH design tokens (`var(--dsw-alias-...)` / `var(--dsw-specific-...)`) with hardcoded fallbacks — never bare colors, so light/dark theming keeps working.
- All UI copy in English.
- Keep the bundle dependency-free besides `react`, `react/jsx-runtime` and `@deepseek-ai/dsh-client-ui-primitives` (all external, provided by the host).

## Commit style

Conventional Commits, lowercase type, imperative subject:

```text
feat: add token legend to the usage composition bar
fix: qualify native notification tags per event kind
docs: update manual install path
chore: bump esbuild to 0.25.10
```

## Pull requests

1. Fork + create a topic branch off `main`.
2. Keep changes minimal and focused; one logical change per PR.
3. Make sure `npm run build` and `npm run smoke` pass (CI will run them on three OSes).
4. Describe what changed and why; link any related issue.

## Reporting bugs

Open a [bug report](https://github.com/jinhun-tqtteam/dsh-dashboard/issues/new?template=bug_report.yml) with your DSH version, OS + browser, and the relevant console/log output. For security issues, see [SECURITY.md](./SECURITY.md).
