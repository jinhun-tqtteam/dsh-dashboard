import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { IconCloseFill14 } from "@deepseek-ai/dsh-client-ui-primitives";
import { EMPTY_OBJ, formatTime, liveJobs, sessionDotClass, sessionRowClass, statusOf, todoProgress, useNow } from "../helpers.js";
import { isUnread, setSticky, useSticky } from "../stores.js";
import { NotifyBell } from "./NotifyToasts.jsx";

const STICKY_POS_KEY = "dshd-sticky-pos";

function loadStickyPos() {
	try {
		const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STICKY_POS_KEY) : null;
		if (!raw) return null;
		const p = JSON.parse(raw);
		if (typeof p.x === "number" && typeof p.y === "number") return p;
	} catch {}
	return null;
}

function findSessionLogBtn() {
	try {
		const buttons = document.querySelectorAll("button");
		for (const btn of buttons) {
			if (btn.textContent && btn.textContent.includes("Session log")) return btn;
		}
	} catch {}
	return null;
}

/**
 * shell.overlay entry: the floating live summary, independent of the panel.
 *
 * Placement (auto mode, before any manual drag): the minimized pill sits
 * just LEFT of the Session log header button, vertically centered on the
 * same row; the expanded popup hangs DOWN from the top bar (below the
 * Session log button) so it never covers it. Dragging switches to a custom
 * position persisted in localStorage; on window resize / layout shrink the
 * active position is re-clamped so the widget always stays inside the
 * viewport instead of getting pushed off-screen.
 *
 * Drag mechanics: the pointer offset is applied as a CSS transform on the
 * DOM node directly \u2014 composited and frame-smooth, and React state can
 * never overwrite it mid-drag. On release the final box position commits
 * to state + storage and the transform resets.
 */
