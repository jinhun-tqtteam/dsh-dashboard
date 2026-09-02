# Security Policy

## Scope

This repository ships a client-side UI plugin for DeepSeek Harness. It runs inside your browser against your local harness instance and does not add host-side behavior, network endpoints, or telemetry.

## Supported versions

| Version | Supported |
|---|---|
| latest on `main` / latest npm release | yes |

## Reporting a vulnerability

Please do **not** open a public issue for security problems.

Use GitHub's [private vulnerability reporting](https://github.com/jinhun-tqtteam/dsh-dasboard/security/advisories/new), or contact the maintainer via [GitHub contact](https://github.com/jinhun-tqtteam). Include a description, reproduction steps, and any console output. You can expect an initial response within a few days.

## Notes

- The plugin requests browser Notification permission and plays audio only after you explicitly enable its bell toggle.
- The keep-alive feature emits a constant inaudible tone to keep background-tab timers throttling-free; it is local-only and sends nothing anywhere.
