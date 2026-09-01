/**
 * Notification engine: status-transition watcher input, in-app toast store,
 * native window notifications (Web Notification API), and WebAudio chimes.
 * EVERY status transition notifies (running included; idle is silent). The toggle
 * persists in localStorage (dshd-notify). The watcher runs inside the
 * always-mounted NotifyToasts slot entry so transitions fire while the
 * panel is closed, the sticky is hidden, and the tab is unfocused.
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

//#region sound — loud distinct chimes; survives background-tab suspension
let audioCtx = null;
let master = null;
let keepAliveSrc = null;

/** Create/resume the shared AudioContext; call from a user gesture. */
export function warmAudio() {
	try {
		const Ctor = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
		if (!Ctor) return null;
		if (!audioCtx) {
			audioCtx = new Ctor();
			// Compressor bus: the louder per-tone gains stay clean and punchy.
			const comp = audioCtx.createDynamicsCompressor();
			comp.threshold.value = -18;
			comp.knee.value = 12;
			comp.ratio.value = 6;
			comp.attack.value = 0.003;
			comp.release.value = 0.25;
			comp.connect(audioCtx.destination);
			master = comp;
		}
		if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
		return audioCtx;
	} catch {
		return null;
	}
}

/**
 * Keep the audio graph alive so background tabs do not suspend the context:
 * an inaudible looping buffer keeps the graph pulling while the tab is
 * unfocused. Called when notifications are enabled.
 */
export function enableKeepAlive() {
	const ctx = warmAudio();
	if (!ctx || keepAliveSrc) return;
	try {
		const len = Math.max(1, Math.floor(ctx.sampleRate * 0.25));
		const buf = ctx.createBuffer(1, len, ctx.sampleRate);
		const src = ctx.createBufferSource();
		src.buffer = buf;
		src.loop = true;
		const g = ctx.createGain();
		g.gain.value = 0.0001; // inaudible, but keeps the graph processing
		src.connect(g);
		g.connect(ctx.destination);
		src.start();
		keepAliveSrc = src;
	} catch {}
}

function tone(ctx, freq, start, dur, type, gain) {
	const osc = ctx.createOscillator();
	const g = ctx.createGain();
	osc.type = type || "sine";
	osc.frequency.value = freq;
	g.gain.setValueAtTime(0, ctx.currentTime + start);
	g.gain.linearRampToValueAtTime(gain || 0.22, ctx.currentTime + start + 0.015);
	g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
	osc.connect(g);
	g.connect(master || ctx.destination);
	osc.start(ctx.currentTime + start);
	osc.stop(ctx.currentTime + start + dur + 0.05);
}

function scheduleChime(kind, ctx) {
	if (kind === "complete") {
		// Ascending major "ta-da" (E5-G5-C6) with an octave shimmer.
		tone(ctx, 659.25, 0.0, 0.2, "triangle", 0.22);
		tone(ctx, 783.99, 0.13, 0.2, "triangle", 0.22);
		tone(ctx, 1046.5, 0.26, 0.45, "triangle", 0.24);
		tone(ctx, 2093.0, 0.3, 0.35, "sine", 0.05);
	} else if (kind === "waiting") {
		// Doorbell ding-dong (A5-D5) twice \u2014 the "someone needs you" pattern.
		for (const base of [0, 0.58]) {
			tone(ctx, 880.0, base, 0.24, "sine", 0.24);
			tone(ctx, 587.33, base + 0.24, 0.32, "sine", 0.24);
		}
	} else if (kind === "error") {
		// Harsh low sawtooth trill \u2014 the critical-stop vocabulary.
		tone(ctx, 196, 0.0, 0.13, "sawtooth", 0.2);
		tone(ctx, 220, 0.0, 0.13, "sawtooth", 0.2);
		tone(ctx, 196, 0.17, 0.13, "sawtooth", 0.2);
		tone(ctx, 220, 0.17, 0.13, "sawtooth", 0.2);
		tone(ctx, 147, 0.34, 0.34, "sawtooth", 0.22);
	} else if (kind === "running") {
		// One short bright ping \u2014 a session started working.
		tone(ctx, 987.77, 0.0, 0.14, "sine", 0.18);
	}
}

