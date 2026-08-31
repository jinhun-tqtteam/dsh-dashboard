/**
 * Client-side stores. Three tiny external-store singletons read through
 * React's useSyncExternalStore: the dashboard open/close flag shared by the
 * sidebar trigger and the overlay, the sticky-summary toggle persisted in
 * localStorage, and per-session read tracking for the unread "NEW" badge.
 */

import { useSyncExternalStore } from "react";

//#region open/close — shared between DashboardTrigger and DashboardPanel
const listeners = new Set();
let isOpen = false;

export function setOpen(value) {
	if (isOpen === value) return;
	isOpen = value;
	for (const fn of listeners) fn();
}

export function useOpen() {
	return useSyncExternalStore(
		(fn) => {
			listeners.add(fn);
			return () => listeners.delete(fn);
		},
		() => isOpen
	);
}
//#endregion

//#region sticky — persistent floating-summary toggle (localStorage-backed)
const stickyListeners = new Set();
let isSticky = false;
try {
	isSticky = typeof localStorage !== "undefined" && localStorage.getItem("dshd-sticky") === "1";
} catch {}

export function setSticky(value) {
	if (isSticky === value) return;
	isSticky = value;
	try {
		if (typeof localStorage !== "undefined") localStorage.setItem("dshd-sticky", value ? "1" : "0");
	} catch {}
	for (const fn of stickyListeners) fn();
}

export function useSticky() {
	return useSyncExternalStore(
		(fn) => {
			stickyListeners.add(fn);
			return () => stickyListeners.delete(fn);
		},
		() => isSticky
	);
}
//#endregion

//#region read-tracking — has the user seen a session's latest answer?
const READ_KEY = "dshd-lastread";
const READ_RETENTION_MS = 7 * 86400000;
let lastReadMap = {};
try {
	lastReadMap = JSON.parse(localStorage.getItem(READ_KEY) || "{}") || {};
} catch {
	lastReadMap = {};
}
try {
	const readCutoff = Date.now() - READ_RETENTION_MS;
	for (const key of Object.keys(lastReadMap)) if (lastReadMap[key] < readCutoff) delete lastReadMap[key];
} catch {}

export function markRead(id) {
	if (!id) return;
	const ts = Date.now();
	if ((lastReadMap[id] || 0) >= ts - 1000) return;
	lastReadMap[id] = ts;
	try {
		localStorage.setItem(READ_KEY, JSON.stringify(lastReadMap));
	} catch {}
}

/** A session is unread when it finished/updated after the last read and no longer needs us. */
export function isUnread(s, currentId) {
	if (!s || s.blank || s.id === currentId) return false;
	if (s.running || s.pendingInteraction) return false;
	return (s.updatedAt || 0) > (lastReadMap[s.id] || 0);
}
//#endregion
