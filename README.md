# dsh-dashboard

[![CI](https://github.com/jinhun-tqtteam/dsh-dasboard/actions/workflows/ci.yml/badge.svg)](https://github.com/jinhun-tqtteam/dsh-dasboard/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40jinhun-tqtteam%2Fdsh-dashboard)](https://www.npmjs.com/package/@jinhun-tqtteam/dsh-dashboard)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

> **Unofficial third-party plugin** — not affiliated with or endorsed by DeepSeek AI.

**Session Dashboard for [DeepSeek Harness](https://deepseek.ai)** — every session, task progress, waiting-for-approval states, background jobs and token/KPI metrics on one page, injected straight into the harness web GUI. No separate server or page.

> Tiếng Việt: plugin dashboard **không chính thức** cho DeepSeek Harness — tổng quan toàn bộ session, tiến độ task, trạng thái chờ duyệt, job nền và thông số token/KPI ngay trong web GUI của harness.

## Features

- **Sidebar trigger** — Dashboard toggle + sticky pin; icon-only rail mode with tooltips when the sidebar is collapsed
- **Full-screen panel** (never covers the sidebar):
  - 18 KPI tiles, tone-coded (running blue / completed green / waiting amber / errors red) — the status tiles are clickable filters
  - Search + status filter chips with status dots (All / Running / Approval / Needs input / Errors / Completed / Idle)
  - Session tables with labeled status pills, keyboard support (Enter opens, D opens details), sticky column headers
  - Attention ripple on sessions waiting for user approval/input
  - Workspace grouping, live Job activity feed, subagent hierarchy tree
  - **Slide-over detail drawer**: todo progress, live jobs, session stats, token-usage composition with legend, context-pressure gauge
- **Floating live summary (sticky)** — follows you across pages, minimized pill with waiting counter
- **Notifications**: in-page toasts + chimes + native OS banners for completed / error / waiting states — wired through a frame bridge so they fire even when the tab is unfocused
- Status model splits approval / question / plan-review from `pendingInteraction`; errors come from crashed producer jobs
- Colors ride DSH design tokens (`--dsw-*`) — light/dark theme for free; respects `prefers-reduced-motion`

## Install

### From npm (recommended)

```bash
npm install -g @jinhun-tqtteam/dsh-dashboard
```

Then add the plugin to your DSH profile's `cordis.patch.yml` (see below).

### From GitHub

```bash
git clone https://github.com/jinhun-tqtteam/dsh-dasboard.git
```

### Manual (copy into the profile, no build needed)

Copy the package folder (with the prebuilt `lib/`) into the profile's plugin store:

```
<profile>/node_modules/@jinhun-tqtteam/dsh-dashboard
```

## Register the Loader entry

Add to `<profile>/web/cordis.patch.yml`:

```yaml
- insert:
    - id: dsh-dashboard
      name: "@jinhun-tqtteam/dsh-dashboard"
```

Restart the harness (plugin-set changes need a restart; bundle content changes reach the graph via a browser refresh).

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

The first bell click warms the audio context, asks for window-notification permission and starts a keep-alive so background tabs never silence alerts. If the bell dot stays amber, allow notifications for the harness origin in the browser (padlock in the address bar) and check Windows Settings → System → Notifications for the browser app.

## Development

```bash
npm install
npm run build   # esbuild src/ -> lib/client.js (ModuleLoader CJS shape)
npm run smoke   # structural checks: bundle shape, slot registration, exports
```

`src/` is the source of truth; `lib/` is committed so the manual copy install works without a build step. The build fails if the bundle comes out suspiciously small.

## License

[MIT](./LICENSE) © Tran Quang Tien
