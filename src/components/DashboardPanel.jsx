import { useEffect, useRef, useState } from "react";
import { IconCloseFill14, IconDataOutline16 } from "@deepseek-ai/dsh-client-ui-primitives";
import { EMPTY_OBJ, formatDuration, formatTime, formatTokens, liveJobs, sessionDotClass, sessionRowClass, statusClass, statusLabel, statusOf, statsOf, todoProgress, useNow } from "../helpers.js";
import { isUnread, markRead, setOpen, useOpen } from "../stores.js";
import { JobFeed } from "./JobFeed.jsx";
import { SessionDetail } from "./SessionDetail.jsx";
import { SessionTree } from "./SessionTree.jsx";

const EMPTY_LIST = [];

function StatCard({ value, label }) {
	return (
		<div className="dshd-card">
			<div className="dshd-card-value">{value}</div>
			<div className="dshd-card-label">{label}</div>
		</div>
	);
}

function FilterChip({ id, label, count, active, setActive }) {
	return (
		<button type="button" className={"dshd-chip" + (active === id ? " dshd-chip-on" : "")} onClick={() => setActive(active === id ? "all" : id)}>
			{label}
			<span className="dshd-chip-count">{String(count)}</span>
		</button>
	);
}

function SessionRow({ s, jobs, current, onDetail, openSession, nowTs }) {
	const prog = todoProgress(s.projectionValues);
	const jobsCount = jobs.length;
	const activeJobs = liveJobs(jobs);
	const st = statusOf(s, jobs);
	return (
		<tr
			className={"dshd-row" + (s.id === current ? " dshd-row-current" : "") + sessionRowClass(st)}
			onClick={() => {
				setOpen(false);
				try { openSession(s.id); } catch (e) { console.warn("dashboard: openSession failed", e); }
			}}
			onDoubleClick={(e) => { e.stopPropagation(); onDetail(); }}
		>
			<td>
				<span className={"dshd-status " + statusClass(st)}>
					<span className={sessionDotClass(st)} />
					{statusLabel(st)}
				</span>
			</td>
			<td>
				<div className="dshd-sess-title">
					{s.displayTitle || s.id}
					{isUnread(s, current) ? <span className="dshd-new" style={{ marginLeft: 6 }}>NEW</span> : null}
				</div>
				<div className="dshd-sess-sub">{s.cwd || ""}</div>
			</td>
			<td className="dshd-mono">{s.agentPreset || "\u2014"}</td>
			<td>
				{prog ? (
					<>
						<span className="dshd-progress"><span style={{ width: prog.pct + "%" }} /></span>
						<span className="dshd-mono" style={{ marginLeft: 6 }}>{prog.done + "/" + prog.total}</span>
					</>
				) : (
					<span className="dshd-mono">{"\u2014"}</span>
				)}
			</td>
			<td className="dshd-mono">{jobsCount > 0 ? (activeJobs > 0 ? activeJobs + "/" + jobsCount : String(jobsCount)) : "\u2014"}</td>
			<td className="dshd-mono">{formatTime(s.updatedAt, nowTs)}</td>
		</tr>
	);
}

function StatusSection({ title, sectionKey, items, dotClass, expanded, setExpanded, current, jobsBySession, onDetail, openSession, nowTs }) {
	const isOpen = expanded[sectionKey] !== false;
	return (
		<div className="dshd-section">
			<div className="dshd-section-head" onClick={() => setExpanded({ ...expanded, [sectionKey]: !isOpen })}>
				<span className={"dshd-dot " + dotClass} />
				<span className="dshd-section-title">{title}</span>
				<span className="dshd-section-meta">
					<span className="dshd-section-count">{String(items.length)}</span>
					<span className="dshd-caret">{isOpen ? "\u25be" : "\u25b8"}</span>
				</span>
			</div>
			{isOpen ? (
				<table className="dshd-table">
					<thead>
						<tr>
							<th className="dshd-col-status">Status</th>
							<th className="dshd-col-session">Session</th>
							<th className="dshd-col-preset">Preset</th>
							<th className="dshd-col-tasks">Tasks</th>
							<th className="dshd-col-jobs">Jobs</th>
							<th className="dshd-col-updated">Updated</th>
						</tr>
					</thead>
					<tbody>
						{items.length === 0 ? (
							<tr><td colSpan={6} className="dshd-empty">None</td></tr>
						) : items.map((s) => (
							<SessionRow key={s.id} s={s} jobs={jobsBySession[s.id] || []} current={current} onDetail={() => onDetail(s.id)} openSession={openSession} nowTs={nowTs} />
						))}
					</tbody>
				</table>
			) : null}
		</div>
	);
}

