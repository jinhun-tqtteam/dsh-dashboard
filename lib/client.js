window.__ModuleLoader__.load({
	id: "@dsh-user/dsh-dashboard",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let primitives = require("@deepseek-ai/dsh-client-ui-primitives");

		//#region styles
		const css = [
			".dshd-overlay{position:absolute;top:0;bottom:0;right:0;z-index:1000;pointer-events:auto;display:flex;flex-direction:column;overflow:hidden;background:var(--dsw-specific-menu,#1e1e1e);color:var(--dsw-alias-label-primary,#e6e6e6);font:13px/1.5 var(--dsw-font-sans,system-ui,sans-serif)}",
			".dshd-header{display:flex;align-items:center;gap:8px;padding:10px 16px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.25));flex:none}",
			".dshd-title{font-size:15px;font-weight:600;flex:1;display:flex;align-items:center;gap:8px}",
			".dshd-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:0;border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary,#b0b0b0);cursor:pointer}",
			".dshd-icon-btn:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.15));color:var(--dsw-alias-label-primary,#e6e6e6)}",
			".dshd-body{flex:1;min-height:0;overflow:auto;padding:14px 16px;display:flex;flex-direction:column;gap:16px}",
			".dshd-body > *{flex:none}",
			".dshd-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}",
			".dshd-card{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.08));border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2));border-radius:10px;padding:10px 14px}",
			".dshd-card-value{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums}",
			".dshd-card-label{font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a);margin-top:2px}",
			".dshd-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
			".dshd-search{flex:1;min-width:180px;height:28px;padding:0 10px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.25));background:var(--dsw-alias-fill-l2,rgba(128,128,128,.08));color:var(--dsw-alias-label-primary,#e6e6e6);font-size:12px;outline:none}",
			".dshd-search:focus{border-color:var(--dsw-alias-accent,#5686fe)}",
			".dshd-chip{display:inline-flex;align-items:center;gap:4px;height:26px;padding:0 10px;border-radius:14px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.25));background:0 0;color:var(--dsw-alias-label-secondary,#b0b0b0);font-size:12px;cursor:pointer;white-space:nowrap}",
			".dshd-chip:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.12))}",
			".dshd-chip-on{background:var(--dsw-alias-accent,#5686fe);border-color:var(--dsw-alias-accent,#5686fe);color:#fff}",
			".dshd-chip-count{margin-left:2px;opacity:.75;font-variant-numeric:tabular-nums}",
			".dshd-section{border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2));border-radius:10px;overflow:hidden}",
			".dshd-section-head{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;background:var(--dsw-alias-fill-l2,rgba(128,128,128,.06));user-select:none}",
			".dshd-section-head:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.12))}",
			".dshd-section-title{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-tertiary,#8a8a8a);flex:1}",
			".dshd-section-count{font-size:12px;color:var(--dsw-alias-label-tertiary,#8a8a8a);font-variant-numeric:tabular-nums}",
			".dshd-table{width:100%;border-collapse:collapse;table-layout:fixed}",
			".dshd-table th{text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-tertiary,#8a8a8a);padding:6px 10px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2))}",
			".dshd-table td{padding:7px 10px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.1));vertical-align:middle;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
			".dshd-row{cursor:pointer}",
			".dshd-row:hover td{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.1))}",
			".dshd-row-current td{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.16))}",
			".dshd-sess-title{font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".dshd-sess-sub{font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}",
			".dshd-mono{font-family:var(--dsw-font-mono,ui-monospace,monospace);font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
			".dshd-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle}",
			".dshd-dot-running{background:var(--dsw-static-deepseek-450,#5686fe);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-static-deepseek-450,#5686fe) 12%,transparent)}",
			".dshd-dot-completed{background:var(--dsw-alias-state-success-primary,#22c55e);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-success-primary,#22c55e) 12%,transparent)}",
			
			".dshd-dot-idle{background:var(--dsw-static-neutral-bluish-600,#81858c);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-static-neutral-bluish-600,#81858c) 12%,transparent)}",
			".dshd-progress{display:inline-block;min-width:56px;height:6px;border-radius:3px;background:var(--dsw-alias-fill-l2,rgba(128,128,128,.2));overflow:hidden;vertical-align:middle}",
			".dshd-progress > span{display:block;height:100%;background:var(--dsw-alias-state-success-primary,#22c55e)}",
			".dshd-empty{padding:32px;text-align:center;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
			".dshd-trigger{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 8px;border:0;border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary,#b0b0b0);cursor:pointer;font-size:12px;white-space:nowrap}",
			".dshd-trigger:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.15));color:var(--dsw-alias-label-primary,#e6e6e6)}",
			".dshd-trigger-open{color:var(--dsw-alias-label-primary,#e6e6e6)}",
			".dshd-trigger-badge{margin-left:2px;font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
			".dshd-status{display:inline-flex;align-items:center;gap:4px;font-size:11px;border-radius:10px;padding:1px 8px;border:1px solid transparent}",
			".dshd-status-running{color:var(--dsw-static-deepseek-450,#5686fe);border-color:color-mix(in srgb,var(--dsw-static-deepseek-450,#5686fe) 45%,transparent)}",
			".dshd-status-completed{color:var(--dsw-alias-state-success-primary,#22c55e);border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary,#22c55e) 45%,transparent)}",
			
			".dshd-status-idle{color:var(--dsw-static-neutral-bluish-600,#81858c);border-color:color-mix(in srgb,var(--dsw-static-neutral-bluish-600,#81858c) 45%,transparent)}",
			"@keyframes dshd-dot-pulse{0%{box-shadow:0 0 0 0 currentColor;opacity:1}50%{box-shadow:0 0 0 5px transparent;opacity:.55}100%{box-shadow:0 0 0 0 currentColor;opacity:1}}",
			"@keyframes dshd-row-pulse{0%,100%{background:transparent}50%{background:color-mix(in srgb,var(--dshd-attn,#f59e0b) 10%,transparent)}}",
			"@keyframes dshd-pill-pulse{0%,100%{border-color:var(--dsw-alias-border-l2,rgba(128,128,128,.2))}50%{border-color:var(--dsw-alias-state-warn-primary,#f59e0b)}}",
			".dshd-dot-attention{animation:dshd-dot-pulse 1.6s ease-in-out infinite}",
			".dshd-row-approval{--dshd-attn:var(--dsw-alias-state-warn-primary,#f59e0b);animation:dshd-row-pulse 2s ease-in-out infinite}",
			".dshd-row-question{--dshd-attn:var(--dsw-alias-state-warn-secondary,#f7ad31);animation:dshd-row-pulse 2s ease-in-out infinite}",
			".dshd-row-plan{--dshd-attn:var(--dsw-static-blue-400,#60a5fa);animation:dshd-row-pulse 2s ease-in-out infinite}",
			".dshd-sticky-pill.dshd-pill-attn{animation:dshd-pill-pulse 2s ease-in-out infinite}",
			".dshd-wait{font-size:12px;font-weight:600;color:var(--dsw-alias-state-warn-primary,#f59e0b)}",
			"@media (prefers-reduced-motion:reduce){.dshd-dot-attention,.dshd-row-approval,.dshd-row-question,.dshd-row-plan,.dshd-sticky-pill.dshd-pill-attn{animation:none}.dshd-row-approval,.dshd-row-question,.dshd-row-plan{background:color-mix(in srgb,var(--dshd-attn,#f59e0b) 8%,transparent)}}",
			".dshd-dot-approval{color:var(--dsw-alias-state-warn-primary,#f59e0b);background:var(--dsw-alias-state-warn-primary,#f59e0b);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-warn-primary,#f59e0b) 12%,transparent)}",
			".dshd-dot-question{color:var(--dsw-alias-state-warn-secondary,#f7ad31);background:var(--dsw-alias-state-warn-secondary,#f7ad31);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-warn-secondary,#f7ad31) 12%,transparent)}",
			".dshd-dot-plan{color:var(--dsw-static-blue-400,#60a5fa);background:var(--dsw-static-blue-400,#60a5fa);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-static-blue-400,#60a5fa) 12%,transparent)}",
			".dshd-dot-error{background:var(--dsw-alias-state-error-primary,#ec1313);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-error-primary,#ec1313) 12%,transparent)}",
			".dshd-status-approval{color:var(--dsw-alias-state-warn-primary,#f59e0b);border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#f59e0b) 45%,transparent)}",
			".dshd-status-question{color:var(--dsw-alias-state-warn-secondary,#f7ad31);border-color:color-mix(in srgb,var(--dsw-alias-state-warn-secondary,#f7ad31) 45%,transparent)}",
			".dshd-status-plan{color:var(--dsw-static-blue-400,#60a5fa);border-color:color-mix(in srgb,var(--dsw-static-blue-400,#60a5fa) 45%,transparent)}",
			".dshd-status-error{color:var(--dsw-alias-state-error-primary,#ec1313);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary,#ec1313) 45%,transparent)}",
			".dshd-job{display:flex;align-items:center;gap:8px;padding:6px 10px;font-size:12px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.08))}",
			".dshd-job:last-child{border-bottom:none}",
			".dshd-job-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".dshd-badge{display:inline-block;font-size:10px;font-weight:600;border-radius:8px;padding:1px 7px;background:var(--dsw-alias-fill-l2,rgba(128,128,128,.18));color:var(--dsw-alias-label-secondary,#b0b0b0)}",
			".dshd-tree{padding:8px 12px}",
			".dshd-tree-node{display:flex;align-items:center;gap:6px;padding:4px 0;font-size:12px;cursor:pointer;border-radius:6px}",
			".dshd-tree-node:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.1))}",
			".dshd-tree-children{margin-left:18px;border-left:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2));padding-left:10px}",
			".dshd-caret{display:inline-flex;width:14px;justify-content:center;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
			".dshd-ws-group{padding:6px 12px}",
			".dshd-ws-head{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;padding:4px 0;cursor:pointer;border-radius:6px}",
			".dshd-ws-head:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.1))}",
			".dshd-close{background:var(--dsw-alias-accent,#5686fe);color:#fff;border:0;border-radius:6px;padding:4px 12px;font-size:12px;cursor:pointer}",
			".dshd-close:hover{opacity:.85}",
			".dshd-col-status{width:158px}",
			".dshd-col-preset{width:110px}",
			".dshd-col-tasks{width:118px}",
			".dshd-col-jobs{width:78px}",
			".dshd-col-updated{width:92px}",
			".dshd-section-meta{display:inline-flex;align-items:center;gap:6px}",
			".dshd-section .dshd-empty{padding:14px}",
			".dshd-ws-item{padding:2px 0}",
			".dshd-trigger-group{display:inline-flex;align-items:center;gap:2px}",
			".dshd-pin{display:inline-flex;align-items:center;justify-content:center;gap:4px;height:28px;min-width:28px;padding:0 6px;border:0;border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary,#b0b0b0);cursor:pointer}",
			".dshd-pin:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.15));color:var(--dsw-alias-label-primary,#e6e6e6)}",
			".dshd-pin-on{color:var(--dsw-alias-accent,#5686fe)}",
			".dshd-sticky{position:fixed;top:16px;right:16px;z-index:1100;width:340px;max-width:calc(100vw - 32px);max-height:70vh;display:flex;flex-direction:column;background:var(--dsw-specific-menu,#1e1e1e);color:var(--dsw-alias-label-primary,#e6e6e6);border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.3));border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.45);pointer-events:auto;overflow:hidden;font:13px/1.5 var(--dsw-font-sans,system-ui,sans-serif)}",
			".dshd-sticky-head{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2));flex:none}",
			".dshd-sticky-title{font-size:12px;font-weight:600;flex:1}",
			".dshd-sticky-body{flex:1;min-height:0;overflow:auto;padding:4px 0}",
			".dshd-sticky-row{display:flex;align-items:center;gap:8px;padding:6px 12px;cursor:pointer}",
			".dshd-sticky-row:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.1))}",
			".dshd-sticky-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}",
			".dshd-sticky-prog{width:64px;min-width:64px}",
			".dshd-sticky-meta{font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a);font-variant-numeric:tabular-nums;white-space:nowrap}",
			".dshd-sticky-empty{padding:16px;text-align:center;color:var(--dsw-alias-label-tertiary,#8a8a8a);font-size:12px}",
			".dshd-sticky-pill{position:fixed;top:16px;right:16px;z-index:1100;display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:var(--dsw-specific-menu,#1e1e1e);color:var(--dsw-alias-label-primary,#e6e6e6);border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.3));box-shadow:0 8px 30px rgba(0,0,0,.45);cursor:pointer;pointer-events:auto;font-size:12px}",
			".dshd-sticky-pill:hover{border-color:var(--dsw-alias-accent,#5686fe)}",
			".dshd-new{display:inline-flex;align-items:center;font-size:9px;font-weight:700;letter-spacing:.06em;color:#fff;background:var(--dsw-static-deepseek-450,#5686fe);border-radius:8px;padding:1px 6px;line-height:1.4;flex:none}"
		].join("");
		const tagId = "@dsh-user/dsh-dashboard/dashboard.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@dsh-user/dsh-dashboard";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion

		//#region store — shared open/close state between the sidebar trigger and the overlay
		const listeners = new Set();
		let isOpen = false;
		function subscribe(fn) {
			listeners.add(fn);
			return () => listeners.delete(fn);
		}
		function getSnapshot() {
			return isOpen;
		}
		function setOpen(value) {
			if (isOpen === value) return;
			isOpen = value;
			for (const fn of listeners) fn();
		}
		//#endregion

		//#region sticky store — persistent floating summary state
		const stickyListeners = new Set();
		let isSticky = false;
		try { isSticky = (typeof localStorage !== "undefined" && localStorage.getItem("dshd-sticky") === "1"); } catch (e) {}
		function subscribeSticky(fn) { stickyListeners.add(fn); return () => stickyListeners.delete(fn); }
		function getSticky() { return isSticky; }
		function setSticky(value) {
			if (isSticky === value) return;
			isSticky = value;
			try { if (typeof localStorage !== "undefined") localStorage.setItem("dshd-sticky", value ? "1" : "0"); } catch (e) {}
			for (const fn of stickyListeners) fn();
		}
		function useSticky() { return useSyncExternalStore(subscribeSticky, getSticky); }
		//#endregion

		//#region read-tracking — has the user seen a session's latest answer?
		const READ_KEY = "dshd-lastread";
		let lastReadMap = {};
		try { lastReadMap = JSON.parse(localStorage.getItem(READ_KEY) || "{}") || {}; } catch (e) { lastReadMap = {}; }
		try {
			const readCutoff = Date.now() - 7 * 86400000;
			for (const rk of Object.keys(lastReadMap)) if (lastReadMap[rk] < readCutoff) delete lastReadMap[rk];
		} catch (e) {}
		function markRead(id) {
			if (!id) return;
			const ts = Date.now();
			if ((lastReadMap[id] || 0) >= ts - 1000) return;
			lastReadMap[id] = ts;
			try { localStorage.setItem(READ_KEY, JSON.stringify(lastReadMap)); } catch (e) {}
		}
		function isUnread(s, currentId) {
			if (!s || s.blank || s.id === currentId) return false;
			if (s.running || s.pendingInteraction) return false;
			return (s.updatedAt || 0) > (lastReadMap[s.id] || 0);
		}
		//#endregion

		//#region helpers
		const { useSyncExternalStore } = react;
		function useOpen() {
			return useSyncExternalStore(subscribe, getSnapshot);
		}
		function formatTime(ts, now) {
			if (!ts) return "\u2014";
			const diff = Math.max(0, now - ts);
			if (diff < 60000) return Math.floor(diff / 1000) + "s ago";
			if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
			if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
			return new Date(ts).toLocaleDateString();
		}
		function formatDuration(ms) {
			if (!ms || ms <= 0) return "\u2014";
			if (ms < 1000) return Math.round(ms) + "ms";
			if (ms < 60000) return (ms / 1000).toFixed(1) + "s";
			return Math.floor(ms / 60000) + "m " + Math.round((ms % 60000) / 1000) + "s";
		}
		function formatTokens(n) {
			if (!n || n <= 0) return "\u2014";
			if (n < 1000) return String(n);
			return (n / 1000).toFixed(1) + "k";
		}
		function todoProgress(projectionValues) {
			const todos = projectionValues && projectionValues.todos;
			if (!Array.isArray(todos) || todos.length === 0) return null;
			const done = todos.filter((t) => t.status === "completed").length;
			return { done, total: todos.length, pct: Math.round((done / todos.length) * 100) };
		}
		function liveJobs(jobs) {
			if (!Array.isArray(jobs)) return 0;
			return jobs.filter((j) => j.status === "running" || j.status === "stopping").length;
		}
		function hasFailedJob(jobs) {
			return Array.isArray(jobs) && jobs.some((j) => j && j.status === "failed");
		}
		function statusOf(s, jobs) {
			const pi = s && s.pendingInteraction;
			if (pi === "approval") return "approval";
			if (pi === "question") return "question";
			if (pi === "plan-review") return "plan";
			if (s && s.running) return "running";
			if (hasFailedJob(jobs)) return "error";
			if (s && s.completed) return "completed";
			return "idle";
		}
		function statusLabel(st) {
			if (st === "approval") return "Waiting for approval";
			if (st === "question") return "Question";
			if (st === "plan") return "Plan review";
			if (st === "error") return "Error";
			if (st === "running") return "Running";
			if (st === "completed") return "Completed";
			return "Idle";
		}
		function statusClass(st) {
			return "dshd-status-" + st;
		}
		function dotClassOf(st) {
			return "dshd-dot-" + st;
		}
		function statsOf(s) {
			const v = s && s.projectionValues && s.projectionValues.sessionStats;
			return v && typeof v === "object" ? v : null;
		}
		//#endregion

		const EMPTY_OBJ = {};

	//#region DashboardTrigger — sidebar.footer.action entry
function DashboardTrigger(props) {
			const open = useOpen();
			const sticky = useSticky();
			const { useSessions, wide } = props;
			const runningCount = useSessions((s) => s.ids.filter((id) => s.byId[id] && s.byId[id].running).length);
			return react.createElement(
				"div",
				{ className: "dshd-trigger-group" },
				react.createElement(
					"button",
					{
						type: "button",
						className: "dshd-trigger" + (open ? " dshd-trigger-open" : ""),
						onClick: () => setOpen(!open),
						title: "Session dashboard",
						"aria-expanded": open
					},
					react.createElement(primitives.IconDataOutline16, null),
					wide ? react.createElement("span", null, "Dashboard") : null,
					runningCount > 0 ? react.createElement("span", { className: "dshd-trigger-badge" }, runningCount + " running") : null
				),
				react.createElement(
					"button",
					{
						type: "button",
						className: "dshd-pin" + (sticky ? " dshd-pin-on" : ""),
						onClick: () => setSticky(!sticky),
						title: sticky ? "Turn off sticky dashboard" : "Turn on sticky dashboard",
						"aria-pressed": sticky
					},
					stickyIcon(),
					wide && sticky ? react.createElement("span", null, "Sticky") : null
				)
			);
		}
		function stickyIcon() {
			return react.createElement(
				"svg",
				{ width: 14, height: 14, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" },
				react.createElement("path", { d: "M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" })
			);
		}
		//#endregion

		//#region JobFeed — aggregated live jobs across sessions
		function JobFeed({ jobsBySession, byId, openSession, max }) {
			const feed = [];
			for (const sid of Object.keys(jobsBySession)) {
				const jobs = jobsBySession[sid] || [];
				for (const job of jobs) feed.push({ sid, job });
			}
			feed.sort((a, b) => {
				const sa = a.job.startedAt || 0, sb = b.job.startedAt || 0;
				return sb - sa;
			});
			const shown = (max ? feed.slice(0, max) : feed).filter(({ job }) => job.status === "running" || job.status === "stopping");
			if (shown.length === 0) return react.createElement("div", { className: "dshd-empty" }, "No live background jobs.");
			return react.createElement(
				"div",
				null,
				shown.map(({ sid, job }) => react.createElement(
					"div",
					{ key: sid + ":" + job.id, className: "dshd-job", onClick: () => openSession(sid), title: "Open session" },
					react.createElement("span", { className: "dshd-status dshd-status-" + (job.status === "running" || job.status === "stopping" ? "running" : job.status === "failed" ? "pending" : "completed") }, job.status),
					react.createElement("span", { className: "dshd-badge" }, job.kind),
					react.createElement("span", { className: "dshd-job-label" }, job.label || job.id),
					react.createElement("span", { className: "dshd-mono" }, job.detail || "")
				))
			);
		}
		//#endregion

		//#region SessionTree — subagent hierarchy from subagentsByParent
		function SessionTree({ subagentsByParent, byId, openSession, expanded, onToggle }) {
			const roots = Object.keys(subagentsByParent).filter((pid) => {
				const parent = byId[pid];
				return parent && parent.origin !== "subagent";
			});
			if (roots.length === 0) return react.createElement("div", { className: "dshd-empty" }, "No subagent hierarchies yet.");
			return react.createElement(
				"div",
				{ className: "dshd-tree" },
				roots.map((pid) => {
					const parent = byId[pid];
					const snap = subagentsByParent[pid];
					const children = snap && Array.isArray(snap.entries) ? snap.entries : [];
					const isOpen = expanded[pid];
					return react.createElement(
						"div",
						{ key: pid },
						react.createElement(
							"div",
							{ className: "dshd-tree-node", onClick: () => onToggle(pid) },
							react.createElement("span", { className: "dshd-caret" }, children.length > 0 ? (isOpen ? "\u25be" : "\u25b8") : ""),
							react.createElement("span", { className: "dshd-dot " + (parent.running ? "dshd-dot-running" : "dshd-dot-idle") }),
							react.createElement("span", { className: "dshd-sess-title" }, parent.displayTitle || parent.id),
							react.createElement("span", { className: "dshd-mono" }, children.length > 0 ? children.length + " sub" : "")
						),
						isOpen && children.length > 0
							? react.createElement(
								"div",
								{ className: "dshd-tree-children" },
								children.map((entry) => {
									const child = byId[entry.id];
									const label = entry.label || (child && child.displayTitle) || entry.id;
									const running = entry.activity === "running" || (child && child.running);
									return react.createElement(
										"div",
										{ key: entry.id, className: "dshd-tree-node", onClick: (e) => { e.stopPropagation(); openSession(entry.id); } },
										react.createElement("span", { className: "dshd-dot " + (running ? "dshd-dot-running" : "dshd-dot-idle") }),
										react.createElement("span", null, label),
										react.createElement("span", { className: "dshd-mono" }, entry.mode || "")
									);
								})
							)
							: null
					);
				})
			);
		}
		//#endregion

		//#region SessionDetail — expanded details for one session
		function SessionDetail({ session, jobs, onClose, openSession }) {
			if (!session) return null;
			const st = statusOf(session, jobs);
			const stats = statsOf(session);
			const todos = session.projectionValues && Array.isArray(session.projectionValues.todos) ? session.projectionValues.todos : [];
			const done = todos.filter((t) => t.status === "completed").length;
			const goal = session.projectionValues && session.projectionValues.goals;
			return react.createElement(
				"div",
				{ className: "dshd-detail" },
				react.createElement("div", { className: "dshd-detail-head" },
					react.createElement("span", { className: "dshd-status " + statusClass(st) }, statusLabel(st)),
					react.createElement("span", { className: "dshd-detail-title" }, session.displayTitle || session.id),
					react.createElement("button", { type: "button", className: "dshd-icon-btn", title: "Close details", onClick: onClose }, react.createElement(primitives.IconCloseFill14, null))
				),
				react.createElement("div", { className: "dshd-detail-grid" },
					detailCell("Session ID", session.id),
					detailCell("CWD", session.cwd || "\u2014"),
					detailCell("Preset", session.agentPreset || "\u2014"),
					detailCell("Parent", session.parentId ? String(session.parentId).slice(0, 12) + "\u2026" : "\u2014"),
					detailCell("Origin", session.origin || "\u2014"),
					detailCell("Updated", formatTime(session.updatedAt, Date.now()))
				),
				stats ? react.createElement(
					"div",
					{ className: "dshd-detail-block" },
					react.createElement("div", { className: "dshd-detail-label" }, "Session stats"),
					react.createElement("div", { className: "dshd-detail-grid" },
						detailCell("Turns", String(stats.turns)),
						detailCell("Steps", String(stats.steps)),
						detailCell("LLM time", formatDuration(stats.llmMs)),
						detailCell("Tool time", formatDuration(stats.toolMs)),
						detailCell("TTFT", formatDuration(stats.ttftMs)),
						detailCell("Decode tokens", formatTokens(stats.decodeTokens))
					)
				) : null,
				todos.length > 0 ? react.createElement(
					"div",
					{ className: "dshd-detail-block" },
					react.createElement("div", { className: "dshd-detail-label" }, "Tasks (" + done + "/" + todos.length + ")"),
					react.createElement(
						"ul",
						{ className: "dshd-todo-list" },
						todos.map((t, i) => react.createElement("li", { key: i, className: "dshd-todo " + (t.status === "completed" ? "dshd-todo-done" : t.status === "in_progress" ? "dshd-todo-active" : "") },
							react.createElement("span", { className: "dshd-todo-mark" }, t.status === "completed" ? "\u2713" : "\u25cb"),
							react.createElement("span", null, t.content)
						))
					)
				) : null,
				goal && typeof goal === "object" ? react.createElement(
					"div",
					{ className: "dshd-detail-block" },
					react.createElement("div", { className: "dshd-detail-label" }, "Goal"),
					react.createElement("div", { className: "dshd-detail-goal" },
						react.createElement("div", null, String(goal.objective || "")),
						goal.phase ? react.createElement("div", { className: "dshd-mono" }, "phase: " + String(goal.phase)) : null
					)
				) : null,
				jobs && jobs.length > 0 ? react.createElement(
					"div",
					{ className: "dshd-detail-block" },
					react.createElement("div", { className: "dshd-detail-label" }, "Live jobs (" + jobs.filter((j) => j.status === "running" || j.status === "stopping").length + "/" + jobs.length + ")"),
					react.createElement(
						"div",
						null,
						jobs.map((job) => react.createElement(
							"div",
							{ key: job.id, className: "dshd-job" },
							react.createElement("span", { className: "dshd-status dshd-status-" + (job.status === "running" || job.status === "stopping" ? "running" : job.status === "failed" ? "pending" : "completed") }, job.status),
							react.createElement("span", { className: "dshd-badge" }, job.kind),
							react.createElement("span", { className: "dshd-job-label" }, job.label || job.id)
						))
					)
				) : null,
				react.createElement("button", { type: "button", className: "dshd-close", onClick: () => { openSession(session.id); } }, "Open session")
			);
		}
		function detailCell(label, value) {
			return react.createElement("div", { className: "dshd-detail-cell" },
				react.createElement("div", { className: "dshd-detail-cell-label" }, label),
				react.createElement("div", { className: "dshd-detail-cell-value" }, value)
			);
		}
		//#endregion

		//#region StickyWidget — floating live summary over the whole page
		function StickyWidget(props) {
			const sticky = useSticky();
			const { useSessions, openSession } = props;
			const ids = useSessions((s) => s.ids);
			const byId = useSessions((s) => s.byId);
			const current = useSessions((s) => s.current);
			const jobsBySession = useSessions((s) => s.jobsBySession || EMPTY_OBJ);
			const now = react.useState(() => Date.now());
			const [minimized, setMinimized] = react.useState(false);
			react.useEffect(() => {
				if (!sticky) return;
				const timer = setInterval(() => now[1](Date.now()), 5000);
				return () => clearInterval(timer);
			}, [sticky]);
			if (!sticky) return null;
			const startOfToday = new Date();
			startOfToday.setHours(0, 0, 0, 0);
			const sessions = ids.map((id) => byId[id]).filter(Boolean);
			const runningCount = sessions.filter((s) => s.running).length;
			const activeJobs = Object.values(jobsBySession).reduce((n, jobs) => n + liveJobs(jobs), 0);
			const todays = sessions.filter((s) => (s.updatedAt || 0) >= startOfToday.getTime());
			const unreadCount = todays.filter((s) => isUnread(s, current)).length;
			const failedJobs = todays.filter((s) => hasFailedJob(jobsBySession[s.id])).length;
			const rankOf = (s) => {
				const st = statusOf(s, jobsBySession[s.id]);
				if (isUnread(s, current)) return 0;
				if (st === "approval") return 1;
				if (st === "question" || st === "plan") return 2;
				if (st === "running") return 3;
				if (st === "error") return 4;
				return 5;
			};
			const ordered = todays.slice().sort((a, b) => rankOf(a) - rankOf(b) || (b.updatedAt || 0) - (a.updatedAt || 0));
			const attentionCount = todays.filter((s) => { const st = statusOf(s, jobsBySession[s.id]); return st === "approval" || st === "question" || st === "plan"; }).length;
			if (minimized) {
				return react.createElement(
					"div",
					{ className: "dshd-sticky-pill" + (attentionCount > 0 ? " dshd-pill-attn" : ""), onClick: () => setMinimized(false), title: "Expand sticky dashboard" },
					react.createElement("span", { className: "dshd-dot " + (attentionCount > 0 ? "dshd-dot-approval dshd-dot-attention" : runningCount > 0 ? "dshd-dot-running" : "dshd-dot-idle") }),
					unreadCount > 0 ? react.createElement("span", { className: "dshd-new" }, unreadCount + " NEW") : null,
					attentionCount > 0 ? react.createElement("span", { className: "dshd-wait" }, attentionCount + " waiting") : null,
					react.createElement("span", null, runningCount + " running"),
					activeJobs > 0 ? react.createElement("span", { className: "dshd-sticky-meta" }, activeJobs + " jobs") : null
				);
			}
			return react.createElement(
				"div",
				{ className: "dshd-sticky", role: "dialog", "aria-label": "Sticky dashboard" },
				react.createElement(
					"div",
					{ className: "dshd-sticky-head" },
					react.createElement("span", { className: "dshd-dot " + (runningCount > 0 ? "dshd-dot-running" : "dshd-dot-idle") }),
					react.createElement("span", { className: "dshd-sticky-title" }, "Live summary"),
					react.createElement("span", { className: "dshd-sticky-meta" }, (unreadCount > 0 ? unreadCount + " new \u00b7 " : "") + runningCount + "/" + sessions.length + " running" + (attentionCount > 0 ? " \u00b7 " + attentionCount + " waiting" : "") + (activeJobs > 0 ? " \u00b7 " + activeJobs + " jobs" : "") + (failedJobs > 0 ? " \u00b7 " + failedJobs + " errored" : "")),
					react.createElement("button", { type: "button", className: "dshd-icon-btn", title: "Minimize", onClick: () => setMinimized(true) }, react.createElement("span", { style: { fontSize: 12, lineHeight: 1 } }, "\u2013")),
					react.createElement("button", { type: "button", className: "dshd-icon-btn", title: "Turn off sticky dashboard", onClick: () => setSticky(false) }, react.createElement(primitives.IconCloseFill14, null))
				),
				react.createElement(
					"div",
					{ className: "dshd-sticky-body" },
					ordered.length === 0
						? react.createElement("div", { className: "dshd-sticky-empty" }, "No sessions active today.")
						: ordered.map((s) => {
							const prog = todoProgress(s.projectionValues);
							const jobs = jobsBySession[s.id] || [];
							const act = liveJobs(jobs);
							const stX = statusOf(s, jobs);
							return react.createElement(
								"div",
								{ key: s.id, className: "dshd-sticky-row" + (stX === "approval" ? " dshd-row-approval" : stX === "question" ? " dshd-row-question" : stX === "plan" ? " dshd-row-plan" : ""), onClick: () => { try { openSession(s.id); } catch (e) {} }, title: "Open session" },
								react.createElement("span", { className: "dshd-dot " + dotClassOf(stX) + (stX === "approval" || stX === "question" || stX === "plan" ? " dshd-dot-attention" : "") }),
								react.createElement("span", { className: "dshd-sticky-name" }, s.displayTitle || s.id),
								isUnread(s, current) ? react.createElement("span", { className: "dshd-new" }, "NEW") : null,
								prog ? react.createElement("span", { className: "dshd-progress dshd-sticky-prog" }, react.createElement("span", { style: { width: prog.pct + "%" } })) : null,
								react.createElement("span", { className: "dshd-sticky-meta" }, act > 0 ? act + " jobs" : formatTime(s.updatedAt, now[0]))
							);
						})
				)
			);
		}
		//#endregion

		//#region DashboardPanel — shell.overlay entry (full upgraded UI)
		function DashboardPanel(props) {
			const open = useOpen();
			const { useSessions, useWorkspaces, openSession } = props;
			const ids = useSessions((s) => s.ids);
			const byId = useSessions((s) => s.byId);
			const jobsBySession = useSessions((s) => s.jobsBySession || EMPTY_OBJ);
			const subagentsByParent = useSessions((s) => s.subagentsByParent || EMPTY_OBJ);
			const current = useSessions((s) => s.current);
			const wsState = useWorkspaces((s) => s);
			const now = react.useState(() => Date.now());
			const [sidebarWidth, setSidebarWidth] = react.useState(0);
			const [search, setSearch] = react.useState("");
			const [filter, setFilter] = react.useState("all");
			const [detailId, setDetailId] = react.useState(null);
			const [expandedSections, setExpandedSections] = react.useState({ approval: true, input: true, running: true, error: true, completed: true, idle: true, ws: true, jobs: true, tree: true });
			const [expandedTree, setExpandedTree] = react.useState({});
			const lastCurrent = react.useRef(current);
			react.useEffect(() => {
				if (!open) return;
				const measure = () => {
					const layer = document.querySelector("[data-shell-overlay]");
					const frame = layer && layer.parentElement;
					const col = frame && frame.firstElementChild;
					if (col) setSidebarWidth(Math.ceil(col.getBoundingClientRect().width));
				};
				measure();
				const timer = setInterval(() => now[1](Date.now()), 5000);
				const ro = new ResizeObserver(measure);
				const frame = document.querySelector("[data-shell-overlay]")?.parentElement || null;
				if (frame) ro.observe(frame);
				window.addEventListener("resize", measure);
				return () => { clearInterval(timer); ro.disconnect(); window.removeEventListener("resize", measure); };
			}, [open]);
			react.useEffect(() => {
				const changed = lastCurrent.current !== current;
				lastCurrent.current = current;
				if (changed && open) setOpen(false);
			}, [open, current]);
			const currentUpdatedAt = current && byId[current] ? (byId[current].updatedAt || 0) : 0;
			react.useEffect(() => {
				if (current) markRead(current);
			}, [current, currentUpdatedAt]);
			react.useEffect(() => {
				if (!open) return;
				const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
				window.addEventListener("keydown", onKey);
				return () => window.removeEventListener("keydown", onKey);
			}, [open]);
			react.useEffect(() => {
				if (!open) return;
				const onPointerDown = (e) => {
					const t = e.target;
					if (t && t.closest && (t.closest(".dshd-overlay") || t.closest(".dshd-trigger") || t.closest(".dshd-sticky") || t.closest(".dshd-sticky-pill"))) return;
					setOpen(false);
				};
				document.addEventListener("pointerdown", onPointerDown, true);
				return () => document.removeEventListener("pointerdown", onPointerDown, true);
			}, [open]);
			if (!open) return null;
			const sessions = ids.map((id) => byId[id]).filter(Boolean);
			const running = sessions.filter((s) => s.running).length;
			const completed = sessions.filter((s) => s.completed).length;
			const stOf = (s) => statusOf(s, jobsBySession[s.id]);
			const stCount = {};
			for (const s of sessions) { const st = stOf(s); stCount[st] = (stCount[st] || 0) + 1; }
			const approvalCount = stCount.approval || 0;
			const inputCount = (stCount.question || 0) + (stCount.plan || 0);
			const errorCount = stCount.error || 0;
			const allJobs = Object.values(jobsBySession).reduce((n, jobs) => n + (Array.isArray(jobs) ? jobs.length : 0), 0);
			const activeJobs = Object.values(jobsBySession).reduce((n, jobs) => n + liveJobs(jobs), 0);
			const failedJobs = Object.values(jobsBySession).reduce((n, jobs) => n + (Array.isArray(jobs) ? jobs.filter((j) => j.status === "failed").length : 0), 0);
			const liveJobCount = Object.values(jobsBySession).reduce((n, jobs) => n + (Array.isArray(jobs) ? jobs.filter((j) => j && (j.status === "running" || j.status === "stopping")).length : 0), 0);
			// aggregate stats across sessions
			let agg = { turns: 0, steps: 0, llmMs: 0, toolMs: 0, ttftMs: 0, ttftSteps: 0, decodeMs: 0, decodeTokens: 0 };
			for (const s of sessions) {
				const st = statsOf(s);
				if (!st) continue;
				for (const k of Object.keys(agg)) if (typeof st[k] === "number") agg[k] += st[k];
			}
			const query = search.trim().toLowerCase();
			const visible = sessions.filter((s) => {
				const st = stOf(s);
				const family = st === "question" || st === "plan" ? "input" : st;
				if (filter !== "all" && family !== filter) return false;
				if (!query) return true;
				return (s.displayTitle || "").toLowerCase().includes(query)
					|| (s.cwd || "").toLowerCase().includes(query)
					|| (s.agentPreset || "").toLowerCase().includes(query)
					|| s.id.toLowerCase().includes(query);
			});
			const byStatus = {
				approval: visible.filter((s) => stOf(s) === "approval"),
				input: visible.filter((s) => stOf(s) === "question" || stOf(s) === "plan"),
				running: visible.filter((s) => stOf(s) === "running"),
				error: visible.filter((s) => stOf(s) === "error"),
				completed: visible.filter((s) => stOf(s) === "completed"),
				idle: visible.filter((s) => stOf(s) === "idle")
			};
			// workspace grouping (guarded — useWorkspaces may not be provided)
			const wsItems = wsState && Array.isArray(wsState.items) ? wsState.items : [];
			const selectedDetail = detailId ? byId[detailId] : null;
			return react.createElement(
				"div",
				{ className: "dshd-overlay", style: { left: sidebarWidth }, role: "dialog", "aria-label": "Session dashboard" },
				react.createElement(
					"div",
					{ className: "dshd-header" },
					react.createElement(primitives.IconDataOutline16, null),
					react.createElement("span", { className: "dshd-title" }, "Session Dashboard"),
					react.createElement("button", { type: "button", className: "dshd-icon-btn", title: "Close", onClick: () => setOpen(false) }, react.createElement(primitives.IconCloseFill14, null))
				),
				react.createElement(
					"div",
					{ className: "dshd-body" },
					// KPI cards
					react.createElement(
						"div",
						{ className: "dshd-cards" },
						statCard(String(sessions.length), "Total sessions"),
						statCard(String(running), "Running"),
						statCard(String(completed), "Completed"),
						statCard(String(approvalCount), "Waiting for approval"),
						statCard(String(activeJobs) + "/" + String(allJobs), "Jobs active/total"),
						statCard(String(failedJobs), "Errored jobs (crashed)"),
						statCard(String(agg.turns), "Total turns"),
						statCard(String(agg.steps), "Total steps"),
						statCard(formatTokens(agg.decodeTokens), "Decode tokens"),
						statCard(formatDuration(agg.llmMs), "LLM time"),
						statCard(formatDuration(agg.toolMs), "Tool time"),
						statCard(formatDuration(agg.ttftMs), "TTFT total")
					),
					// toolbar: search + filters
					react.createElement(
						"div",
						{ className: "dshd-toolbar" },
						react.createElement("input", {
							className: "dshd-search",
							type: "search",
							placeholder: "Search title, cwd, preset...",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						}),
						filterChip("all", "All", sessions.length, filter, setFilter),
						filterChip("running", "Running", running, filter, setFilter),
						filterChip("approval", "Approval", approvalCount, filter, setFilter),
						filterChip("input", "Needs input", inputCount, filter, setFilter),
						filterChip("error", "Errors", errorCount, filter, setFilter),
						filterChip("completed", "Completed", completed, filter, setFilter),
						filterChip("idle", "Idle", stCount.idle || 0, filter, setFilter)
					),
					// workspace grouping
					wsItems.length > 0
						? react.createElement("div", { className: "dshd-section" },
							react.createElement("div", { className: "dshd-section-head", onClick: () => setExpandedSections({ ...expandedSections, ws: !expandedSections.ws }) },
								react.createElement("span", { className: "dshd-section-title" }, "Workspaces"),
								react.createElement("span", { className: "dshd-section-count" }, expandedSections.ws !== false ? "\u25be" : "\u25b8")
							),
							expandedSections.ws !== false
								? react.createElement("div", { className: "dshd-ws-group" },
									wsItems.map((w) => {
										const wids = Array.isArray(w.sessionIds) ? w.sessionIds.filter((sid) => byId[sid]) : [];
										if (wids.length === 0) return null;
										return react.createElement(
											"div",
											{ key: w.workspaceId, className: "dshd-ws-item" },
											react.createElement("div", { className: "dshd-ws-head", onClick: () => setExpandedTree({ ...expandedTree, ["ws:" + w.workspaceId]: !expandedTree["ws:" + w.workspaceId] }) },
												react.createElement("span", { className: "dshd-caret" }, expandedTree["ws:" + w.workspaceId] ? "\u25be" : "\u25b8"),
												react.createElement("span", null, w.title || w.path || w.workspaceId),
												react.createElement("span", { className: "dshd-mono" }, wids.length + " sessions")
											),
											expandedTree["ws:" + w.workspaceId]
												? react.createElement("table", { className: "dshd-table" }, react.createElement("tbody", null,
													wids.map((sid) => {
														const s = byId[sid];
														return sessionRow(s, jobsBySession[sid] || [], current, () => setDetailId(sid), openSession, now[0]);
													})
												))
												: null
										);
									})
								)
								: null
						)
						: null,
					// sections: approval / input / running / error / completed / idle (empty ones hidden)
					byStatus.approval.length > 0 ? section("Waiting for approval", "approval", byStatus.approval, "dshd-dot-approval", expandedSections, setExpandedSections, current, jobsBySession, setDetailId, openSession, now[0]) : null,
					byStatus.input.length > 0 ? section("Needs input", "input", byStatus.input, "dshd-dot-question", expandedSections, setExpandedSections, current, jobsBySession, setDetailId, openSession, now[0]) : null,
					byStatus.running.length > 0 ? section("Running", "running", byStatus.running, "dshd-dot-running", expandedSections, setExpandedSections, current, jobsBySession, setDetailId, openSession, now[0]) : null,
					byStatus.error.length > 0 ? section("Errors", "error", byStatus.error, "dshd-dot-error", expandedSections, setExpandedSections, current, jobsBySession, setDetailId, openSession, now[0]) : null,
					byStatus.completed.length > 0 ? section("Completed", "completed", byStatus.completed, "dshd-dot-completed", expandedSections, setExpandedSections, current, jobsBySession, setDetailId, openSession, now[0]) : null,
					byStatus.idle.length > 0 ? section("Idle", "idle", byStatus.idle, "dshd-dot-idle", expandedSections, setExpandedSections, current, jobsBySession, setDetailId, openSession, now[0]) : null,
					// job activity feed
					react.createElement("div", { className: "dshd-section" },
						react.createElement("div", { className: "dshd-section-head", onClick: () => setExpandedSections({ ...expandedSections, jobs: !expandedSections.jobs }) },
							react.createElement("span", { className: "dshd-section-title" }, "Job activity"),
							react.createElement("span", { className: "dshd-section-count" }, String(liveJobCount)),
							react.createElement("span", { className: "dshd-section-count" }, expandedSections.jobs !== false ? "\u25be" : "\u25b8")
						),
						expandedSections.jobs !== false
							? react.createElement(JobFeed, { jobsBySession, byId, openSession, max: 12 })
							: null
					),
					// subagent tree
					react.createElement("div", { className: "dshd-section" },
						react.createElement("div", { className: "dshd-section-head", onClick: () => setExpandedSections({ ...expandedSections, tree: !expandedSections.tree }) },
							react.createElement("span", { className: "dshd-section-title" }, "Session hierarchy"),
							react.createElement("span", { className: "dshd-section-count" }, expandedSections.tree !== false ? "\u25be" : "\u25b8")
						),
						expandedSections.tree !== false
							? react.createElement(SessionTree, { subagentsByParent, byId, openSession, expanded: expandedTree, onToggle: (pid) => setExpandedTree({ ...expandedTree, [pid]: !expandedTree[pid] }) })
							: null
					),
					// detail drawer
					selectedDetail
						? react.createElement(SessionDetail, { session: selectedDetail, jobs: jobsBySession[selectedDetail.id] || [], onClose: () => setDetailId(null), openSession })
						: null
				)
			);
		}
		function statCard(value, label) {
			return react.createElement(
				"div",
				{ className: "dshd-card" },
				react.createElement("div", { className: "dshd-card-value" }, value),
				react.createElement("div", { className: "dshd-card-label" }, label)
			);
		}
		function filterChip(id, label, count, active, setActive) {
			return react.createElement(
				"button",
				{ type: "button", className: "dshd-chip" + (active === id ? " dshd-chip-on" : ""), onClick: () => setActive(active === id ? "all" : id) },
				label,
				react.createElement("span", { className: "dshd-chip-count" }, String(count))
			);
		}
		function section(title, key, items, dotClass, expanded, setExpanded, current, jobsBySession, setDetailId, openSession, nowTs) {
			const isOpen = expanded[key] !== false;
			return react.createElement(
				"div",
				{ className: "dshd-section" },
				react.createElement("div", { className: "dshd-section-head", onClick: () => setExpanded({ ...expanded, [key]: !isOpen }) },
					react.createElement("span", { className: "dshd-dot " + dotClass }),
					react.createElement("span", { className: "dshd-section-title" }, title),
					react.createElement("span", { className: "dshd-section-meta" }, react.createElement("span", { className: "dshd-section-count" }, String(items.length)), react.createElement("span", { className: "dshd-caret" }, isOpen ? "\u25be" : "\u25b8"))
				),
				isOpen
					? react.createElement(
						"table",
						{ className: "dshd-table" },
						react.createElement("thead", null, react.createElement("tr", null,
							react.createElement("th", { className: "dshd-col-status" }, "Status"),
							react.createElement("th", { className: "dshd-col-session" }, "Session"),
							react.createElement("th", { className: "dshd-col-preset" }, "Preset"),
							react.createElement("th", { className: "dshd-col-tasks" }, "Tasks"),
							react.createElement("th", { className: "dshd-col-jobs" }, "Jobs"),
							react.createElement("th", { className: "dshd-col-updated" }, "Updated")
						)),
						react.createElement("tbody", null,
							items.length === 0
								? react.createElement("tr", null, react.createElement("td", { colSpan: 6, className: "dshd-empty" }, "None"))
								: items.map((s) => sessionRow(s, jobsBySession[s.id] || [], current, () => setDetailId(s.id), openSession, nowTs))
						)
					)
					: null
			);
		}
		function sessionRow(s, jobs, current, onDetail, openSession, nowTs) {
			const prog = todoProgress(s.projectionValues);
			const jobsCount = jobs.length;
			const activeJobs = liveJobs(jobs);
			const st = statusOf(s, jobs);
			return react.createElement(
				"tr",
				{
					key: s.id,
					className: "dshd-row" + (s.id === current ? " dshd-row-current" : "") + (st === "approval" ? " dshd-row-approval" : st === "question" ? " dshd-row-question" : st === "plan" ? " dshd-row-plan" : ""),
					onClick: () => {
						setOpen(false);
						try { openSession(s.id); } catch (e) { console.warn("dashboard: openSession failed", e); }
					},
					onDoubleClick: (e) => { e.stopPropagation(); onDetail(); }
				},
				react.createElement("td", null, react.createElement("span", { className: "dshd-status " + statusClass(st) },
					react.createElement("span", { className: "dshd-dot " + dotClassOf(st) + (st === "approval" || st === "question" || st === "plan" ? " dshd-dot-attention" : "") }),
					statusLabel(st)
				)),
				react.createElement("td", null,
					react.createElement("div", { className: "dshd-sess-title" }, s.displayTitle || s.id, isUnread(s, current) ? react.createElement("span", { className: "dshd-new", style: { marginLeft: 6 } }, "NEW") : null),
					react.createElement("div", { className: "dshd-sess-sub" }, s.cwd || "")
				),
				react.createElement("td", { className: "dshd-mono" }, s.agentPreset || "\u2014"),
				react.createElement("td", null, prog
					? react.createElement(react.Fragment, null,
						react.createElement("span", { className: "dshd-progress" }, react.createElement("span", { style: { width: prog.pct + "%" } })),
						react.createElement("span", { className: "dshd-mono", style: { marginLeft: 6 } }, prog.done + "/" + prog.total))
					: react.createElement("span", { className: "dshd-mono" }, "\u2014")),
				react.createElement("td", { className: "dshd-mono" }, jobsCount > 0 ? (activeJobs > 0 ? activeJobs + "/" + jobsCount : String(jobsCount)) : "\u2014"),
				react.createElement("td", { className: "dshd-mono" }, formatTime(s.updatedAt, nowTs))
			);
		}
		//#endregion

		//#region apply — client plugin face: 3 slot registrations, sessions + slots services
		const inject = [
			"sessions",
			"slots"
		];
		function apply(ctx) {
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "dashboard-trigger",
				order: 100
			}, DashboardTrigger));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dashboard-panel",
				order: 10,
				inject: () => ({ openSession: (id) => { ctx.sessions.open(id); } })
			}, DashboardPanel));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dashboard-sticky",
				order: 20,
				inject: () => ({ openSession: (id) => { ctx.sessions.open(id); } })
			}, StickyWidget));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});