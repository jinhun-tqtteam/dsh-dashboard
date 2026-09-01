/**
 * Notification engine: status-transition watcher input, in-app toast store,
 * and WebAudio chimes. The toggle persists in localStorage (dshd-notify).
 * The watcher itself runs inside the always-mounted NotifyToasts slot entry
 * so transitions fire while the panel is closed and the sticky is hidden.
 */

import { useSyncExternalStore } from "react";
import { statusLabel, statusOf } from "./helpers.js";

//#region enabled toggle — persisted
const notifyListeners = new Set();
let notifyOn = false;
try {
	notifyOn = typeof localStorage !== "undefined" && localStorage.getItem("dshd-notify") === "1";
} catch {}

export function setNotify(value) {
	if (notifyOn === value) return;
	notifyOn = value;
	try {
		if (typeof localStorage !== "undefined") localStorage.setItem("dshd-notify", value ? "1" : "0");
	} catch {}
	for (const fn of notifyListeners) fn();
}

export function useNotify() {
	return useSyncExternalStore(
		(fn) => {
			notifyListeners.add(fn);
			return () => notifyListeners.delete(fn);
		},
		() => notifyOn
	);
}
//#endregion

//#region sound — lazy WebAudio chimes (created on the toggle's user gesture)
let audioCtx = null;

/** Create/resume the shared AudioContext; call from a user gesture. */
export function warmAudio() {
	try {
		const Ctor = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
		if (!Ctor) return null;
		if (!audioCtx) audioCtx = new Ctor();
		if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
		return audioCtx;
	} catch {
		return null;
	}
}

function tone(ctx, freq, start, dur, type, gain) {
	const osc = ctx.createOscillator();
	const g = ctx.createGain();
	osc.type = type || "sine";
	osc.frequency.value = freq;
	g.gain.setValueAtTime(0, ctx.currentTime + start);
	g.gain.linearRampToValueAtTime(gain || 0.07, ctx.currentTime + start + 0.02);
	g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
	osc.connect(g);
	g.connect(ctx.destination);
	osc.start(ctx.currentTime + start);
	osc.stop(ctx.currentTime + start + dur + 0.05);
}

/** Short chime per event kind: complete (up), waiting (double ping), error (low buzz). */
export function playSound(kind) {
	const ctx = warmAudio();
	if (!ctx || ctx.state !== "running") return;
	if (kind === "complete") {
		tone(ctx, 880, 0, 0.16);
		tone(ctx, 1174.7, 0.16, 0.24);
	} else if (kind === "waiting") {
		tone(ctx, 659.3, 0, 0.14);
		tone(ctx, 659.3, 0.2, 0.14);
	} else if (kind === "error") {
		tone(ctx, 233, 0, 0.28, "square", 0.045);
		tone(ctx, 185, 0.18, 0.3, "square", 0.045);
	}
}
//#endregion

//#region toasts — tiny bounded pub-sub store
const toastListeners = new Set();
let toasts = [];
let toastSnapshot = toasts;

function toastEmit() {
	toastSnapshot = toasts;
	for (const fn of toastListeners) fn();
}

export function dismissToast(key) {
	const next = toasts.filter((t) => t.key !== key);
	if (next.length === toasts.length) return;
	toasts = next;
	toastEmit();
}

/** Add one toast (keyed per event, latest 4 kept, 10s auto-expiry). */
export function pushToast(ev) {
	const time = Date.now();
	const entry = { id: ev.id, kind: ev.kind, title: ev.title, label: ev.label, time, key: ev.id + ":" + time };
	toasts = [...toasts.filter((t) => t.id !== ev.id), entry].slice(-4);
	toastEmit();
	setTimeout(() => dismissToast(entry.key), 10000);
}

export function useToasts() {
	return useSyncExternalStore(
		(fn) => {
			toastListeners.add(fn);
			return () => toastListeners.delete(fn);
		},
		() => toastSnapshot
	);
}
//#endregion

//#region watcher — pure status-transition diff against the previous snapshot
/**
 * Diff one sessions snapshot against the previous one (prevRef.current).
 * The first snapshot only baselines; afterwards every session that ENTERS
 * completed / error / approval / question / plan from another status emits
 * one event. Returns silently; callers pass prevRef = { current: null }.
 */
export function watchStatuses(sessions, jobsBySession, prevRef, emit) {
	const prev = prevRef.current;
	if (prev) {
		for (const s of sessions) {
			const st = statusOf(s, jobsBySession[s.id] || []);
			const before = prev[s.id];
			if (before === undefined || before === st) continue;
			const kind = st === "completed" ? "complete"
				: st === "error" ? "error"
				: st === "approval" || st === "question" || st === "plan" ? "waiting"
				: null;
			if (kind) emit({ id: s.id, kind, title: s.displayTitle || s.id, label: statusLabel(st) });
		}
	}
	const next = {};
	for (const s of sessions) next[s.id] = statusOf(s, jobsBySession[s.id] || []);
	prevRef.current = next;
}
//#endregion