/**
 * shell.overlay entry. Two-layer on purpose: this gate subscribes only to
 * the open flag plus two primitive session selectors (for global read
 * tracking), while the heavy list/workspace subscriptions live in the body
 * and mount exclusively while the panel is open.
 */
export function DashboardPanel(props) {
	const { useSessions } = props;
	const open = useOpen();
	const current = useSessions((s) => s.current);
	const currentUpdatedAt = useSessions((s) => {
		const row = s.current && s.byId[s.current];
		return row ? row.updatedAt || 0 : 0;
	});
	useEffect(() => {
		if (current) markRead(current);
	}, [current, currentUpdatedAt]);
	if (!open) return null;
	return <DashboardPanelBody {...props} />;
}

function DashboardPanelBody({ useSessions, useWorkspaces, openSession }) {
	const snap = useSessions((s) => s);
	const wsItems = useWorkspaces((s) => (s && Array.isArray(s.items) ? s.items : EMPTY_LIST));
	const now = useNow(5000);
	const [sidebarWidth, setSidebarWidth] = useState(0);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");
	const [detailId, setDetailId] = useState(null);
	const [expandedSections, setExpandedSections] = useState({ approval: true, input: true, running: true, error: true, completed: true, idle: true, ws: true, jobs: true, tree: true });
	const [expandedTree, setExpandedTree] = useState({});
	const lastCurrent = useRef(snap.current);

	// Auto-close when the user switches away to another session.
	useEffect(() => {
		const changed = lastCurrent.current !== snap.current;
		lastCurrent.current = snap.current;
		if (changed) setOpen(false);
	}, [snap.current]);

	// Track the sidebar column so the overlay starts right of it.
	useEffect(() => {
		const measure = () => {
			const layer = document.querySelector("[data-shell-overlay]");
			const frame = layer && layer.parentElement;
			const col = frame && frame.firstElementChild;
			if (col) setSidebarWidth(Math.ceil(col.getBoundingClientRect().width));
		};
		measure();
		const ro = new ResizeObserver(measure);
		const frame = document.querySelector("[data-shell-overlay]")?.parentElement || null;
		if (frame) ro.observe(frame);
		window.addEventListener("resize", measure);
		return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
	}, []);

	useEffect(() => {
		const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => {
		const onPointerDown = (e) => {
			const t = e.target;
			if (t && t.closest && (t.closest(".dshd-overlay") || t.closest(".dshd-trigger") || t.closest(".dshd-sticky") || t.closest(".dshd-sticky-pill"))) return;
			setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown, true);
		return () => document.removeEventListener("pointerdown", onPointerDown, true);
	}, []);

	const { ids, byId, current, jobsBySession = EMPTY_OBJ, subagentsByParent = EMPTY_OBJ } = snap;
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
	const agg = { turns: 0, steps: 0, llmMs: 0, toolMs: 0, ttftMs: 0, ttftSteps: 0, decodeMs: 0, decodeTokens: 0 };
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
	const statusSections = [
		{ key: "approval", title: "Waiting for approval", items: byStatus.approval, dot: "dshd-dot-approval" },
		{ key: "input", title: "Needs input", items: byStatus.input, dot: "dshd-dot-question" },
		{ key: "running", title: "Running", items: byStatus.running, dot: "dshd-dot-running" },
		{ key: "error", title: "Errors", items: byStatus.error, dot: "dshd-dot-error" },
		{ key: "completed", title: "Completed", items: byStatus.completed, dot: "dshd-dot-completed" },
		{ key: "idle", title: "Idle", items: byStatus.idle, dot: "dshd-dot-idle" }
	];
	const selectedDetail = detailId ? byId[detailId] : null;
	return (
		<div className="dshd-overlay" style={{ left: sidebarWidth }} role="dialog" aria-label="Session dashboard">
			<div className="dshd-header">
				<IconDataOutline16 />
				<span className="dshd-title">Session Dashboard</span>
				<button type="button" className="dshd-icon-btn" title="Close" onClick={() => setOpen(false)}>
					<IconCloseFill14 />
				</button>
			</div>
			<div className="dshd-body">
				<div className="dshd-cards">
					<StatCard value={String(sessions.length)} label="Total sessions" />
					<StatCard value={String(running)} label="Running" />
					<StatCard value={String(completed)} label="Completed" />
					<StatCard value={String(approvalCount)} label="Waiting for approval" />
					<StatCard value={activeJobs + "/" + allJobs} label="Jobs active/total" />
					<StatCard value={String(failedJobs)} label="Errored jobs (crashed)" />
					<StatCard value={String(agg.turns)} label="Total turns" />
					<StatCard value={String(agg.steps)} label="Total steps" />
					<StatCard value={formatTokens(agg.decodeTokens)} label="Decode tokens" />
					<StatCard value={formatDuration(agg.llmMs)} label="LLM time" />
					<StatCard value={formatDuration(agg.toolMs)} label="Tool time" />
					<StatCard value={formatDuration(agg.ttftMs)} label="TTFT total" />
				</div>
				<div className="dshd-toolbar">
					<input className="dshd-search" type="search" placeholder="Search title, cwd, preset..." value={search} onChange={(e) => setSearch(e.target.value)} />
					<FilterChip id="all" label="All" count={sessions.length} active={filter} setActive={setFilter} />
					<FilterChip id="running" label="Running" count={running} active={filter} setActive={setFilter} />
					<FilterChip id="approval" label="Approval" count={approvalCount} active={filter} setActive={setFilter} />
					<FilterChip id="input" label="Needs input" count={inputCount} active={filter} setActive={setFilter} />
					<FilterChip id="error" label="Errors" count={errorCount} active={filter} setActive={setFilter} />
					<FilterChip id="completed" label="Completed" count={completed} active={filter} setActive={setFilter} />
					<FilterChip id="idle" label="Idle" count={stCount.idle || 0} active={filter} setActive={setFilter} />
				</div>
				{wsItems.length > 0 ? (
					<div className="dshd-section">
						<div className="dshd-section-head" onClick={() => setExpandedSections({ ...expandedSections, ws: !expandedSections.ws })}>
							<span className="dshd-section-title">Workspaces</span>
							<span className="dshd-section-count">{expandedSections.ws !== false ? "\u25be" : "\u25b8"}</span>
						</div>
						{expandedSections.ws !== false ? (
							<div className="dshd-ws-group">
								{wsItems.map((w) => {
									const wids = Array.isArray(w.sessionIds) ? w.sessionIds.filter((sid) => byId[sid]) : [];
									if (wids.length === 0) return null;
									const wsKey = "ws:" + w.workspaceId;
									return (
										<div key={w.workspaceId} className="dshd-ws-item">
											<div className="dshd-ws-head" onClick={() => setExpandedTree({ ...expandedTree, [wsKey]: !expandedTree[wsKey] })}>
												<span className="dshd-caret">{expandedTree[wsKey] ? "\u25be" : "\u25b8"}</span>
												<span>{w.title || w.path || w.workspaceId}</span>
												<span className="dshd-mono">{wids.length + " sessions"}</span>
											</div>
											{expandedTree[wsKey] ? (
												<table className="dshd-table"><tbody>
													{wids.map((sid) => (
														<SessionRow key={sid} s={byId[sid]} jobs={jobsBySession[sid] || []} current={current} onDetail={() => setDetailId(sid)} openSession={openSession} nowTs={now} />
													))}
												</tbody></table>
											) : null}
										</div>
									);
								})}
							</div>
						) : null}
					</div>
				) : null}
				{statusSections.filter((sec) => sec.items.length > 0).map((sec) => (
					<StatusSection key={sec.key} title={sec.title} sectionKey={sec.key} items={sec.items} dotClass={sec.dot} expanded={expandedSections} setExpanded={setExpandedSections} current={current} jobsBySession={jobsBySession} onDetail={setDetailId} openSession={openSession} nowTs={now} />
				))}
				<div className="dshd-section">
					<div className="dshd-section-head" onClick={() => setExpandedSections({ ...expandedSections, jobs: !expandedSections.jobs })}>
						<span className="dshd-section-title">Job activity</span>
						<span className="dshd-section-count">{String(liveJobCount)}</span>
						<span className="dshd-section-count">{expandedSections.jobs !== false ? "\u25be" : "\u25b8"}</span>
					</div>
					{expandedSections.jobs !== false ? <JobFeed jobsBySession={jobsBySession} openSession={openSession} max={12} /> : null}
				</div>
				<div className="dshd-section">
					<div className="dshd-section-head" onClick={() => setExpandedSections({ ...expandedSections, tree: !expandedSections.tree })}>
						<span className="dshd-section-title">Session hierarchy</span>
						<span className="dshd-section-count">{expandedSections.tree !== false ? "\u25be" : "\u25b8"}</span>
					</div>
					{expandedSections.tree !== false ? <SessionTree subagentsByParent={subagentsByParent} byId={byId} openSession={openSession} expanded={expandedTree} onToggle={(pid) => setExpandedTree({ ...expandedTree, [pid]: !expandedTree[pid] })} /> : null}
				</div>
				{selectedDetail ? <SessionDetail session={selectedDetail} jobs={jobsBySession[selectedDetail.id] || []} onClose={() => setDetailId(null)} openSession={openSession} /> : null}
			</div>
		</div>
	);
}