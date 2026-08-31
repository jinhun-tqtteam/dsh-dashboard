# dsh-dashboard

Công cụ của bên thứ ba, KHÔNG chính thức, không liên kết/được hỗ trợ bởi DeepSeek AI.
English summary below.

Plugin dashboard cho **DeepSeek Harness**: tổng quan toàn bộ session, tiến độ task,
trạng thái chờ duyệt, job nền và thông số — tất cả trên một trang ngay trong web GUI
của harness, không cần server hay trang riêng.

English: An unofficial third-party dashboard plugin for the DeepSeek Harness web GUI.
It renders a full-screen overview of every session — status, progress, background jobs
and KPIs — injected straight into the harness shell. No separate server or page.

## Tính năng

- **Trigger ở sidebar footer**: nút Dashboard + nút ghim (sticky) bật/tắt
- **Panel toàn màn hình** phủ khu vực làm việc (không che sidebar):
  - 12 thẻ KPI: tổng session, running, waiting-for-approval, jobs, turns, steps, tokens, LLM/tool/TTFT time
  - Ô tìm kiếm + filter chips: All / Running / Approval / Needs input / Errors / Completed / Idle
  - Bảng session có **pill trạng thái có nhãn**: Waiting for approval, Question, Plan review, Running, Error, Completed, Idle
  - **Nháy cảnh báo** (ripple + tint) cho session đang chờ user duyệt/nhập
  - Nhóm theo **workspace**, section Job activity (job live), subagent tree
  - Session detail drawer: todo progress, jobs, stats
- **Live summary nổi (sticky)**: popup góc phải theo dõi mọi trang
  - Lọc session hoạt động trong hôm nay; badge NEW cho reply chưa đọc
  - Ưu tiên hiển thị: NEW → Approval → Question/Plan → Running → Error
  - Pill minimized có counter `waiting`; viền nháy khi có session chờ
- **Trạng thái đa dạng**: approval / question / plan-review tách riêng từ
  `pendingInteraction`; Error từ job producer crashed (job pwsh/bash không bao giờ failed)
- Màu dot/pill dùng **design token của DSH** (`--dsw-*`) — tự theo theme light/dark
- Tôn trọng `prefers-reduced-motion`

## Cài đặt

Copy (hoặc `git clone`) vào thư mục plugins của profile DSH:

```
<profile>/node_modules/@dsh-user/dsh-dashboard
```

với `<profile>` thường là `~/.dsh/profiles/<tên-profile>`. Cấu trúc plugin:

- `package.json` — khai báo `dsh.client` face (inject runtime + primitives, platform web)
- `src/` — **source**: component JSX (`src/components/`), store, helper, stylesheet; đây là nơi duy nhất để sửa code
- `lib/client.js` — bundle UI chạy trong browser (tự đăng ký qua `window.__ModuleLoader__`), **sinh ra từ `npm run build`** — đừng sửa tay
- `lib/index.js` — host half (rỗng, chỉ để plugin xuất hiện trong loader)

Khởi động lại `dsh web` rồi hard-refresh trình duyệt.

## Kiến trúc & slot

| Slot | Component | Vai trò |
|---|---|---|
| `sidebar.footer.action` | DashboardTrigger | Nút mở dashboard + nút ghim sticky |
| `shell.overlay` | DashboardPanel | Panel toàn màn hình |
| `shell.overlay` | StickyWidget | Live summary nổi (độc lập store riêng) |

Client bundle export `apply(ctx)` đăng ký 3 slot qua `ctx.slots`, inject dịch vụ
Cordis `["sessions", "slots"]`. Trạng thái đọc qua hook chuẩn `useSessions` /
`useWorkspaces` (selector phải trả giá trị ổn định — xem ghi chú Object.is trong code).

## Trạng thái session

| Status | Nguồn |
|---|---|
| Waiting for approval / Question / Plan review | `pendingInteraction` = `approval` / `question` / `plan-review` |
| Running | `running` |
| Error | có job `status === "failed"` trong `jobsBySession` (producer crash — job shell không bao giờ failed) |
| Completed | client-derived "done while not selected" reminder |
| Idle | còn lại |

Lỗi request LLM (turn/end reason error) hiện **không** nằm trong session list state;
cần host projection plugin riêng để hiển thị (đã research, xem lịch sử dev).

## Hạn chế đã biết

- Lỗi LLM-level chưa hiển thị (cần host projection plugin riêng)
- `completed` là "done reminder" của sidebar, không phải exit-status của task

## Phát triển

```
npm install        # cài devDependencies (esbuild)
npm run build      # bundle src/ -> lib/client.js
npm run smoke      # kiểm tra bundle không cần browser: syntax, đăng ký factory, 3 slot, openSession
```

`esbuild.mjs` ghép output của esbuild (format CJS, `react`/`react/jsx-runtime`/`@deepseek-ai/dsh-client-ui-primitives`
để external — host module system cung cấp lúc materialize) vào shape `window.__ModuleLoader__.load({id, factory})`
giống hệt các package chính thức. `lib/` vẫn được commit để cài kiểu copy-kéo-thả không cần build,
nhưng mọi thay đổi UI phải đi qua `src/` rồi build lại.

Ghi chú kiến trúc: `useSessions`/`useWorkspaces` là standard props host tự cấp cho slot scope `root`;
`openSession` không phải standard prop — được cấp qua descriptor `inject` (map tới `ctx.sessions.open(id)`).
`DashboardPanel`/`StickyWidget` chia 2 tầng (gate + body) để subscription nặng chỉ chạy khi đang hiển thị.

## License

MIT