/**
 * Distinct chime per event kind, scheduled AFTER resume() resolves \u2014 the
 * previous synchronous state check returned early while the context was
 * still waking up, which is exactly why background tabs stayed silent.
 */
export function playSound(kind) {
	const ctx = warmAudio();
	if (!ctx) return;
	if (ctx.state === "running") {
		scheduleChime(kind, ctx);
		return;
	}
	try {
		const p = ctx.resume();
		const go = () => { if (ctx.state === "running") scheduleChime(kind, ctx); };
		if (p && typeof p.then === "function") p.then(go, go);
		else go();
	} catch {}
}
//#endregion

//#region native window notifications (Web Notification API)
let opener = null;
export function setOpener(fn) { opener = typeof fn === "function" ? fn : null; }

const permListeners = new Set();
let permSnapshot = typeof Notification !== "undefined" ? Notification.permission : "unavailable";
function permEmit() { for (const fn of permListeners) fn(); }

export function useNotifyPermission() {
	return useSyncExternalStore(
		(fn) => {
			permListeners.add(fn);
			return () => permListeners.delete(fn);
		},
		() => permSnapshot
	);
}

/** Ask for window-notification permission; call from the bell's user gesture. */
export function requestNotifyPermission() {
	if (typeof Notification === "undefined") {
		permSnapshot = "unavailable";
		permEmit();
		return;
	}
	let result;
	try {
		result = Notification.requestPermission();
	} catch {
		return;
	}
	if (result && typeof result.then === "function") {
		result.then((value) => { permSnapshot = value; permEmit(); }).catch(() => {});
	} else if (typeof result === "function") {
		result((value) => { permSnapshot = value; permEmit(); });
	}
}

function kindIcon(kind) {
	const color = kind === "complete" ? "#22c55e" : kind === "error" ? "#ef4444" : kind === "running" ? "#5686fe" : "#f59e0b";
	const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><path fill=\"" + color + "\" d=\"M8 1a1 1 0 0 1 1 1v.35A4.5 4.5 0 0 1 12.5 6.8c0 2.6.6 3.9 1.2 4.7.3.4 0 1-.5 1H2.8c-.5 0-.8-.6-.5-1 .6-.8 1.2-2.1 1.2-4.7A4.5 4.5 0 0 1 7 2.35V2a1 1 0 0 1 1-1Z\"/><path fill=\"" + color + "\" d=\"M6.5 13.5a1.5 1.5 0 0 0 3 0Z\"/></svg>";
	return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/**
 * Fire a native window notification \u2014 the OS banner shows even when this
 * tab is unfocused or minimized. `silent` keeps the OS chime out (our own
 * chime already played); the tag replaces earlier banners of the same
 * session; clicking focuses the window and opens the session.
 */
export function showNativeNotification(ev) {
	if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
	try {
		const n = new Notification(ev.title || ev.id, {
			body: ev.label + " \u2014 click to open session",
			tag: ev.id,
			icon: kindIcon(ev.kind),
			silent: true
		});
		n.onclick = () => {
			try { window.focus(); } catch {}
			try { n.close(); } catch {}
			if (opener) opener(ev.id);
		};
	} catch {}
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
 * The first snapshot only baselines; afterwards EVERY status change emits
 * one event \u2014 completed, error, approval/question/plan, and running so
 * the user hears sessions start. Callers pass prevRef = { current: null }.
 */
const KIND_OF = { completed: "complete", error: "error", approval: "waiting", question: "waiting", plan: "waiting", running: "running" };

export function watchStatuses(sessions, jobsBySession, prevRef, emit) {
	const prev = prevRef.current;
	if (prev) {
		for (const s of sessions) {
			const st = statusOf(s, jobsBySession[s.id] || []);
			const before = prev[s.id];
			if (before === undefined || before === st) continue;
			const kind = KIND_OF[st];
			if (!kind) continue;
			emit({ id: s.id, kind, title: s.displayTitle || s.id, label: statusLabel(st) });
		}
	}
	const next = {};
	for (const s of sessions) next[s.id] = statusOf(s, jobsBySession[s.id] || []);
	prevRef.current = next;
}
//#endregion