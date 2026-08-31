/**
 * Shared formatting + status-derivation helpers and the one shared clock
 * hook. statusOf() is the single authority for the 7-row session status
 * model (see README "Trạng thái session" for the data sources).
 */

import { useEffect, useState } from "react";

/** Stable empty record for "missing key" selectors (keeps Object.is happy). */
export const EMPTY_OBJ = {};

/**
 * Shared wall-clock that re-renders the consumer every `step` ms so
 * relative timestamps ("5m ago") stay honest. Mount-scoped: only ticks
 * while the consumer is rendered (the panel gates it behind `open`).
 */
export function useNow(step = 5000) {
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), step);
		return () => clearInterval(timer);
	}, [step]);
	return now;
}

export function formatTime(ts, now) {
	if (!ts) return "—";
	const diff = Math.max(0, now - ts);
	if (diff < 60000) return Math.floor(diff / 1000) + "s ago";
	if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
	if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
	return new Date(ts).toLocaleDateString();
}

export function formatDuration(ms) {
	if (!ms || ms <= 0) return "—";
	if (ms < 1000) return Math.round(ms) + "ms";
	if (ms < 60000) return (ms / 1000).toFixed(1) + "s";
	return Math.floor(ms / 60000) + "m " + Math.round((ms % 60000) / 1000) + "s";
}

export function formatTokens(n) {
	if (!n || n <= 0) return "—";
	if (n < 1000) return String(n);
	return (n / 1000).toFixed(1) + "k";
}

/** {done, total, pct} from the todo projection, or null when there are no todos. */
export function todoProgress(projectionValues) {
	const todos = projectionValues && projectionValues.todos;
	if (!Array.isArray(todos) || todos.length === 0) return null;
	const done = todos.filter((t) => t.status === "completed").length;
	return { done, total: todos.length, pct: Math.round((done / todos.length) * 100) };
}

export function liveJobs(jobs) {
	if (!Array.isArray(jobs)) return 0;
	return jobs.filter((j) => j.status === "running" || j.status === "stopping").length;
}

export function hasFailedJob(jobs) {
	return Array.isArray(jobs) && jobs.some((j) => j && j.status === "failed");
}

/**
 * Single status authority, highest signal first:
 * pendingInteraction (approval/question/plan) > running > crashed producer job > done-reminder > idle.
 */
export function statusOf(s, jobs) {
	const pi = s && s.pendingInteraction;
	if (pi === "approval") return "approval";
	if (pi === "question") return "question";
	if (pi === "plan-review") return "plan";
	if (s && s.running) return "running";
	if (hasFailedJob(jobs)) return "error";
	if (s && s.completed) return "completed";
	return "idle";
}

export function statusLabel(st) {
	if (st === "approval") return "Waiting for approval";
	if (st === "question") return "Question";
	if (st === "plan") return "Plan review";
	if (st === "error") return "Error";
	if (st === "running") return "Running";
	if (st === "completed") return "Completed";
	return "Idle";
}

/** Full dot class list for a session status; waiting states pulse. */
export function sessionDotClass(st) {
	return "dshd-dot " + dotClassOf(st) + (st === "approval" || st === "question" || st === "plan" ? " dshd-dot-attention" : "");
}

/** Row attention class for a session status ("" when not waiting). */
export function sessionRowClass(st) {
	return st === "approval" ? " dshd-row-approval" : st === "question" ? " dshd-row-question" : st === "plan" ? " dshd-row-plan" : "";
}

/** CSS pill class for a background-job status ("failed" renders as the styled error pill). */
export function jobStatusClass(status) {
	return "dshd-status-" + (status === "running" || status === "stopping" ? "running" : status === "failed" ? "error" : "completed");
}

export function statusClass(st) {
	return "dshd-status-" + st;
}

export function dotClassOf(st) {
	return "dshd-dot-" + st;
}

export function statsOf(s) {
	const v = s && s.projectionValues && s.projectionValues.sessionStats;
	return v && typeof v === "object" ? v : null;
}
