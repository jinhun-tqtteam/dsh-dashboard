# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/) and the project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-02-14

### Added
- Session dashboard panel: KPI tiles, search + status filter chips, per-status sections, workspace grouping, job activity feed, subagent tree, slide-over session detail (stats, todos, token usage with legend, context pressure)
- Sidebar trigger with icon-only rail mode + tooltips when the sidebar is collapsed
- Floating sticky live summary with waiting counter and attention pulse
- Token meter integration: per-session input/output/cache-read/cache-write totals and context-pressure gauge
- Notification engine: toasts + WebAudio chimes + native OS banners for completed / error / waiting states, notification bell with permission dot, keep-alive audio for background tabs, and a requestAnimationFrame frame bridge so events still fire while the tab is unfocused
- Keyboard support on session rows (Enter opens, D opens details) and Escape cascade (detail first, then panel)
- CI workflow (build + smoke on Ubuntu/Windows/macOS) and a manual npm release workflow