export function StickyWidget({ useSessions, openSession }) {
	const sticky = useSticky();
	const ids = useSessions((s) => s.ids);
	const byId = useSessions((s) => s.byId);
	const current = useSessions((s) => s.current);
	const jobsBySession = useSessions((s) => s.jobsBySession || EMPTY_OBJ);
	const now = useNow(5000);
	const [minimized, setMinimized] = useState(false);
	const [custom, setCustom] = useState(loadStickyPos); // null = auto anchor mode
	const customRef = useRef(custom);
	const [style, setStyle] = useState(null);
	const rootRef = useRef(null);
	const dragRef = useRef(null);
	const movedRef = useRef(false);
	const [, forceTick] = useState(0);

	// Window resizes (and any layout change we can observe) re-run placement.
	useEffect(() => {
		const onChange = () => forceTick((t) => t + 1);
		window.addEventListener("resize", onChange);
		return () => window.removeEventListener("resize", onChange);
	}, []);

	// Placement runs after every render but BEFORE paint: measure the real
	// element + the Session log button, then position. Bail out of setState
	// when nothing changed so this never loops.
	useLayoutEffect(() => {
		const el = rootRef.current;
		if (custom) {
			// Custom (dragged) mode: keep the box inside the viewport.
			const w = el ? el.offsetWidth : 340;
			const h = el ? el.offsetHeight : 60;
			const maxX = Math.max(8, window.innerWidth - w - 8);
			const maxY = Math.max(8, window.innerHeight - h - 8);
			const x = Math.min(Math.max(8, custom.x), maxX);
			const y = Math.min(Math.max(8, custom.y), maxY);
			if (x !== custom.x || y !== custom.y) {
				const p = { x, y };
				customRef.current = p;
				setCustom(p);
				try { localStorage.setItem(STICKY_POS_KEY, JSON.stringify(p)); } catch {}
			}
			setStyle((prev) => (prev && prev.left === x + "px" && prev.top === y + "px") ? prev : { left: x + "px", top: y + "px" });
			return;
		}
		// Auto mode: anchor relative to the Session log button.
		const btn = findSessionLogBtn();
		if (!btn || !el) { setStyle(null); return; }
		const r = btn.getBoundingClientRect();
		// Right edge 8px left of the button for both pill and popup.
		const right = Math.max(8, window.innerWidth - r.left + 8);
		const isPill = el.classList.contains("dshd-sticky-pill");
		let top;
		if (isPill) {
			// Vertically centered on the Session log row.
			top = Math.max(8, r.top + r.height / 2 - el.offsetHeight / 2);
		} else {
			// Popup hangs below the top bar so it never covers the button.
			top = Math.min(Math.max(8, window.innerHeight - el.offsetHeight - 8), r.bottom + 8);
		}
		setStyle((prev) => (prev && prev.right === right + "px" && prev.top === top + "px") ? prev : { right: right + "px", top: top + "px", left: "auto" });
	});

	if (!sticky) return null;

	const endDrag = (e) => {
		const d = dragRef.current;
		if (!d) return;
		dragRef.current = null;
		d.el.style.transform = ""; // commit the visual offset to state
		let dx = 0, dy = 0;
		if (e) { dx = e.clientX - d.startX; dy = e.clientY - d.startY; }
		const p = {
			x: Math.round(Math.max(8, Math.min(window.innerWidth - d.el.offsetWidth - 8, d.baseX + dx))),
			y: Math.round(Math.max(8, Math.min(window.innerHeight - d.el.offsetHeight - 8, d.baseY + dy)))
		};
		customRef.current = p;
		setCustom(p);
		try { localStorage.setItem(STICKY_POS_KEY, JSON.stringify(p)); } catch {}
		if (d.el.releasePointerCapture) { try { d.el.releasePointerCapture(e && e.pointerId); } catch {} }
		setTimeout(() => { movedRef.current = false; }, 0);
	};
	const onDragStart = (e) => {
		if (e.button !== 0 && e.pointerType === "mouse") return;
		if (e.target.closest && e.target.closest("button")) return;
		const el = rootRef.current;
		if (!el) return;
		el.style.transform = ""; // clear any leftover translate
		const rect = el.getBoundingClientRect();
		dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: rect.left, baseY: rect.top, el, pointerId: e.pointerId };
		movedRef.current = false;
		if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch {} }
		e.preventDefault();
	};
	const onDragMove = (e) => {
		const d = dragRef.current;
		if (!d) return;
		// Move only while the primary button is actually held down.
		if (!(e.buttons & 1)) { endDrag(e); return; }
		const dx = e.clientX - d.startX;
		const dy = e.clientY - d.startY;
		if (Math.abs(dx) + Math.abs(dy) > 4) movedRef.current = true;
		// CSS transform: composited, no reflow, React never overrides it mid-drag.
		d.el.style.transform = "translate(" + dx + "px," + dy + "px)";
	};
	const onDragEnd = (e) => { endDrag(e); };
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0);
	const sessions = ids.map((id) => byId[id]).filter(Boolean);
	const runningCount = sessions.filter((s) => s.running).length;
	const activeJobs = Object.values(jobsBySession).reduce((n, jobs) => n + liveJobs(jobs), 0);
	const todays = sessions.filter((s) => (s.updatedAt || 0) >= startOfToday.getTime());
	const unreadCount = todays.filter((s) => isUnread(s, current)).length;
	const failedJobs = todays.filter((s) => { const jobs = jobsBySession[s.id]; return Array.isArray(jobs) && jobs.some((j) => j && j.status === "failed"); }).length;
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

	const dragProps = { onPointerDown: onDragStart, onPointerMove: onDragMove, onPointerUp: onDragEnd, onPointerCancel: onDragEnd };
	if (minimized) {
		return (
			<div ref={rootRef} className={"dshd-sticky-pill" + (attentionCount > 0 ? " dshd-pill-attn" : "")} style={style || undefined}
				title="Expand sticky dashboard (drag to move)"
				onClick={() => { if (!movedRef.current) setMinimized(false); }}
				{...dragProps}>
				<span className={"dshd-dot " + (attentionCount > 0 ? "dshd-dot-approval dshd-dot-attention" : runningCount > 0 ? "dshd-dot-running" : "dshd-dot-idle")} />
				{unreadCount > 0 ? <span className="dshd-new">{unreadCount + " NEW"}</span> : null}
				{attentionCount > 0 ? <span className="dshd-wait">{attentionCount + " waiting"}</span> : null}
				<span>{runningCount + " running"}</span>
				{activeJobs > 0 ? <span className="dshd-sticky-meta">{activeJobs + " jobs"}</span> : null}
			</div>
		);
	}
	return (
		<div ref={rootRef} className="dshd-sticky" role="dialog" aria-label="Sticky dashboard" style={style || undefined}>
			<div className="dshd-sticky-head" {...dragProps}>
				<span className={"dshd-dot " + (runningCount > 0 ? "dshd-dot-running" : "dshd-dot-idle")} />
				<span className="dshd-sticky-title">Live summary</span>
				<span className="dshd-sticky-meta">
					{(unreadCount > 0 ? unreadCount + " new \u00b7 " : "") + runningCount + "/" + sessions.length + " running"
					+ (attentionCount > 0 ? " \u00b7 " + attentionCount + " waiting" : "")
					+ (activeJobs > 0 ? " \u00b7 " + activeJobs + " jobs" : "")
					+ (failedJobs > 0 ? " \u00b7 " + failedJobs + " errored" : "")}
				</span>
				<NotifyBell />
				<button type="button" className="dshd-icon-btn" title="Minimize" onClick={() => setMinimized(true)}>
					<span style={{ fontSize: 12, lineHeight: 1 }}>{"\u2013"}</span>
				</button>
				<button type="button" className="dshd-icon-btn" title="Turn off sticky dashboard" onClick={() => setSticky(false)}>
					<IconCloseFill14 />
				</button>
			</div>
			<div className="dshd-sticky-body">
				{ordered.length === 0 ? (
					<div className="dshd-sticky-empty">No sessions active today.</div>
				) : ordered.map((s) => {
					const prog = todoProgress(s.projectionValues);
					const jobs = jobsBySession[s.id] || [];
					const act = liveJobs(jobs);
					const stX = statusOf(s, jobs);
					return (
						<div key={s.id} className={"dshd-sticky-row" + sessionRowClass(stX)} onClick={() => { try { openSession(s.id); } catch {} }} title="Open session">
							<span className={sessionDotClass(stX)} />
							<span className="dshd-sticky-name">{s.displayTitle || s.id}</span>
							{isUnread(s, current) ? <span className="dshd-new">NEW</span> : null}
							{prog ? <span className="dshd-progress dshd-sticky-prog"><span style={{ width: prog.pct + "%" }} /></span> : null}
							<span className="dshd-sticky-meta">{act > 0 ? act + " jobs" : formatTime(s.updatedAt, now)}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}