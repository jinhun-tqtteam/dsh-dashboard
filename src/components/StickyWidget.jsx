import { useState } from "react";
import { IconCloseFill14 } from "@deepseek-ai/dsh-client-ui-primitives";
import { EMPTY_OBJ, formatTime, formatTokens, liveJobs, sessionDotClass, sessionRowClass, statusOf, todoProgress, usageTotals, useNow } from "../helpers.js";
import { isUnread, setSticky, useSticky } from "../stores.js";

/**
 * shell.overlay entry: the floating live summary, independent of the panel.
 * Mounts only while sticky is enabled; the minimized pill keeps ticking.
 */
export function StickyWidget({ useSessions, openSession }) {
	const sticky = useSticky();
	const ids = useSessions((s) => s.ids);
	const byId = useSessions((s) => s.byId);
	const current = useSessions((s) => s.current);
	const jobsBySession = useSessions((s) => s.jobsBySession || EMPTY_OBJ);
	const now = useNow(5000);
	const [minimized, setMinimized] = useState(false);
	if (!sticky) return null;
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0);
	const sessions = ids.map((id) => byId[id]).filter(Boolean);
	const runningCount = sessions.filter((s) => s.running).length;
	const activeJobs = Object.values(jobsBySession).reduce((n, jobs) => n + liveJobs(jobs), 0);
	const todays = sessions.filter((s) => (s.updatedAt || 0) >= startOfToday.getTime());
	const unreadCount = todays.filter((s) => isUnread(s, current)).length;
	const failedJobs = todays.filter((s) => { const jobs = jobsBySession[s.id]; return Array.isArray(jobs) && jobs.some((j) => j && j.status === "failed"); }).length;
	const tok = usageTotals(todays);
	const tokToday = tok.input + tok.output;
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
		return (
			<div className={"dshd-sticky-pill" + (attentionCount > 0 ? " dshd-pill-attn" : "")} onClick={() => setMinimized(false)} title="Expand sticky dashboard">
				<span className={"dshd-dot " + (attentionCount > 0 ? "dshd-dot-approval dshd-dot-attention" : runningCount > 0 ? "dshd-dot-running" : "dshd-dot-idle")} />
				{unreadCount > 0 ? <span className="dshd-new">{unreadCount + " NEW"}</span> : null}
				{attentionCount > 0 ? <span className="dshd-wait">{attentionCount + " waiting"}</span> : null}
				<span>{runningCount + " running"}</span>
				{activeJobs > 0 ? <span className="dshd-sticky-meta">{activeJobs + " jobs"}</span> : null}
				{tokToday > 0 ? <span className="dshd-sticky-meta">{formatTokens(tokToday) + " tok"}</span> : null}
			</div>
		);
	}
	return (
		<div className="dshd-sticky" role="dialog" aria-label="Sticky dashboard">
			<div className="dshd-sticky-head">
				<span className={"dshd-dot " + (runningCount > 0 ? "dshd-dot-running" : "dshd-dot-idle")} />
				<span className="dshd-sticky-title">Live summary</span>
				<span className="dshd-sticky-meta">
					{(unreadCount > 0 ? unreadCount + " new \u00b7 " : "") + runningCount + "/" + sessions.length + " running"
					+ (attentionCount > 0 ? " \u00b7 " + attentionCount + " waiting" : "")
					+ (activeJobs > 0 ? " \u00b7 " + activeJobs + " jobs" : "")
					+ (failedJobs > 0 ? " \u00b7 " + failedJobs + " errored" : "")
					+ (tokToday > 0 ? " \u00b7 " + formatTokens(tokToday) + " tok today" : "")}
				</span>
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