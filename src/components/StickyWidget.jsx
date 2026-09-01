import { useEffect, useRef, useState } from "react";
import { IconCloseFill14 } from "@deepseek-ai/dsh-client-ui-primitives";
import { EMPTY_OBJ, formatTime, liveJobs, sessionDotClass, sessionRowClass, statusOf, todoProgress, useNow } from "../helpers.js";
import { isUnread, setSticky, useSticky } from "../stores.js";
import { NotifyBell } from "./NotifyToasts.jsx";

const STICKY_POS_KEY = "dshd-sticky-pos";
const STICKY_WIDTH = 340;

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

/** Position the sticky just left of the Session log header button. */
function defaultPosNearSessionLog() {
	try {
		const btn = findSessionLogBtn();
		if (!btn) return null;
		const rect = btn.getBoundingClientRect();
		const x = Math.max(8, rect.left - 8 - STICKY_WIDTH);
		const y = Math.max(8, rect.top - 12);
		return { x, y };
	} catch {
		return null;
	}
}

/**
 * shell.overlay entry: the floating live summary, independent of the panel.
 * Mounts only while sticky is enabled; the minimized pill keeps ticking.
 * Defaults to just left of the Session log header button; the pill and the
 * popup are draggable (drag the header), moving directly on the DOM node
 * for a smooth frame-aligned feel, and the position persists across reloads.
 */
export function StickyWidget({ useSessions, openSession }) {
	const sticky = useSticky();
	const ids = useSessions((s) => s.ids);
	const byId = useSessions((s) => s.byId);
	const current = useSessions((s) => s.current);
	const jobsBySession = useSessions((s) => s.jobsBySession || EMPTY_OBJ);
	const now = useNow(5000);
	const [minimized, setMinimized] = useState(false);
	const [pos, setPos] = useState(loadStickyPos);
	const posRef = useRef(pos);
	const rootRef = useRef(null);
	const dragRef = useRef(null);
	const movedRef = useRef(false);

	// Seed the default position beside the Session log button only when the
	// user has never dragged the widget.
	useEffect(() => {
		if (posRef.current) return;
		const d = defaultPosNearSessionLog();
		if (d) { posRef.current = d; setPos(d); }
	}, []);

	if (!sticky) return null;

	const endDrag = () => {
		const d = dragRef.current;
		if (!d) return;
		dragRef.current = null;
		const x = Math.round(parseFloat(d.el.style.left) || d.baseX);
		const y = Math.round(parseFloat(d.el.style.top) || d.baseY);
		const p = { x, y };
		posRef.current = p;
		setPos(p);
		try { localStorage.setItem(STICKY_POS_KEY, JSON.stringify(p)); } catch {}
	};
	const onDragStart = (e) => {
		if (e.button !== 0 && e.pointerType === "mouse") return;
		if (e.target.closest && e.target.closest("button")) return;
		const el = rootRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: rect.left, baseY: rect.top, el, pointerId: e.pointerId };
		movedRef.current = false;
		if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch {} }
		e.preventDefault();
	};
	const onDragMove = (e) => {
		const d = dragRef.current;
		if (!d) return;
		// Only move while the primary button is actually held down.
		if (!(e.buttons & 1)) { endDrag(); return; }
		const dx = e.clientX - d.startX;
		const dy = e.clientY - d.startY;
		if (Math.abs(dx) + Math.abs(dy) > 4) movedRef.current = true;
		const maxX = Math.max(8, window.innerWidth - d.el.offsetWidth - 8);
		const maxY = Math.max(8, window.innerHeight - d.el.offsetHeight - 8);
		const x = Math.max(8, Math.min(maxX, d.baseX + dx));
		const y = Math.max(8, Math.min(maxY, d.baseY + dy));
		// Direct style mutation \u2014 frame-smooth, no React re-render per move.
		d.el.style.left = x + "px";
		d.el.style.top = y + "px";
	};
	const onDragEnd = (e) => {
		const d = dragRef.current;
		if (d && d.el.releasePointerCapture) { try { d.el.releasePointerCapture(e.pointerId); } catch {} }
		endDrag();
		setTimeout(() => { movedRef.current = false; }, 0);
	};
	const posStyle = pos ? { left: pos.x + "px", top: pos.y + "px" } : undefined;
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
			<div ref={rootRef} className={"dshd-sticky-pill" + (attentionCount > 0 ? " dshd-pill-attn" : "")} style={posStyle}
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
		<div ref={rootRef} className="dshd-sticky" role="dialog" aria-label="Sticky dashboard" style={posStyle}>
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