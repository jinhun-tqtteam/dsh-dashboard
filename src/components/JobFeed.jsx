import { jobStatusClass } from "../helpers.js";

/** Aggregated live background jobs across every session, newest first. */
export function JobFeed({ jobsBySession, openSession, max }) {
	const feed = [];
	for (const sid of Object.keys(jobsBySession)) {
		const jobs = jobsBySession[sid] || [];
		for (const job of jobs) feed.push({ sid, job });
	}
	feed.sort((a, b) => (b.job.startedAt || 0) - (a.job.startedAt || 0));
	const shown = (max ? feed.slice(0, max) : feed).filter(({ job }) => job.status === "running" || job.status === "stopping");
	if (shown.length === 0) return <div className="dshd-empty">No live background jobs.</div>;
	return (
		<div>
			{shown.map(({ sid, job }) => (
				<div key={sid + ":" + job.id} className="dshd-job" onClick={() => openSession(sid)} title="Open session">
					<span className={"dshd-status " + jobStatusClass(job.status)}>{job.status}</span>
					<span className="dshd-badge">{job.kind}</span>
					<span className="dshd-job-label">{job.label || job.id}</span>
					<span className="dshd-mono">{job.detail || ""}</span>
				</div>
			))}
		</div>
	);
}