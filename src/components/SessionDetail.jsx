import { IconCloseFill14 } from "@deepseek-ai/dsh-client-ui-primitives";
import { formatDuration, formatTime, formatTokens, jobStatusClass, statsOf, statusClass, statusLabel, statusOf } from "../helpers.js";

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