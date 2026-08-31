import { sessionDotClass } from "../helpers.js";

/** Subagent hierarchy rendered from the sessions store subagentsByParent catalog. */
export function SessionTree({ subagentsByParent, byId, openSession, expanded, onToggle }) {
	const roots = Object.keys(subagentsByParent).filter((pid) => {
		const parent = byId[pid];
		return parent && parent.origin !== "subagent";
	});
	if (roots.length === 0) return <div className="dshd-empty">No subagent hierarchies yet.</div>;
	return (
		<div className="dshd-tree">
			{roots.map((pid) => {
				const parent = byId[pid];
				const snap = subagentsByParent[pid];
				const children = snap && Array.isArray(snap.entries) ? snap.entries : [];
				const isOpen = expanded[pid];
				return (
					<div key={pid}>
						<div className="dshd-tree-node" onClick={() => onToggle(pid)}>
							<span className="dshd-caret">{children.length > 0 ? (isOpen ? "\u25be" : "\u25b8") : ""}</span>
							<span className={"dshd-dot " + (parent.running ? "dshd-dot-running" : "dshd-dot-idle")} />
							<span className="dshd-sess-title">{parent.displayTitle || parent.id}</span>
							<span className="dshd-mono">{children.length > 0 ? children.length + " sub" : ""}</span>
						</div>
						{isOpen && children.length > 0 ? (
							<div className="dshd-tree-children">
								{children.map((entry) => {
									const child = byId[entry.id];
									const label = entry.label || (child && child.displayTitle) || entry.id;
									const running = entry.activity === "running" || (child && child.running);
									return (
										<div key={entry.id} className="dshd-tree-node" onClick={(e) => { e.stopPropagation(); openSession(entry.id); }}>
											<span className={"dshd-dot " + (running ? "dshd-dot-running" : "dshd-dot-idle")} />
											<span>{label}</span>
											<span className="dshd-mono">{entry.mode || ""}</span>
										</div>
									);
								})}
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
}