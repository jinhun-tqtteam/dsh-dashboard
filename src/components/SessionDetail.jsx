import { IconCloseFill14 } from "@deepseek-ai/dsh-client-ui-primitives";
import { contextRatio, formatDuration, formatTime, formatTokens, formatTokensFull, jobStatusClass, statsOf, statusClass, statusLabel, statusOf, usageOf } from "../helpers.js";

function detailCell(label, value) {
	return (
		<div className="dshd-detail-cell">
			<div className="dshd-detail-cell-label">{label}</div>
			<div className="dshd-detail-cell-value">{value}</div>
		</div>
	);
}

/** Double-click drawer: per-session stats, todos, goal, and live jobs. */
export function SessionDetail({ session, jobs, onClose, openSession }) {
	if (!session) return null;
	const st = statusOf(session, jobs);
	const stats = statsOf(session);
	const todos = session.projectionValues && Array.isArray(session.projectionValues.todos) ? session.projectionValues.todos : [];
	const done = todos.filter((t) => t.status === "completed").length;
	const goal = session.projectionValues && session.projectionValues.goals;
	const usage = usageOf(session);
	const usageTotal = usage ? (usage.uncachedInputTokens || 0) + (usage.outputTokens || 0) + (usage.cacheReadTokens || 0) + (usage.cacheWriteTokens || 0) : 0;
	const pctOf = (n) => (usageTotal > 0 ? ((n || 0) / usageTotal) * 100 : 0);
	const pressure = session.projectionValues && session.projectionValues.contextPressure;
	const ctxRatio = contextRatio(pressure);
	return (
		<div className="dshd-detail">
			<div className="dshd-detail-head">
				<span className={"dshd-status " + statusClass(st)}>{statusLabel(st)}</span>
				<span className="dshd-detail-title">{session.displayTitle || session.id}</span>
				<button type="button" className="dshd-icon-btn" title="Close details" onClick={onClose}>
					<IconCloseFill14 />
				</button>
			</div>
			<div className="dshd-detail-grid">
				{detailCell("Session ID", session.id)}
				{detailCell("CWD", session.cwd || "\u2014")}
				{detailCell("Preset", session.agentPreset || "\u2014")}
				{detailCell("Parent", session.parentId ? String(session.parentId).slice(0, 12) + "\u2026" : "\u2014")}
				{detailCell("Origin", session.origin || "\u2014")}
				{detailCell("Updated", formatTime(session.updatedAt, Date.now()))}
			</div>
			{stats ? (
				<div className="dshd-detail-block">
					<div className="dshd-detail-label">Session stats</div>
					<div className="dshd-detail-grid">
						{detailCell("Turns", String(stats.turns))}
						{detailCell("Steps", String(stats.steps))}
						{detailCell("LLM time", formatDuration(stats.llmMs))}
						{detailCell("Tool time", formatDuration(stats.toolMs))}
						{detailCell("TTFT", formatDuration(stats.ttftMs))}
						{detailCell("Decode tokens", formatTokens(stats.decodeTokens))}
					</div>
				</div>
			) : null}
			{usage ? (
				<div className="dshd-detail-block">
					<div className="dshd-detail-label">{"Token usage (" + formatTokensFull(usageTotal) + " total)"}</div>
					<div className="dshd-detail-grid">
						{detailCell("Input (uncached)", formatTokensFull(usage.uncachedInputTokens))}
						{detailCell("Output", formatTokensFull(usage.outputTokens))}
						{detailCell("Cache read", formatTokensFull(usage.cacheReadTokens))}
						{detailCell("Cache write", formatTokensFull(usage.cacheWriteTokens))}
						{detailCell("Total", formatTokensFull(usageTotal))}
					</div>
					<div className="dshd-stack" title="Composition of total tokens: input / output / cache read / cache write">
						<span style={{ width: pctOf(usage.uncachedInputTokens) + "%", background: "var(--dsw-static-blue-400,#60a5fa)" }} />
						<span style={{ width: pctOf(usage.outputTokens) + "%", background: "var(--dsw-alias-state-success-primary,#22c55e)" }} />
						<span style={{ width: pctOf(usage.cacheReadTokens) + "%", background: "var(--dsw-static-neutral-bluish-600,#81858c)" }} />
						<span style={{ width: pctOf(usage.cacheWriteTokens) + "%", background: "var(--dsw-alias-state-warn-secondary,#f7ad31)" }} />
					</div>
					<div className="dshd-legend">
						<span><i className="dshd-lg" style={{ background: "var(--dsw-static-blue-400,#60a5fa)" }} />Input</span>
						<span><i className="dshd-lg" style={{ background: "var(--dsw-alias-state-success-primary,#22c55e)" }} />Output</span>
						<span><i className="dshd-lg" style={{ background: "var(--dsw-static-neutral-bluish-600,#81858c)" }} />Cache read</span>
						<span><i className="dshd-lg" style={{ background: "var(--dsw-alias-state-warn-secondary,#f7ad31)" }} />Cache write</span>
					</div>
				</div>
			) : null}
			{pressure ? (
				<div className="dshd-detail-block">
					<div className="dshd-detail-label">Context pressure</div>
					<div className="dshd-ctx">
						<div className="dshd-ctx-head">
							<span>{"pressure " + (typeof pressure.pressureTokens === "number" ? formatTokensFull(pressure.pressureTokens) : "\u2014")}</span>
							<span>{"window " + (pressure.contextWindow ? formatTokensFull(pressure.contextWindow) : "\u2014")}</span>
						</div>
						{ctxRatio != null ? <div className="dshd-progress dshd-progress-ctx"><span style={{ width: Math.round(ctxRatio * 100) + "%" }} /></div> : null}
						{typeof pressure.projectedTokens === "number" ? <div className="dshd-mono">{"projected next request: " + formatTokensFull(pressure.projectedTokens)}</div> : null}
					</div>
				</div>
			) : null}
			{todos.length > 0 ? (
				<div className="dshd-detail-block">
					<div className="dshd-detail-label">{"Tasks (" + done + "/" + todos.length + ")"}</div>
					<ul className="dshd-todo-list">
						{todos.map((t, i) => (
							<li key={i} className={"dshd-todo " + (t.status === "completed" ? "dshd-todo-done" : t.status === "in_progress" ? "dshd-todo-active" : "")}>
								<span className="dshd-todo-mark">{t.status === "completed" ? "\u2713" : "\u25cb"}</span>
								<span>{t.content}</span>
							</li>
						))}
					</ul>
				</div>
			) : null}
			{goal && typeof goal === "object" ? (
				<div className="dshd-detail-block">
					<div className="dshd-detail-label">Goal</div>
					<div className="dshd-detail-goal">
						<div>{String(goal.objective || "")}</div>
						{goal.phase ? <div className="dshd-mono">{"phase: " + String(goal.phase)}</div> : null}
					</div>
				</div>
			) : null}
			{jobs && jobs.length > 0 ? (
				<div className="dshd-detail-block">
					<div className="dshd-detail-label">{"Live jobs (" + jobs.filter((j) => j.status === "running" || j.status === "stopping").length + "/" + jobs.length + ")"}</div>
					<div>
						{jobs.map((job) => (
							<div key={job.id} className="dshd-job">
								<span className={"dshd-status " + jobStatusClass(job.status)}>{job.status}</span>
								<span className="dshd-badge">{job.kind}</span>
								<span className="dshd-job-label">{job.label || job.id}</span>
							</div>
						))}
					</div>
				</div>
			) : null}
			<button type="button" className="dshd-close" onClick={() => { openSession(session.id); }}>Open session</button>
		</div>
	);
}