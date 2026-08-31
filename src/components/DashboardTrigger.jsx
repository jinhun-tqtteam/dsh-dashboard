import { setOpen, setSticky, useOpen, useSticky } from "../stores.js";
import { IconDataOutline16 } from "@deepseek-ai/dsh-client-ui-primitives";

function stickyIcon() {
	return (
		<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
		</svg>
	);
}

/** sidebar.footer.action entry: the dashboard toggle plus the sticky pin. */
export function DashboardTrigger(props) {
	const open = useOpen();
	const sticky = useSticky();
	const { useSessions, wide } = props;
	const runningCount = useSessions((s) => s.ids.filter((id) => {
		const row = s.byId[id];
		return row && row.running;
	}).length);
	return (
		<div className="dshd-trigger-group">
			<button
				type="button"
				className={"dshd-trigger" + (open ? " dshd-trigger-open" : "")}
				onClick={() => setOpen(!open)}
				title="Session dashboard"
				aria-expanded={open}
			>
				<IconDataOutline16 />
				{wide ? <span>Dashboard</span> : null}
				{runningCount > 0 ? <span className="dshd-trigger-badge">{runningCount + " running"}</span> : null}
			</button>
			<button
				type="button"
				className={"dshd-pin" + (sticky ? " dshd-pin-on" : "")}
				onClick={() => setSticky(!sticky)}
				title={sticky ? "Turn off sticky dashboard" : "Turn on sticky dashboard"}
				aria-pressed={sticky}
			>
				{stickyIcon()}
				{wide && sticky ? <span>Sticky</span> : null}
			</button>
		</div>
	);
}