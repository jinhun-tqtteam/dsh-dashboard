# dsh-dashboard

[![CI](https://github.com/jinhun-tqtteam/dsh-dasboard/actions/workflows/ci.yml/badge.svg)](https://github.com/jinhun-tqtteam/dsh-dasboard/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40jinhun-tqtteam%2Fdsh-dashboard)](https://www.npmjs.com/package/@jinhun-tqtteam/dsh-dashboard)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

> **Unofficial third-party plugin** — not affiliated with, sponsored, or endorsed by DeepSeek AI.

**Session Dashboard for DeepSeek Harness** — every session, task progress, waiting-for-approval states, background jobs and token/KPI metrics on one page, injected straight into the harness web GUI. No separate server or page.

<!-- Optional: add a screenshot here -->
<!-- ![Dashboard screenshot](docs/screenshot.png) -->

## Features

- **Sidebar trigger** — Dashboard toggle + sticky pin; icon-only rail mode with tooltips when the sidebar is collapsed
- **Full-screen panel** (never covers the sidebar):
  - 18 KPI tiles, tone-coded (running blue / completed green / waiting amber / errors red) — the status tiles double as clickable filters
  - Search + status filter chips with status dots (All / Running / Approval / Needs input / Errors / Completed / Idle)
  - Session tables with labeled status pills, keyboard support (Enter opens, D opens details), sticky column headers
  - Attention ripple on sessions waiting for user approval/input
  - Workspace grouping, live job activity feed, subagent hierarchy tree
  - **Slide-over detail drawer**: todo progress, live jobs, session stats, token-usage composition with legend, context-pressure gauge
- **Floating live summary (sticky)** — follows you across pages, minimized pill with a waiting counter
- **Notifications** — in-page toasts + audio chimes + native OS banners for completed / error / waiting states, wired through a requestAnimationFrame frame bridge so they fire even when the tab is unfocused
- Status model splits approval / question / plan-review out of `pendingInteraction`; errors come from crashed producer jobs
- Colors ride DSH design tokens (`--dsw-*`) — light/dark theme for free; respects `prefers-reduced-motion`

## Requirements

- A running DeepSeek Harness install with the web GUI (this plugin only ships a client bundle)
- Node.js >= 18 (only needed when building from source)

## Install

### 1. Get the package

Pick one:

```bash
# npm (once published)
npm install -g @jinhun-tqtteam/dsh-dashboard

# or clone from GitHub
git clone https://github.com/jinhun-tqtteam/dsh-dasboard.git
```

Or copy the package folder (with the prebuilt `lib/`) into the profile's plugin store manually:

```text
<profile>/web/node_modules/@jinhun-tqtteam/dsh-dashboard
```

> Older DSH builds used `<profile>/node_modules/...` — if `web/node_modules` does not exist, fall back to that path.

### 2. Register the loader entry

Add to `<profile>/web/cordis.patch.yml`:

```yaml
- insert:
    - id: dsh-dashboard
      name: "@jinhun-tqtteam/dsh-dashboard"
```

### 3. Restart the harness

Plugin-set changes need a harness restart; bundle-only changes reach the graph via a browser refresh.

> The loader entry `name` must exactly equal the bundle's registered id (the package name). The client module graph rejects a bundle that registers a different id.

## Usage

| Action | How |
|---|---|
| Open the dashboard | **Dashboard** button in the sidebar footer (or the rail icon when collapsed) |
| Pin the live summary | **Sticky** pin button |
| Open a session | single-click a row |
| Session details | double-click a row, press **D**, or single-click in the sticky |
| Filter | click the KPI tiles or the status chips |
| Close | **Esc** (closes the detail drawer first, then the panel) |
| Toggle notifications | the bell in the panel header or sticky header (dot: green = banners granted, amber = blocked) |

### Notification sounds & banners

The first bell click warms the audio context, asks for window-notification permission and starts a keep-alive so background tabs never silence alerts.

If the bell dot stays amber:

1. Allow notifications for the harness origin in the browser (padlock icon in the address bar).
2. Check the OS-level setting for the browser app, e.g. Windows Settings -> System -> Notifications.

## How it works

The package registers one host-side plugin (an empty `apply`, purely to appear in the Loader) and one client bundle served at `/plugins/@jinhun-tqtteam/dsh-dashboard/client.js`. The bundle registers itself through `window.__ModuleLoader__.load` in the lazy-CJS shape the DSH client module system expects, mounts three `shell.overlay` entries (panel, sticky, notifications) plus one `sidebar.footer.action` entry (the trigger), and receives the `openSession` descriptor through the standard `inject` mechanism.

`src/` is the source of truth; `lib/` is committed so the manual copy install works without a build step.

## Development

```bash
npm install
npm run build   # esbuild src/ -> lib/client.js (ModuleLoader CJS shape)
npm run smoke   # structural checks: bundle shape, slot registration, exports
```

The build fails if the bundle comes out suspiciously small. CI runs build + smoke on Ubuntu, Windows and macOS.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contribution guide.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `bundle ... loaded without registering "<id>"` in the log | The loader entry `name` and the package name differ — make them identical |
| Trigger button missing | The loader entry was not composed in yet — restart the harness after editing `cordis.patch.yml` |
| Panel opens but is empty | Sessions appear once the host publishes them; make sure at least one session exists |
| No sound while the tab is unfocused | Toggle the bell once per page load (it enables the keep-alive + audio warm-up) |

## License

[MIT](./LICENSE) © Tran Quang Tien
