import { setOpen, setSticky, useOpen, useSticky } from "../stores.js";
import { IconDataOutline16, Tooltip } from "@deepseek-ai/dsh-client-ui-primitives";

function stickyIcon(size) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
		</svg>
	);
}

/**
 * sidebar.footer.action entry: the dashboard toggle plus the sticky pin.
 * Wide sidebar: icon + label + running badge. Collapsed rail: square
 * icon-only buttons (18px icons, centered) wrapped in the same Tooltip
 * pattern the shell uses for its own rail buttons, with no text so the
 * narrow rail never overflows.
 */
export function DashboardTrigger(props) {
	const open = useOpen();
	const sticky = useSticky();
	const { useSessions, wide } = props;
	const runningCount = useSessions((s) => s.ids.filter((id) => {
		const row = s.byId[id];
		return row && row.running;
	}).length);
	const triggerBtn = (
		<button
			type="button"
			className={"dshd-trigger" + (open ? " dshd-trigger-open" : "") + (!wide ? " dshd-trigger-rail" : "")}
			onClick={() => setOpen(!open)}
			title="Session dashboard"
			aria-expanded={open}
		>
			<IconDataOutline16 size={wide ? 14 : 18} />
			{wide ? <span>Dashboard</span> : null}
			{wide && runningCount > 0 ? <span className="dshd-trigger-badge">{runningCount + " running"}</span> : null}
		</button>
	);
	const pinBtn = (
		<button
			type="button"
			className={"dshd-pin" + (sticky ? " dshd-pin-on" : "") + (!wide ? " dshd-pin-rail" : "")}
			onClick={() => setSticky(!sticky)}
			title={sticky ? "Turn off sticky dashboard" : "Turn on sticky dashboard"}
			aria-pressed={sticky}
		>
			{stickyIcon(wide ? 14 : 18)}
			{wide && sticky ? <span>Sticky</span> : null}
		</button>
	);
	if (!wide) {
		return (
			<div className="dshd-trigger-group dshd-trigger-group-rail">
				<Tooltip label="Session dashboard" delayMs={500}>{triggerBtn}</Tooltip>
				<Tooltip label={sticky ? "Turn off sticky dashboard" : "Turn on sticky dashboard"} delayMs={500}>{pinBtn}</Tooltip>
			</div>
		);
	}
	return (
		<div className="dshd-trigger-group">
			{triggerBtn}
			{pinBtn}
		</div>
	);
}