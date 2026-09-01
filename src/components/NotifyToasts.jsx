import { useEffect, useRef } from "react";
import { formatTime } from "../helpers.js";
import { dismissToast, playSound, pushToast, requestNotifyPermission, setNotify, setOpener, showNativeNotification, useNotify, useNotifyPermission, useToasts, warmAudio, watchStatuses } from "../notify.js";

/**
 * Bell toggle shared by the sticky widget and the dashboard header. Turning
 * it on warms the AudioContext inside the click gesture (autoplay policy),
 * plays a confirmation ping, and asks the browser for window-notification
 * permission (the banner works even when the tab is unfocused).
 */
export function NotifyBell({ size = 14 }) {
	const on = useNotify();
	const perm = useNotifyPermission();
	const title = !on ? "Notifications off (click to enable)"
		: perm === "granted" ? "Notifications on: window banner + toast + sound (click to disable)"
		: perm === "denied" ? "Notifications on: toast + sound only \u2014 the browser blocks window banners for this site"
		: "Notifications on (click to disable)";
	return (
		<button
			type="button"
			className={"dshd-icon-btn dshd-bell" + (on ? " dshd-bell-on" : "")}
			title={title}
			onClick={(e) => {
				e.stopPropagation();
				const next = !on;
				setNotify(next);
				if (next) {
					warmAudio();
					playSound("waiting");
					requestNotifyPermission();
				}
			}}
		>
			<svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
				<path d="M8 1a1 1 0 0 1 1 1v.35A4.5 4.5 0 0 1 12.5 6.8c0 2.6.6 3.9 1.2 4.7.3.4 0 1-.5 1H2.8c-.5 0-.8-.6-.5-1 .6-.8 1.2-2.1 1.2-4.7A4.5 4.5 0 0 1 7 2.35V2a1 1 0 0 1 1-1Z" />
				<path d="M6.5 13.5a1.5 1.5 0 0 0 3 0Z" />
				{!on ? <path d="M2.5 2.5 13.5 13.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /> : null}
			</svg>
		</button>
	);
}

/**
 * shell.overlay entry (always mounted): runs the status-transition watcher
 * against every sessions snapshot while notifications are enabled — each
 * event fires the in-page toast, the chime, and the native window banner —
 * and renders the bounded toast stack bottom-right. Renders nothing
 * otherwise. The opener is registered for the native banner's click.
 */
export function NotifyToasts({ useSessions, openSession }) {
	const enabled = useNotify();
	const snap = useSessions((s) => s);
	const toasts = useToasts();
	const prevRef = useRef(null);
	useEffect(() => {
		setOpener((id) => { try { openSession(id); } catch (e) { console.warn("dashboard: openSession failed", e); } });
		return () => setOpener(null);
	}, [openSession]);
	useEffect(() => {
		if (!enabled) { prevRef.current = null; return; }
		const { ids, byId, jobsBySession = {} } = snap;
		const sessions = ids.map((id) => byId[id]).filter(Boolean);
		watchStatuses(sessions, jobsBySession, prevRef, (ev) => {
			pushToast(ev);
			playSound(ev.kind);
			showNativeNotification(ev);
		});
	}, [snap, enabled]);
	if (!enabled || toasts.length === 0) return null;
	return (
		<div className="dshd-toasts" role="status" aria-live="polite">
			{toasts.map((t) => (
				<div
					key={t.key}
					className={"dshd-toast dshd-toast-" + t.kind}
					title="Open session"
					onClick={() => {
						dismissToast(t.key);
						try { openSession(t.id); } catch (e) { console.warn("dashboard: openSession failed", e); }
					}}
				>
					<div className="dshd-toast-head">
						<span className="dshd-toast-kind">{t.label}</span>
						<span className="dshd-toast-time">{formatTime(t.time, Date.now())}</span>
					</div>
					<div className="dshd-toast-title">{t.title}</div>
				</div>
			))}
		</div>
	);
}