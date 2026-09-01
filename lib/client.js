window.__ModuleLoader__.load({
	id: "@dsh-user/dsh-dashboard",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);

// src/notify.js
var import_react2 = require("react");

// src/helpers.js
var import_react = require("react");
var EMPTY_OBJ = {};
function useNow(step = 5e3) {
  const [now, setNow] = (0, import_react.useState)(() => Date.now());
  (0, import_react.useEffect)(() => {
    const timer = setInterval(() => setNow(Date.now()), step);
    return () => clearInterval(timer);
  }, [step]);
  return now;
}
function formatTime(ts, now) {
  if (!ts) return "\u2014";
  const diff = Math.max(0, now - ts);
  if (diff < 6e4) return Math.floor(diff / 1e3) + "s ago";
  if (diff < 36e5) return Math.floor(diff / 6e4) + "m ago";
  if (diff < 864e5) return Math.floor(diff / 36e5) + "h ago";
  return new Date(ts).toLocaleDateString();
}
function formatDuration(ms) {
  if (!ms || ms <= 0) return "\u2014";
  if (ms < 1e3) return Math.round(ms) + "ms";
  if (ms < 6e4) return (ms / 1e3).toFixed(1) + "s";
  return Math.floor(ms / 6e4) + "m " + Math.round(ms % 6e4 / 1e3) + "s";
}
function formatTokens(n) {
  if (!n || n <= 0) return "\u2014";
  if (n < 1e3) return String(n);
  return (n / 1e3).toFixed(1) + "k";
}
function usageOf(s) {
  const v = s && s.projectionValues && s.projectionValues.tokenUsage;
  return v && typeof v === "object" ? v : null;
}
function usageTotals(sessions) {
  const t = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  for (const s of sessions) {
    const u = usageOf(s);
    if (!u) continue;
    t.input += u.uncachedInputTokens || 0;
    t.output += u.outputTokens || 0;
    t.cacheRead += u.cacheReadTokens || 0;
    t.cacheWrite += u.cacheWriteTokens || 0;
  }
  return t;
}
function formatTokensFull(n) {
  if (!n || n <= 0) return "0";
  return n.toLocaleString("en-US");
}
function contextRatio(pressure) {
  if (!pressure || typeof pressure.pressureTokens !== "number" || !pressure.contextWindow) return null;
  return Math.min(1, pressure.pressureTokens / pressure.contextWindow);
}
function todoProgress(projectionValues) {
  const todos = projectionValues && projectionValues.todos;
  if (!Array.isArray(todos) || todos.length === 0) return null;
  const done = todos.filter((t) => t.status === "completed").length;
  return { done, total: todos.length, pct: Math.round(done / todos.length * 100) };
}
function liveJobs(jobs) {
  if (!Array.isArray(jobs)) return 0;
  return jobs.filter((j) => j.status === "running" || j.status === "stopping").length;
}
function hasFailedJob(jobs) {
  return Array.isArray(jobs) && jobs.some((j) => j && j.status === "failed");
}
function statusOf(s, jobs) {
  const pi = s && s.pendingInteraction;
  if (pi === "approval") return "approval";
  if (pi === "question") return "question";
  if (pi === "plan-review") return "plan";
  if (s && s.running) return "running";
  if (hasFailedJob(jobs)) return "error";
  if (s && s.completed) return "completed";
  return "idle";
}
function statusLabel(st) {
  if (st === "approval") return "Waiting for approval";
  if (st === "question") return "Question";
  if (st === "plan") return "Plan review";
  if (st === "error") return "Error";
  if (st === "running") return "Running";
  if (st === "completed") return "Completed";
  return "Idle";
}
function sessionDotClass(st) {
  return "dshd-dot " + dotClassOf(st) + (st === "approval" || st === "question" || st === "plan" ? " dshd-dot-attention" : "");
}
function sessionRowClass(st) {
  return st === "approval" ? " dshd-row-approval" : st === "question" ? " dshd-row-question" : st === "plan" ? " dshd-row-plan" : "";
}
function jobStatusClass(status) {
  return "dshd-status-" + (status === "running" || status === "stopping" ? "running" : status === "failed" ? "error" : "completed");
}
function statusClass(st) {
  return "dshd-status-" + st;
}
function dotClassOf(st) {
  return "dshd-dot-" + st;
}
function statsOf(s) {
  const v = s && s.projectionValues && s.projectionValues.sessionStats;
  return v && typeof v === "object" ? v : null;
}

// src/notify.js
var notifyListeners = /* @__PURE__ */ new Set();
var notifyOn = false;
try {
  notifyOn = typeof localStorage !== "undefined" && localStorage.getItem("dshd-notify") === "1";
} catch {
}
function setNotify(value) {
  if (notifyOn === value) return;
  notifyOn = value;
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem("dshd-notify", value ? "1" : "0");
  } catch {
  }
  for (const fn of notifyListeners) fn();
}
function useNotify() {
  return (0, import_react2.useSyncExternalStore)(
    (fn) => {
      notifyListeners.add(fn);
      return () => notifyListeners.delete(fn);
    },
    () => notifyOn
  );
}
var audioCtx = null;
var master = null;
var keepAliveSrc = null;
function warmAudio() {
  try {
    const Ctor = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
    if (!Ctor) return null;
    if (!audioCtx) {
      audioCtx = new Ctor();
      const comp = audioCtx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 12;
      comp.ratio.value = 6;
      comp.attack.value = 3e-3;
      comp.release.value = 0.25;
      comp.connect(audioCtx.destination);
      master = comp;
    }
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {
    });
    return audioCtx;
  } catch {
    return null;
  }
}
function enableKeepAlive() {
  const ctx = warmAudio();
  if (!ctx || keepAliveSrc) return;
  try {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 60;
    const g = ctx.createGain();
    g.gain.value = 2e-3;
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    keepAliveSrc = osc;
  } catch {
  }
}
function tone(ctx, freq, start, dur, type, gain) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain || 0.22, ctx.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + start + dur);
  osc.connect(g);
  g.connect(master || ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.05);
}
function scheduleChime(kind, ctx) {
  if (kind === "complete" || kind === "finished") {
    tone(ctx, 659.25, 0, 0.2, "triangle", 0.22);
    tone(ctx, 783.99, 0.13, 0.2, "triangle", 0.22);
    tone(ctx, 1046.5, 0.26, 0.45, "triangle", 0.24);
    tone(ctx, 2093, 0.3, 0.35, "sine", 0.05);
  } else if (kind === "waiting") {
    for (const base of [0, 0.58]) {
      tone(ctx, 880, base, 0.24, "sine", 0.24);
      tone(ctx, 587.33, base + 0.24, 0.32, "sine", 0.24);
    }
  } else if (kind === "error") {
    tone(ctx, 196, 0, 0.13, "sawtooth", 0.2);
    tone(ctx, 220, 0, 0.13, "sawtooth", 0.2);
    tone(ctx, 196, 0.17, 0.13, "sawtooth", 0.2);
    tone(ctx, 220, 0.17, 0.13, "sawtooth", 0.2);
    tone(ctx, 147, 0.34, 0.34, "sawtooth", 0.22);
  }
}
function playSound(kind) {
  const ctx = warmAudio();
  if (!ctx) return;
  if (ctx.state === "running") {
    scheduleChime(kind, ctx);
    return;
  }
  try {
    const p = ctx.resume();
    const go = () => {
      if (ctx.state === "running") scheduleChime(kind, ctx);
    };
    if (p && typeof p.then === "function") p.then(go, go);
    else go();
  } catch {
  }
}
var bridgeInstalled = false;
var frameWorker = null;
var frameSeq = 0;
var nativeRaf = null;
function installFrameBridge() {
  if (bridgeInstalled || typeof window === "undefined") return;
  bridgeInstalled = true;
  nativeRaf = typeof globalThis.requestAnimationFrame === "function" ? globalThis.requestAnimationFrame.bind(globalThis) : null;
  globalThis.requestAnimationFrame = (cb) => {
    if (typeof document === "undefined" || document.visibilityState === "visible") {
      if (nativeRaf) return nativeRaf(cb);
      return queueMicrotask(cb);
    }
    if (typeof Worker === "function") {
      if (!frameWorker) {
        try {
          const code = "let t=null;onmessage=e=>{clearTimeout(t);t=setTimeout(()=>postMessage(e.data),Math.max(0,e.data));};";
          frameWorker = new Worker(URL.createObjectURL(new Blob([code], { type: "text/javascript" })));
        } catch {
          frameWorker = null;
        }
      }
      if (frameWorker) {
        const seq = ++frameSeq;
        const handler = (e) => {
          if (e.data !== seq) return;
          frameWorker.removeEventListener("message", handler);
          cb(performance.now());
        };
        frameWorker.addEventListener("message", handler);
        frameWorker.postMessage(16);
        return seq;
      }
    }
    return setTimeout(cb, 16);
  };
}
var opener = null;
function setOpener(fn) {
  opener = typeof fn === "function" ? fn : null;
}
var permListeners = /* @__PURE__ */ new Set();
var permSnapshot = typeof Notification !== "undefined" ? Notification.permission : "unavailable";
function permEmit() {
  for (const fn of permListeners) fn();
}
function useNotifyPermission() {
  return (0, import_react2.useSyncExternalStore)(
    (fn) => {
      permListeners.add(fn);
      return () => permListeners.delete(fn);
    },
    () => permSnapshot
  );
}
function requestNotifyPermission() {
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
    result.then((value) => {
      permSnapshot = value;
      permEmit();
    }).catch(() => {
    });
  } else if (typeof result === "function") {
    result((value) => {
      permSnapshot = value;
      permEmit();
    });
  }
}
function kindIcon(kind) {
  const color = kind === "complete" || kind === "finished" ? "#22c55e" : kind === "error" ? "#ef4444" : "#f59e0b";
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="' + color + '" d="M8 1a1 1 0 0 1 1 1v.35A4.5 4.5 0 0 1 12.5 6.8c0 2.6.6 3.9 1.2 4.7.3.4 0 1-.5 1H2.8c-.5 0-.8-.6-.5-1 .6-.8 1.2-2.1 1.2-4.7A4.5 4.5 0 0 1 7 2.35V2a1 1 0 0 1 1-1Z"/><path fill="' + color + '" d="M6.5 13.5a1.5 1.5 0 0 0 3 0Z"/></svg>';
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function showNativeNotification(ev) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  try {
    const n = new Notification(ev.title || ev.id, {
      body: ev.label + " \u2014 click to open session",
      tag: ev.id + ":" + ev.kind,
      // kind-qualified so waiting/finished coexist (same-tag notifications replace each other)
      icon: kindIcon(ev.kind),
      silent: true
    });
    n.onclick = () => {
      try {
        window.focus();
      } catch {
      }
      try {
        n.close();
      } catch {
      }
      if (opener) opener(ev.id);
    };
  } catch {
  }
}
var toastListeners = /* @__PURE__ */ new Set();
var toasts = [];
var toastSnapshot = toasts;
function toastEmit() {
  toastSnapshot = toasts;
  for (const fn of toastListeners) fn();
}
function dismissToast(key) {
  const next = toasts.filter((t) => t.key !== key);
  if (next.length === toasts.length) return;
  toasts = next;
  toastEmit();
}
function pushToast(ev) {
  const time = Date.now();
  const entry = { id: ev.id, kind: ev.kind, title: ev.title, label: ev.label, time, key: ev.id + ":" + time };
  toasts = [...toasts.filter((t) => t.id !== ev.id), entry].slice(-4);
  toastEmit();
  setTimeout(() => dismissToast(entry.key), 1e4);
}
function useToasts() {
  return (0, import_react2.useSyncExternalStore)(
    (fn) => {
      toastListeners.add(fn);
      return () => toastListeners.delete(fn);
    },
    () => toastSnapshot
  );
}
var KIND_OF = { completed: "complete", error: "error", approval: "waiting", question: "waiting", plan: "waiting" };
function watchStatuses(sessions, jobsBySession, prevRef, emit, currentId) {
  const prev = prevRef.current;
  if (prev) {
    for (const s of sessions) {
      const st = statusOf(s, jobsBySession[s.id] || []);
      const before = prev[s.id];
      if (before === void 0 || before === st) continue;
      const kind = KIND_OF[st] || (before === "running" && st === "idle" && s.id === currentId ? "finished" : null);
      if (!kind) continue;
      emit({ id: s.id, kind, title: s.displayTitle || s.id, label: kind === "finished" ? "Finished" : statusLabel(st) });
    }
  }
  const next = {};
  for (const s of sessions) next[s.id] = statusOf(s, jobsBySession[s.id] || []);
  prevRef.current = next;
}

// src/styles.js
var css = [
  ".dshd-overlay{position:absolute;top:0;bottom:0;right:0;z-index:1000;pointer-events:auto;display:flex;flex-direction:column;overflow:hidden;background:var(--dsw-specific-menu,#1e1e1e);color:var(--dsw-alias-label-primary,#e6e6e6);font:13px/1.5 var(--dsw-font-sans,system-ui,sans-serif)}",
  ".dshd-header{display:flex;align-items:center;gap:8px;padding:10px 16px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.25));flex:none}",
  ".dshd-title{font-size:15px;font-weight:600;flex:1;display:flex;align-items:center;gap:8px}",
  ".dshd-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:0;border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary,#b0b0b0);cursor:pointer}",
  ".dshd-icon-btn:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.15));color:var(--dsw-alias-label-primary,#e6e6e6)}",
  ".dshd-body{flex:1;min-height:0;overflow:auto;padding:14px 16px;display:flex;flex-direction:column;gap:16px}",
  ".dshd-body > *{flex:none}",
  ".dshd-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}",
  ".dshd-card{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.08));border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2));border-radius:10px;padding:10px 14px}",
  ".dshd-card-value{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums}",
  ".dshd-card-label{font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a);margin-top:2px}",
  ".dshd-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
  ".dshd-search{flex:1;min-width:180px;height:28px;padding:0 10px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.25));background:var(--dsw-alias-fill-l2,rgba(128,128,128,.08));color:var(--dsw-alias-label-primary,#e6e6e6);font-size:12px;outline:none}",
  ".dshd-search:focus{border-color:var(--dsw-alias-accent,#5686fe)}",
  ".dshd-chip{display:inline-flex;align-items:center;gap:4px;height:26px;padding:0 10px;border-radius:14px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.25));background:0 0;color:var(--dsw-alias-label-secondary,#b0b0b0);font-size:12px;cursor:pointer;white-space:nowrap}",
  ".dshd-chip:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.12))}",
  ".dshd-chip-on{background:var(--dsw-alias-accent,#5686fe);border-color:var(--dsw-alias-accent,#5686fe);color:#fff}",
  ".dshd-chip-count{margin-left:2px;opacity:.75;font-variant-numeric:tabular-nums}",
  ".dshd-section{border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2));border-radius:10px;overflow:hidden}",
  ".dshd-section-head{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;background:var(--dsw-alias-fill-l2,rgba(128,128,128,.06));user-select:none}",
  ".dshd-section-head:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.12))}",
  ".dshd-section-title{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-tertiary,#8a8a8a);flex:1}",
  ".dshd-section-count{font-size:12px;color:var(--dsw-alias-label-tertiary,#8a8a8a);font-variant-numeric:tabular-nums}",
  ".dshd-table{width:100%;border-collapse:collapse;table-layout:fixed}",
  ".dshd-table th{text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-tertiary,#8a8a8a);padding:6px 10px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2))}",
  ".dshd-table td{padding:7px 10px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.1));vertical-align:middle;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  ".dshd-row{cursor:pointer}",
  ".dshd-row:hover td{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.1))}",
  ".dshd-row-current td{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.16))}",
  ".dshd-sess-title{font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".dshd-sess-sub{font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}",
  ".dshd-mono{font-family:var(--dsw-font-mono,ui-monospace,monospace);font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
  ".dshd-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle}",
  ".dshd-dot-running{background:var(--dsw-static-deepseek-450,#5686fe);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-static-deepseek-450,#5686fe) 12%,transparent)}",
  ".dshd-dot-completed{background:var(--dsw-alias-state-success-primary,#22c55e);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-success-primary,#22c55e) 12%,transparent)}",
  ".dshd-dot-idle{background:var(--dsw-static-neutral-bluish-600,#81858c);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-static-neutral-bluish-600,#81858c) 12%,transparent)}",
  ".dshd-progress{display:inline-block;min-width:56px;height:6px;border-radius:3px;background:var(--dsw-alias-fill-l2,rgba(128,128,128,.2));overflow:hidden;vertical-align:middle}",
  ".dshd-progress > span{display:block;height:100%;background:var(--dsw-alias-state-success-primary,#22c55e)}",
  ".dshd-empty{padding:32px;text-align:center;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
  ".dshd-trigger{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 8px;border:0;border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary,#b0b0b0);cursor:pointer;font-size:12px;white-space:nowrap}",
  ".dshd-trigger:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.15));color:var(--dsw-alias-label-primary,#e6e6e6)}",
  ".dshd-trigger-open{color:var(--dsw-alias-label-primary,#e6e6e6)}",
  ".dshd-trigger-badge{margin-left:2px;font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
  ".dshd-status{display:inline-flex;align-items:center;gap:4px;font-size:11px;border-radius:10px;padding:1px 8px;border:1px solid transparent}",
  ".dshd-status-running{color:var(--dsw-static-deepseek-450,#5686fe);border-color:color-mix(in srgb,var(--dsw-static-deepseek-450,#5686fe) 45%,transparent)}",
  ".dshd-status-completed{color:var(--dsw-alias-state-success-primary,#22c55e);border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary,#22c55e) 45%,transparent)}",
  ".dshd-status-idle{color:var(--dsw-static-neutral-bluish-600,#81858c);border-color:color-mix(in srgb,var(--dsw-static-neutral-bluish-600,#81858c) 45%,transparent)}",
  "@keyframes dshd-dot-pulse{0%{box-shadow:0 0 0 0 currentColor;opacity:1}50%{box-shadow:0 0 0 5px transparent;opacity:.55}100%{box-shadow:0 0 0 0 currentColor;opacity:1}}",
  "@keyframes dshd-row-pulse{0%,100%{background:transparent}50%{background:color-mix(in srgb,var(--dshd-attn,#f59e0b) 10%,transparent)}}",
  "@keyframes dshd-pill-pulse{0%,100%{border-color:var(--dsw-alias-border-l2,rgba(128,128,128,.2))}50%{border-color:var(--dsw-alias-state-warn-primary,#f59e0b)}}",
  ".dshd-dot-attention{animation:dshd-dot-pulse 1.6s ease-in-out infinite}",
  ".dshd-row-approval{--dshd-attn:var(--dsw-alias-state-warn-primary,#f59e0b);animation:dshd-row-pulse 2s ease-in-out infinite}",
  ".dshd-row-question{--dshd-attn:var(--dsw-alias-state-warn-secondary,#f7ad31);animation:dshd-row-pulse 2s ease-in-out infinite}",
  ".dshd-row-plan{--dshd-attn:var(--dsw-static-blue-400,#60a5fa);animation:dshd-row-pulse 2s ease-in-out infinite}",
  ".dshd-sticky-pill.dshd-pill-attn{animation:dshd-pill-pulse 2s ease-in-out infinite}",
  ".dshd-wait{font-size:12px;font-weight:600;color:var(--dsw-alias-state-warn-primary,#f59e0b)}",
  "@media (prefers-reduced-motion:reduce){.dshd-dot-attention,.dshd-row-approval,.dshd-row-question,.dshd-row-plan,.dshd-sticky-pill.dshd-pill-attn{animation:none}.dshd-row-approval,.dshd-row-question,.dshd-row-plan{background:color-mix(in srgb,var(--dshd-attn,#f59e0b) 8%,transparent)}}",
  ".dshd-dot-approval{color:var(--dsw-alias-state-warn-primary,#f59e0b);background:var(--dsw-alias-state-warn-primary,#f59e0b);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-warn-primary,#f59e0b) 12%,transparent)}",
  ".dshd-dot-question{color:var(--dsw-alias-state-warn-secondary,#f7ad31);background:var(--dsw-alias-state-warn-secondary,#f7ad31);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-warn-secondary,#f7ad31) 12%,transparent)}",
  ".dshd-dot-plan{color:var(--dsw-static-blue-400,#60a5fa);background:var(--dsw-static-blue-400,#60a5fa);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-static-blue-400,#60a5fa) 12%,transparent)}",
  ".dshd-dot-error{background:var(--dsw-alias-state-error-primary,#ec1313);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-error-primary,#ec1313) 12%,transparent)}",
  ".dshd-status-approval{color:var(--dsw-alias-state-warn-primary,#f59e0b);border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#f59e0b) 45%,transparent)}",
  ".dshd-status-question{color:var(--dsw-alias-state-warn-secondary,#f7ad31);border-color:color-mix(in srgb,var(--dsw-alias-state-warn-secondary,#f7ad31) 45%,transparent)}",
  ".dshd-status-plan{color:var(--dsw-static-blue-400,#60a5fa);border-color:color-mix(in srgb,var(--dsw-static-blue-400,#60a5fa) 45%,transparent)}",
  ".dshd-status-error{color:var(--dsw-alias-state-error-primary,#ec1313);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary,#ec1313) 45%,transparent)}",
  ".dshd-job{display:flex;align-items:center;gap:8px;padding:6px 10px;font-size:12px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.08))}",
  ".dshd-job:last-child{border-bottom:none}",
  ".dshd-job-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".dshd-badge{display:inline-block;font-size:10px;font-weight:600;border-radius:8px;padding:1px 7px;background:var(--dsw-alias-fill-l2,rgba(128,128,128,.18));color:var(--dsw-alias-label-secondary,#b0b0b0)}",
  ".dshd-tree{padding:8px 12px}",
  ".dshd-tree-node{display:flex;align-items:center;gap:6px;padding:4px 0;font-size:12px;cursor:pointer;border-radius:6px}",
  ".dshd-tree-node:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.1))}",
  ".dshd-tree-children{margin-left:18px;border-left:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2));padding-left:10px}",
  ".dshd-caret{display:inline-flex;width:14px;justify-content:center;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
  ".dshd-ws-group{padding:6px 12px}",
  ".dshd-ws-head{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;padding:4px 0;cursor:pointer;border-radius:6px}",
  ".dshd-ws-head:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.1))}",
  ".dshd-close{background:var(--dsw-alias-accent,#5686fe);color:#fff;border:0;border-radius:6px;padding:4px 12px;font-size:12px;cursor:pointer}",
  ".dshd-close:hover{opacity:.85}",
  // no .dshd-col-session rule on purpose: with table-layout:fixed the Session column flexes into the remaining space
  ".dshd-col-status{width:158px}",
  ".dshd-col-preset{width:110px}",
  ".dshd-col-tasks{width:118px}",
  ".dshd-col-jobs{width:78px}",
  ".dshd-col-tokens{width:104px}",
  ".dshd-col-updated{width:92px}",
  ".dshd-section-meta{display:inline-flex;align-items:center;gap:6px}",
  ".dshd-section .dshd-empty{padding:14px}",
  ".dshd-ws-item{padding:2px 0}",
  ".dshd-trigger-group{display:inline-flex;align-items:center;gap:2px}",
  ".dshd-pin{display:inline-flex;align-items:center;justify-content:center;gap:4px;height:28px;min-width:28px;padding:0 6px;border:0;border-radius:6px;background:0 0;color:var(--dsw-alias-label-secondary,#b0b0b0);cursor:pointer}",
  ".dshd-pin:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.15));color:var(--dsw-alias-label-primary,#e6e6e6)}",
  ".dshd-pin-on{color:var(--dsw-alias-accent,#5686fe)}",
  ".dshd-sticky{position:fixed;top:16px;left:16px;z-index:1100;width:340px;max-width:calc(100vw - 32px);max-height:70vh;display:flex;flex-direction:column;background:var(--dsw-specific-menu,#1e1e1e);color:var(--dsw-alias-label-primary,#e6e6e6);border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.3));border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.45);pointer-events:auto;overflow:hidden;font:13px/1.5 var(--dsw-font-sans,system-ui,sans-serif)}",
  ".dshd-sticky-head{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2));flex:none;cursor:move;touch-action:none;user-select:none}",
  ".dshd-sticky-title{font-size:12px;font-weight:600;flex:1}",
  ".dshd-sticky-body{flex:1;min-height:0;overflow:auto;padding:4px 0}",
  ".dshd-sticky-row{display:flex;align-items:center;gap:8px;padding:6px 12px;cursor:pointer}",
  ".dshd-sticky-row:hover{background:var(--dsw-alias-fill-l2,rgba(128,128,128,.1))}",
  ".dshd-sticky-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}",
  ".dshd-sticky-prog{width:64px;min-width:64px}",
  ".dshd-sticky-meta{font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a);font-variant-numeric:tabular-nums;white-space:nowrap}",
  ".dshd-sticky-empty{padding:16px;text-align:center;color:var(--dsw-alias-label-tertiary,#8a8a8a);font-size:12px}",
  ".dshd-sticky-pill{position:fixed;top:16px;left:16px;z-index:1100;display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:var(--dsw-specific-menu,#1e1e1e);color:var(--dsw-alias-label-primary,#e6e6e6);border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.3));box-shadow:0 8px 30px rgba(0,0,0,.45);cursor:pointer;pointer-events:auto;font-size:12px}",
  ".dshd-sticky-pill{touch-action:none;user-select:none}",
  ".dshd-sticky-pill:hover{border-color:var(--dsw-alias-accent,#5686fe)}",
  ".dshd-new{display:inline-flex;align-items:center;font-size:9px;font-weight:700;letter-spacing:.06em;color:#fff;background:var(--dsw-static-deepseek-450,#5686fe);border-radius:8px;padding:1px 6px;line-height:1.4;flex:none}",
  // detail drawer — classes used by SessionDetail (previously missing)
  ".dshd-detail{padding:12px;border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.2));border-radius:10px;display:flex;flex-direction:column;gap:10px}",
  ".dshd-detail-head{display:flex;align-items:center;gap:8px}",
  ".dshd-detail-title{font-size:13px;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".dshd-detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}",
  ".dshd-detail-block{display:flex;flex-direction:column;gap:6px}",
  ".dshd-detail-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
  ".dshd-detail-cell{border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.15));border-radius:8px;padding:6px 10px;min-width:0}",
  ".dshd-detail-cell-label{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
  ".dshd-detail-cell-value{font-size:12px;font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".dshd-detail-goal{font-size:12px;display:flex;flex-direction:column;gap:2px}",
  ".dshd-todo-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}",
  ".dshd-todo{display:flex;align-items:center;gap:8px;font-size:12px}",
  ".dshd-todo-mark{width:16px;flex:none;text-align:center;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
  ".dshd-todo-done,.dshd-todo-done .dshd-todo-mark{color:var(--dsw-alias-state-success-primary,#22c55e)}",
  ".dshd-todo-active{color:var(--dsw-alias-accent,#5686fe)}",
  ".dshd-stack{display:flex;height:6px;border-radius:3px;overflow:hidden;background:var(--dsw-alias-fill-l2,rgba(128,128,128,.15))}",
  ".dshd-stack > span{display:block;height:100%;min-width:0}",
  ".dshd-progress-ctx > span{background:var(--dsw-alias-accent,#5686fe)}",
  ".dshd-ctx{display:flex;flex-direction:column;gap:4px}",
  ".dshd-ctx-head{display:flex;justify-content:space-between;font-size:11px;color:var(--dsw-alias-label-tertiary,#8a8a8a)}",
  ".dshd-bell{position:relative}.dshd-bell svg{opacity:.45}",
  ".dshd-bell-on svg{opacity:1;color:var(--dsw-alias-accent,#5686fe)}",
  ".dshd-toasts{position:fixed;bottom:16px;right:16px;z-index:1100;display:flex;flex-direction:column;gap:8px;pointer-events:none}",
  ".dshd-toast{pointer-events:auto;min-width:220px;max-width:320px;background:var(--dsw-specific-menu,#1e1e1e);color:var(--dsw-alias-label-primary,#e6e6e6);border:1px solid var(--dsw-alias-border-l2,rgba(128,128,128,.3));border-left:3px solid var(--dsw-static-neutral-bluish-600,#81858c);border-radius:8px;padding:8px 12px;box-shadow:0 8px 30px rgba(0,0,0,.4);cursor:pointer;font:12px/1.5 var(--dsw-font-sans,system-ui,sans-serif)}",
  ".dshd-toast:hover{background:var(--dsw-alias-fill-l1,rgba(128,128,128,.08))}",
  ".dshd-toast-complete,.dshd-toast-finished{border-left-color:var(--dsw-alias-state-success-primary,#22c55e)}",
  ".dshd-toast-finished .dshd-toast-kind{color:var(--dsw-alias-state-success-primary,#22c55e)}",
  ".dshd-toast-error{border-left-color:var(--dsw-alias-state-error-primary,#ef4444)}",
  ".dshd-toast-waiting{border-left-color:var(--dsw-alias-state-warn-primary,#f59e0b)}",
  ".dshd-bell-dot{position:absolute;top:2px;right:2px;width:7px;height:7px;border-radius:50%;border:1.5px solid var(--dsw-specific-menu,#1e1e1e)}",
  ".dshd-bell-dot-ok{background:var(--dsw-alias-state-success-primary,#22c55e)}",
  ".dshd-bell-dot-warn{background:var(--dsw-alias-state-warn-primary,#f59e0b);animation:dshd-dot-pulse 1.6s ease-in-out infinite}",
  ".dshd-toast-head{display:flex;align-items:center;gap:8px;margin-bottom:2px}",
  ".dshd-toast-kind{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}",
  ".dshd-toast-complete .dshd-toast-kind{color:var(--dsw-alias-state-success-primary,#22c55e)}",
  ".dshd-toast-error .dshd-toast-kind{color:var(--dsw-alias-state-error-primary,#ef4444)}",
  ".dshd-toast-waiting .dshd-toast-kind{color:var(--dsw-alias-state-warn-primary,#f59e0b)}",
  ".dshd-toast-time{font-size:10px;color:var(--dsw-alias-label-tertiary,#8a8a8a);margin-left:auto}",
  ".dshd-toast-title{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
].join("");
var tagId = "@dsh-user/dsh-dashboard/dashboard.css";
function injectCss() {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "@dsh-user/dsh-dashboard";
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}

// src/components/DashboardPanel.jsx
var import_react5 = require("react");
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/stores.js
var import_react3 = require("react");
var listeners = /* @__PURE__ */ new Set();
var isOpen = false;
function setOpen(value) {
  if (isOpen === value) return;
  isOpen = value;
  for (const fn of listeners) fn();
}
function useOpen() {
  return (0, import_react3.useSyncExternalStore)(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => isOpen
  );
}
var stickyListeners = /* @__PURE__ */ new Set();
var isSticky = false;
try {
  isSticky = typeof localStorage !== "undefined" && localStorage.getItem("dshd-sticky") === "1";
} catch {
}
function setSticky(value) {
  if (isSticky === value) return;
  isSticky = value;
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem("dshd-sticky", value ? "1" : "0");
  } catch {
  }
  for (const fn of stickyListeners) fn();
}
function useSticky() {
  return (0, import_react3.useSyncExternalStore)(
    (fn) => {
      stickyListeners.add(fn);
      return () => stickyListeners.delete(fn);
    },
    () => isSticky
  );
}
var READ_KEY = "dshd-lastread";
var READ_RETENTION_MS = 7 * 864e5;
var lastReadMap = {};
try {
  lastReadMap = JSON.parse(localStorage.getItem(READ_KEY) || "{}") || {};
} catch {
  lastReadMap = {};
}
try {
  const readCutoff = Date.now() - READ_RETENTION_MS;
  for (const key of Object.keys(lastReadMap)) if (lastReadMap[key] < readCutoff) delete lastReadMap[key];
} catch {
}
function markRead(id) {
  if (!id) return;
  const ts = Date.now();
  if ((lastReadMap[id] || 0) >= ts - 1e3) return;
  lastReadMap[id] = ts;
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(lastReadMap));
  } catch {
  }
}
function isUnread(s, currentId) {
  if (!s || s.blank || s.id === currentId) return false;
  if (s.running || s.pendingInteraction) return false;
  return (s.updatedAt || 0) > (lastReadMap[s.id] || 0);
}

// src/components/JobFeed.jsx
var import_jsx_runtime = require("react/jsx-runtime");
function JobFeed({ jobsBySession, openSession, max }) {
  const feed = [];
  for (const sid of Object.keys(jobsBySession)) {
    const jobs = jobsBySession[sid] || [];
    for (const job of jobs) feed.push({ sid, job });
  }
  feed.sort((a, b) => (b.job.startedAt || 0) - (a.job.startedAt || 0));
  const shown = (max ? feed.slice(0, max) : feed).filter(({ job }) => job.status === "running" || job.status === "stopping");
  if (shown.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshd-empty", children: "No live background jobs." });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: shown.map(({ sid, job }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshd-job", onClick: () => openSession(sid), title: "Open session", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshd-status " + jobStatusClass(job.status), children: job.status }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshd-badge", children: job.kind }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshd-job-label", children: job.label || job.id }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshd-mono", children: job.detail || "" })
  ] }, sid + ":" + job.id)) });
}

// src/components/SessionDetail.jsx
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime2 = require("react/jsx-runtime");
function detailCell(label, value) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-cell", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-detail-cell-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-detail-cell-value", children: value })
  ] });
}
function SessionDetail({ session, jobs, onClose, openSession }) {
  if (!session) return null;
  const st = statusOf(session, jobs);
  const stats = statsOf(session);
  const todos = session.projectionValues && Array.isArray(session.projectionValues.todos) ? session.projectionValues.todos : [];
  const done = todos.filter((t) => t.status === "completed").length;
  const goal = session.projectionValues && session.projectionValues.goals;
  const usage = usageOf(session);
  const usageTotal = usage ? (usage.uncachedInputTokens || 0) + (usage.outputTokens || 0) + (usage.cacheReadTokens || 0) + (usage.cacheWriteTokens || 0) : 0;
  const pctOf = (n) => usageTotal > 0 ? (n || 0) / usageTotal * 100 : 0;
  const pressure = session.projectionValues && session.projectionValues.contextPressure;
  const ctxRatio = contextRatio(pressure);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dshd-status " + statusClass(st), children: statusLabel(st) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dshd-detail-title", children: session.displayTitle || session.id }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "dshd-icon-btn", title: "Close details", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives.IconCloseFill14, {}) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-grid", children: [
      detailCell("Session ID", session.id),
      detailCell("CWD", session.cwd || "\u2014"),
      detailCell("Preset", session.agentPreset || "\u2014"),
      detailCell("Parent", session.parentId ? String(session.parentId).slice(0, 12) + "\u2026" : "\u2014"),
      detailCell("Origin", session.origin || "\u2014"),
      detailCell("Updated", formatTime(session.updatedAt, Date.now()))
    ] }),
    stats ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-detail-label", children: "Session stats" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-grid", children: [
        detailCell("Turns", String(stats.turns)),
        detailCell("Steps", String(stats.steps)),
        detailCell("LLM time", formatDuration(stats.llmMs)),
        detailCell("Tool time", formatDuration(stats.toolMs)),
        detailCell("TTFT", formatDuration(stats.ttftMs)),
        detailCell("Decode tokens", formatTokens(stats.decodeTokens))
      ] })
    ] }) : null,
    usage ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-detail-label", children: "Token usage (" + formatTokensFull(usageTotal) + " total)" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-grid", children: [
        detailCell("Input (uncached)", formatTokensFull(usage.uncachedInputTokens)),
        detailCell("Output", formatTokensFull(usage.outputTokens)),
        detailCell("Cache read", formatTokensFull(usage.cacheReadTokens)),
        detailCell("Cache write", formatTokensFull(usage.cacheWriteTokens)),
        detailCell("Total", formatTokensFull(usageTotal))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-stack", title: "Composition of total tokens: input / output / cache read / cache write", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: pctOf(usage.uncachedInputTokens) + "%", background: "var(--dsw-static-blue-400,#60a5fa)" } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: pctOf(usage.outputTokens) + "%", background: "var(--dsw-alias-state-success-primary,#22c55e)" } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: pctOf(usage.cacheReadTokens) + "%", background: "var(--dsw-static-neutral-bluish-600,#81858c)" } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: pctOf(usage.cacheWriteTokens) + "%", background: "var(--dsw-alias-state-warn-secondary,#f7ad31)" } })
      ] })
    ] }) : null,
    pressure ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-detail-label", children: "Context pressure" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-ctx", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-ctx-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "pressure " + (typeof pressure.pressureTokens === "number" ? formatTokensFull(pressure.pressureTokens) : "\u2014") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "window " + (pressure.contextWindow ? formatTokensFull(pressure.contextWindow) : "\u2014") })
        ] }),
        ctxRatio != null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-progress dshd-progress-ctx", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: Math.round(ctxRatio * 100) + "%" } }) }) : null,
        typeof pressure.projectedTokens === "number" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-mono", children: "projected next request: " + formatTokensFull(pressure.projectedTokens) }) : null
      ] })
    ] }) : null,
    todos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-detail-label", children: "Tasks (" + done + "/" + todos.length + ")" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { className: "dshd-todo-list", children: todos.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("li", { className: "dshd-todo " + (t.status === "completed" ? "dshd-todo-done" : t.status === "in_progress" ? "dshd-todo-active" : ""), children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dshd-todo-mark", children: t.status === "completed" ? "\u2713" : "\u25CB" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: t.content })
      ] }, i)) })
    ] }) : null,
    goal && typeof goal === "object" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-detail-label", children: "Goal" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-goal", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: String(goal.objective || "") }),
        goal.phase ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-mono", children: "phase: " + String(goal.phase) }) : null
      ] })
    ] }) : null,
    jobs && jobs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-detail-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dshd-detail-label", children: "Live jobs (" + jobs.filter((j) => j.status === "running" || j.status === "stopping").length + "/" + jobs.length + ")" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: jobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dshd-job", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dshd-status " + jobStatusClass(job.status), children: job.status }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dshd-badge", children: job.kind }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dshd-job-label", children: job.label || job.id })
      ] }, job.id)) })
    ] }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "dshd-close", onClick: () => {
      openSession(session.id);
    }, children: "Open session" })
  ] });
}

// src/components/SessionTree.jsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function SessionTree({ subagentsByParent, byId, openSession, expanded, onToggle }) {
  const roots = Object.keys(subagentsByParent).filter((pid) => {
    const parent = byId[pid];
    return parent && parent.origin !== "subagent";
  });
  if (roots.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dshd-empty", children: "No subagent hierarchies yet." });
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dshd-tree", children: roots.map((pid) => {
    const parent = byId[pid];
    const snap = subagentsByParent[pid];
    const children = snap && Array.isArray(snap.entries) ? snap.entries : [];
    const isOpen2 = expanded[pid];
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dshd-tree-node", onClick: () => onToggle(pid), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dshd-caret", children: children.length > 0 ? isOpen2 ? "\u25BE" : "\u25B8" : "" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dshd-dot " + (parent.running ? "dshd-dot-running" : "dshd-dot-idle") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dshd-sess-title", children: parent.displayTitle || parent.id }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dshd-mono", children: children.length > 0 ? children.length + " sub" : "" })
      ] }),
      isOpen2 && children.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dshd-tree-children", children: children.map((entry) => {
        const child = byId[entry.id];
        const label = entry.label || child && child.displayTitle || entry.id;
        const running = entry.activity === "running" || child && child.running;
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dshd-tree-node", onClick: (e) => {
          e.stopPropagation();
          openSession(entry.id);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dshd-dot " + (running ? "dshd-dot-running" : "dshd-dot-idle") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dshd-mono", children: entry.mode || "" })
        ] }, entry.id);
      }) }) : null
    ] }, pid);
  }) });
}

// src/components/NotifyToasts.jsx
var import_react4 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function NotifyBell({ size = 14 }) {
  const on = useNotify();
  const perm = useNotifyPermission();
  const title = !on ? "Notifications off (click to enable)" : perm === "granted" ? "Notifications on: window banner + toast + sound for completed, error, waiting (click to disable)" : perm === "denied" ? "Notifications on: toast + sound only \u2014 banners blocked by the browser (unblock via the lock icon in the address bar; click to disable)" : "Notifications on: toast + sound \u2014 toggle off/on to re-ask for banner permission (click to disable)";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "button",
    {
      type: "button",
      className: "dshd-icon-btn dshd-bell" + (on ? " dshd-bell-on" : ""),
      title,
      onClick: (e) => {
        e.stopPropagation();
        const next = !on;
        setNotify(next);
        if (next) {
          warmAudio();
          enableKeepAlive();
          playSound("waiting");
          requestNotifyPermission();
        }
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M8 1a1 1 0 0 1 1 1v.35A4.5 4.5 0 0 1 12.5 6.8c0 2.6.6 3.9 1.2 4.7.3.4 0 1-.5 1H2.8c-.5 0-.8-.6-.5-1 .6-.8 1.2-2.1 1.2-4.7A4.5 4.5 0 0 1 7 2.35V2a1 1 0 0 1 1-1Z" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M6.5 13.5a1.5 1.5 0 0 0 3 0Z" }),
          !on ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M2.5 2.5 13.5 13.5", stroke: "currentColor", strokeWidth: "1.4", fill: "none", strokeLinecap: "round" }) : null
        ] }),
        on ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dshd-bell-dot " + (perm === "granted" ? "dshd-bell-dot-ok" : "dshd-bell-dot-warn") }) : null
      ]
    }
  );
}
function NotifyToasts({ useSessions, openSession }) {
  const enabled = useNotify();
  const snap = useSessions((s) => s);
  const toasts2 = useToasts();
  const prevRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    setOpener((id) => {
      try {
        openSession(id);
      } catch (e) {
        console.warn("dashboard: openSession failed", e);
      }
    });
    return () => setOpener(null);
  }, [openSession]);
  (0, import_react4.useEffect)(() => {
    if (!enabled) {
      prevRef.current = null;
      return;
    }
    const { ids, byId, jobsBySession = {} } = snap;
    const sessions = ids.map((id) => byId[id]).filter(Boolean);
    watchStatuses(sessions, jobsBySession, prevRef, (ev) => {
      pushToast(ev);
      playSound(ev.kind);
      showNativeNotification(ev);
    }, snap.current);
  }, [snap, enabled]);
  if (!enabled || toasts2.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dshd-toasts", role: "status", "aria-live": "polite", children: toasts2.map((t) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      className: "dshd-toast dshd-toast-" + t.kind,
      title: "Open session",
      onClick: () => {
        dismissToast(t.key);
        try {
          openSession(t.id);
        } catch (e) {
          console.warn("dashboard: openSession failed", e);
        }
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dshd-toast-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dshd-toast-kind", children: t.label }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dshd-toast-time", children: formatTime(t.time, Date.now()) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dshd-toast-title", children: t.title })
      ]
    },
    t.key
  )) });
}

// src/components/DashboardPanel.jsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var EMPTY_LIST = [];
function StatCard({ value, label }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dshd-card-value", children: value }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dshd-card-label", children: label })
  ] });
}
function FilterChip({ id, label, count, active, setActive }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("button", { type: "button", className: "dshd-chip" + (active === id ? " dshd-chip-on" : ""), onClick: () => setActive(active === id ? "all" : id), children: [
    label,
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-chip-count", children: String(count) })
  ] });
}
function SessionRow({ s, jobs, current, onDetail, openSession, nowTs, showTokens }) {
  const prog = todoProgress(s.projectionValues);
  const jobsCount = jobs.length;
  const activeJobs = liveJobs(jobs);
  const st = statusOf(s, jobs);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "tr",
    {
      className: "dshd-row" + (s.id === current ? " dshd-row-current" : "") + sessionRowClass(st),
      onClick: () => {
        setOpen(false);
        try {
          openSession(s.id);
        } catch (e) {
          console.warn("dashboard: openSession failed", e);
        }
      },
      onDoubleClick: (e) => {
        e.stopPropagation();
        onDetail();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "dshd-status " + statusClass(st), children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: sessionDotClass(st) }),
          statusLabel(st)
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("td", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-sess-title", children: [
            s.displayTitle || s.id,
            isUnread(s, current) ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-new", style: { marginLeft: 6 }, children: "NEW" }) : null
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dshd-sess-sub", children: s.cwd || "" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { className: "dshd-mono", children: s.agentPreset || "\u2014" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { children: prog ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-progress", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { width: prog.pct + "%" } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-mono", style: { marginLeft: 6 }, children: prog.done + "/" + prog.total })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-mono", children: "\u2014" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { className: "dshd-mono", children: jobsCount > 0 ? activeJobs > 0 ? activeJobs + "/" + jobsCount : String(jobsCount) : "\u2014" }),
        showTokens ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { className: "dshd-mono", children: tokenCellText(s) }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { className: "dshd-mono", children: formatTime(s.updatedAt, nowTs) })
      ]
    }
  );
}
function tokenCellText(s) {
  const u = usageOf(s);
  if (!u) return "\u2014";
  const p = s.projectionValues && s.projectionValues.contextPressure;
  const ctx = contextRatio(p);
  const base = formatTokens(u.uncachedInputTokens) + "/" + formatTokens(u.outputTokens);
  return ctx == null ? base : base + " (" + Math.round(ctx * 100) + "%)";
}
function StatusSection({ title, sectionKey, items, dotClass, expanded, setExpanded, current, jobsBySession, onDetail, openSession, nowTs }) {
  const isOpen2 = expanded[sectionKey] !== false;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-section-head", onClick: () => setExpanded({ ...expanded, [sectionKey]: !isOpen2 }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-dot " + dotClass }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-section-title", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "dshd-section-meta", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-section-count", children: String(items.length) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-caret", children: isOpen2 ? "\u25BE" : "\u25B8" })
      ] })
    ] }),
    isOpen2 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("table", { className: "dshd-table", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { className: "dshd-col-status", children: "Status" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { className: "dshd-col-session", children: "Session" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { className: "dshd-col-preset", children: "Preset" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { className: "dshd-col-tasks", children: "Tasks" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { className: "dshd-col-jobs", children: "Jobs" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { className: "dshd-col-tokens", children: "Tokens" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { className: "dshd-col-updated", children: "Updated" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tbody", { children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("td", { colSpan: 7, className: "dshd-empty", children: "None" }) }) : items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SessionRow, { s, jobs: jobsBySession[s.id] || [], current, onDetail: () => onDetail(s.id), openSession, nowTs, showTokens: true }, s.id)) })
    ] }) : null
  ] });
}
function DashboardPanel(props) {
  const { useSessions } = props;
  const open = useOpen();
  const current = useSessions((s) => s.current);
  const currentUpdatedAt = useSessions((s) => {
    const row = s.current && s.byId[s.current];
    return row ? row.updatedAt || 0 : 0;
  });
  (0, import_react5.useEffect)(() => {
    if (current) markRead(current);
  }, [current, currentUpdatedAt]);
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DashboardPanelBody, { ...props });
}
function DashboardPanelBody({ useSessions, useWorkspaces, openSession }) {
  const snap = useSessions((s) => s);
  const wsItems = useWorkspaces((s) => s && Array.isArray(s.items) ? s.items : EMPTY_LIST);
  const now = useNow(5e3);
  const [sidebarWidth, setSidebarWidth] = (0, import_react5.useState)(0);
  const [search, setSearch] = (0, import_react5.useState)("");
  const [filter, setFilter] = (0, import_react5.useState)("all");
  const [detailId, setDetailId] = (0, import_react5.useState)(null);
  const [expandedSections, setExpandedSections] = (0, import_react5.useState)({ approval: true, input: true, running: true, error: true, completed: true, idle: true, ws: true, jobs: true, tree: true });
  const [expandedTree, setExpandedTree] = (0, import_react5.useState)({});
  const lastCurrent = (0, import_react5.useRef)(snap.current);
  (0, import_react5.useEffect)(() => {
    const changed = lastCurrent.current !== snap.current;
    lastCurrent.current = snap.current;
    if (changed) setOpen(false);
  }, [snap.current]);
  (0, import_react5.useEffect)(() => {
    const measure = () => {
      const layer = document.querySelector("[data-shell-overlay]");
      const frame2 = layer && layer.parentElement;
      const col = frame2 && frame2.firstElementChild;
      if (col) setSidebarWidth(Math.ceil(col.getBoundingClientRect().width));
    };
    measure();
    const ro = new ResizeObserver(measure);
    const frame = document.querySelector("[data-shell-overlay]")?.parentElement || null;
    if (frame) ro.observe(frame);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  (0, import_react5.useEffect)(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  (0, import_react5.useEffect)(() => {
    const onPointerDown = (e) => {
      const t = e.target;
      if (t && t.closest && (t.closest(".dshd-overlay") || t.closest(".dshd-trigger") || t.closest(".dshd-sticky") || t.closest(".dshd-sticky-pill"))) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);
  const { ids, byId, current, jobsBySession = EMPTY_OBJ, subagentsByParent = EMPTY_OBJ } = snap;
  const sessions = ids.map((id) => byId[id]).filter(Boolean);
  const running = sessions.filter((s) => s.running).length;
  const completed = sessions.filter((s) => s.completed).length;
  const stOf = (s) => statusOf(s, jobsBySession[s.id]);
  const stCount = {};
  for (const s of sessions) {
    const st = stOf(s);
    stCount[st] = (stCount[st] || 0) + 1;
  }
  const approvalCount = stCount.approval || 0;
  const inputCount = (stCount.question || 0) + (stCount.plan || 0);
  const errorCount = stCount.error || 0;
  const allJobs = Object.values(jobsBySession).reduce((n, jobs) => n + (Array.isArray(jobs) ? jobs.length : 0), 0);
  const activeJobs = Object.values(jobsBySession).reduce((n, jobs) => n + liveJobs(jobs), 0);
  const failedJobs = Object.values(jobsBySession).reduce((n, jobs) => n + (Array.isArray(jobs) ? jobs.filter((j) => j.status === "failed").length : 0), 0);
  const liveJobCount = Object.values(jobsBySession).reduce((n, jobs) => n + (Array.isArray(jobs) ? jobs.filter((j) => j && (j.status === "running" || j.status === "stopping")).length : 0), 0);
  const agg = { turns: 0, steps: 0, llmMs: 0, toolMs: 0, ttftMs: 0, ttftSteps: 0, decodeMs: 0, decodeTokens: 0 };
  const tok = usageTotals(sessions);
  for (const s of sessions) {
    const st = statsOf(s);
    if (!st) continue;
    for (const k of Object.keys(agg)) if (typeof st[k] === "number") agg[k] += st[k];
  }
  const query = search.trim().toLowerCase();
  const visible = sessions.filter((s) => {
    const st = stOf(s);
    const family = st === "question" || st === "plan" ? "input" : st;
    if (filter !== "all" && family !== filter) return false;
    if (!query) return true;
    return (s.displayTitle || "").toLowerCase().includes(query) || (s.cwd || "").toLowerCase().includes(query) || (s.agentPreset || "").toLowerCase().includes(query) || s.id.toLowerCase().includes(query);
  });
  const byStatus = {
    approval: visible.filter((s) => stOf(s) === "approval"),
    input: visible.filter((s) => stOf(s) === "question" || stOf(s) === "plan"),
    running: visible.filter((s) => stOf(s) === "running"),
    error: visible.filter((s) => stOf(s) === "error"),
    completed: visible.filter((s) => stOf(s) === "completed"),
    idle: visible.filter((s) => stOf(s) === "idle")
  };
  const statusSections = [
    { key: "approval", title: "Waiting for approval", items: byStatus.approval, dot: "dshd-dot-approval" },
    { key: "input", title: "Needs input", items: byStatus.input, dot: "dshd-dot-question" },
    { key: "running", title: "Running", items: byStatus.running, dot: "dshd-dot-running" },
    { key: "error", title: "Errors", items: byStatus.error, dot: "dshd-dot-error" },
    { key: "completed", title: "Completed", items: byStatus.completed, dot: "dshd-dot-completed" },
    { key: "idle", title: "Idle", items: byStatus.idle, dot: "dshd-dot-idle" }
  ];
  const selectedDetail = detailId ? byId[detailId] : null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-overlay", style: { left: sidebarWidth }, role: "dialog", "aria-label": "Session dashboard", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives2.IconDataOutline16, {}),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-title", children: "Session Dashboard" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(NotifyBell, {}),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "dshd-icon-btn", title: "Close", onClick: () => setOpen(false), children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_dsh_client_ui_primitives2.IconCloseFill14, {}) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-cards", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: String(sessions.length), label: "Total sessions" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: String(running), label: "Running" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: String(completed), label: "Completed" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: String(approvalCount), label: "Waiting for approval" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: activeJobs + "/" + allJobs, label: "Jobs active/total" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: String(failedJobs), label: "Errored jobs (crashed)" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: String(agg.turns), label: "Total turns" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: String(agg.steps), label: "Total steps" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: formatTokens(agg.decodeTokens), label: "Decode tokens" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: formatDuration(agg.llmMs), label: "LLM time" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: formatDuration(agg.toolMs), label: "Tool time" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: formatDuration(agg.ttftMs), label: "TTFT total" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: formatTokensFull(tok.input), label: "Input tokens (uncached)" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: formatTokensFull(tok.output), label: "Output tokens" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: formatTokensFull(tok.cacheRead), label: "Cache read tokens" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatCard, { value: formatTokensFull(tok.cacheWrite), label: "Cache write tokens" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-toolbar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { className: "dshd-search", type: "search", placeholder: "Search title, cwd, preset...", value: search, onChange: (e) => setSearch(e.target.value) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FilterChip, { id: "all", label: "All", count: sessions.length, active: filter, setActive: setFilter }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FilterChip, { id: "running", label: "Running", count: running, active: filter, setActive: setFilter }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FilterChip, { id: "approval", label: "Approval", count: approvalCount, active: filter, setActive: setFilter }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FilterChip, { id: "input", label: "Needs input", count: inputCount, active: filter, setActive: setFilter }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FilterChip, { id: "error", label: "Errors", count: errorCount, active: filter, setActive: setFilter }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FilterChip, { id: "completed", label: "Completed", count: completed, active: filter, setActive: setFilter }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FilterChip, { id: "idle", label: "Idle", count: stCount.idle || 0, active: filter, setActive: setFilter })
      ] }),
      wsItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-section", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-section-head", onClick: () => setExpandedSections({ ...expandedSections, ws: !expandedSections.ws }), children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-section-title", children: "Workspaces" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-section-count", children: expandedSections.ws !== false ? "\u25BE" : "\u25B8" })
        ] }),
        expandedSections.ws !== false ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dshd-ws-group", children: wsItems.map((w) => {
          const wids = Array.isArray(w.sessionIds) ? w.sessionIds.filter((sid) => byId[sid]) : [];
          if (wids.length === 0) return null;
          const wsKey = "ws:" + w.workspaceId;
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-ws-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-ws-head", onClick: () => setExpandedTree({ ...expandedTree, [wsKey]: !expandedTree[wsKey] }), children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-caret", children: expandedTree[wsKey] ? "\u25BE" : "\u25B8" }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: w.title || w.path || w.workspaceId }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-mono", children: wids.length + " sessions" })
            ] }),
            expandedTree[wsKey] ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("table", { className: "dshd-table", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tbody", { children: wids.map((sid) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SessionRow, { s: byId[sid], jobs: jobsBySession[sid] || [], current, onDetail: () => setDetailId(sid), openSession, nowTs: now, showTokens: true }, sid)) }) }) : null
          ] }, w.workspaceId);
        }) }) : null
      ] }) : null,
      statusSections.filter((sec) => sec.items.length > 0).map((sec) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StatusSection, { title: sec.title, sectionKey: sec.key, items: sec.items, dotClass: sec.dot, expanded: expandedSections, setExpanded: setExpandedSections, current, jobsBySession, onDetail: setDetailId, openSession, nowTs: now }, sec.key)),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-section", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-section-head", onClick: () => setExpandedSections({ ...expandedSections, jobs: !expandedSections.jobs }), children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-section-title", children: "Job activity" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-section-count", children: String(liveJobCount) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-section-count", children: expandedSections.jobs !== false ? "\u25BE" : "\u25B8" })
        ] }),
        expandedSections.jobs !== false ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(JobFeed, { jobsBySession, openSession, max: 12 }) : null
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-section", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dshd-section-head", onClick: () => setExpandedSections({ ...expandedSections, tree: !expandedSections.tree }), children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-section-title", children: "Session hierarchy" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dshd-section-count", children: expandedSections.tree !== false ? "\u25BE" : "\u25B8" })
        ] }),
        expandedSections.tree !== false ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SessionTree, { subagentsByParent, byId, openSession, expanded: expandedTree, onToggle: (pid) => setExpandedTree({ ...expandedTree, [pid]: !expandedTree[pid] }) }) : null
      ] }),
      selectedDetail ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SessionDetail, { session: selectedDetail, jobs: jobsBySession[selectedDetail.id] || [], onClose: () => setDetailId(null), openSession }) : null
    ] })
  ] });
}

// src/components/DashboardTrigger.jsx
var import_dsh_client_ui_primitives3 = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime6 = require("react/jsx-runtime");
function stickyIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" }) });
}
function DashboardTrigger(props) {
  const open = useOpen();
  const sticky = useSticky();
  const { useSessions, wide } = props;
  const runningCount = useSessions((s) => s.ids.filter((id) => {
    const row = s.byId[id];
    return row && row.running;
  }).length);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dshd-trigger-group", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "button",
      {
        type: "button",
        className: "dshd-trigger" + (open ? " dshd-trigger-open" : ""),
        onClick: () => setOpen(!open),
        title: "Session dashboard",
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_dsh_client_ui_primitives3.IconDataOutline16, {}),
          wide ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "Dashboard" }) : null,
          runningCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "dshd-trigger-badge", children: runningCount + " running" }) : null
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "button",
      {
        type: "button",
        className: "dshd-pin" + (sticky ? " dshd-pin-on" : ""),
        onClick: () => setSticky(!sticky),
        title: sticky ? "Turn off sticky dashboard" : "Turn on sticky dashboard",
        "aria-pressed": sticky,
        children: [
          stickyIcon(),
          wide && sticky ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "Sticky" }) : null
        ]
      }
    )
  ] });
}

// src/components/StickyWidget.jsx
var import_react6 = require("react");
var import_dsh_client_ui_primitives4 = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime7 = require("react/jsx-runtime");
var STICKY_POS_KEY = "dshd-sticky-pos";
var STICKY_WIDTH = 340;
function loadStickyPos() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STICKY_POS_KEY) : null;
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p.x === "number" && typeof p.y === "number") return p;
  } catch {
  }
  return null;
}
function findSessionLogBtn() {
  try {
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      if (btn.textContent && btn.textContent.includes("Session log")) return btn;
    }
  } catch {
  }
  return null;
}
function defaultPosNearSessionLog() {
  try {
    const btn = findSessionLogBtn();
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    const x = Math.max(8, rect.left - 8 - STICKY_WIDTH);
    const y = Math.max(8, rect.top - 12);
    return { x, y };
  } catch {
    return null;
  }
}
function StickyWidget({ useSessions, openSession }) {
  const sticky = useSticky();
  const ids = useSessions((s) => s.ids);
  const byId = useSessions((s) => s.byId);
  const current = useSessions((s) => s.current);
  const jobsBySession = useSessions((s) => s.jobsBySession || EMPTY_OBJ);
  const now = useNow(5e3);
  const [minimized, setMinimized] = (0, import_react6.useState)(false);
  const [pos, setPos] = (0, import_react6.useState)(loadStickyPos);
  const posRef = (0, import_react6.useRef)(pos);
  const rootRef = (0, import_react6.useRef)(null);
  const dragRef = (0, import_react6.useRef)(null);
  const movedRef = (0, import_react6.useRef)(false);
  (0, import_react6.useEffect)(() => {
    if (posRef.current) return;
    const d = defaultPosNearSessionLog();
    if (d) {
      posRef.current = d;
      setPos(d);
    }
  }, []);
  if (!sticky) return null;
  const endDrag = (e) => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    d.el.style.transform = "";
    let dx = 0, dy = 0;
    if (e) {
      dx = e.clientX - d.startX;
      dy = e.clientY - d.startY;
    }
    const p = {
      x: Math.round(Math.max(8, Math.min(window.innerWidth - d.el.offsetWidth - 8, d.baseX + dx))),
      y: Math.round(Math.max(8, Math.min(window.innerHeight - d.el.offsetHeight - 8, d.baseY + dy)))
    };
    posRef.current = p;
    setPos(p);
    try {
      localStorage.setItem(STICKY_POS_KEY, JSON.stringify(p));
    } catch {
    }
    if (d.el.releasePointerCapture) {
      try {
        d.el.releasePointerCapture(e && e.pointerId);
      } catch {
      }
    }
    setTimeout(() => {
      movedRef.current = false;
    }, 0);
  };
  const onDragStart = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (e.target.closest && e.target.closest("button")) return;
    const el = rootRef.current;
    if (!el) return;
    el.style.transform = "";
    const rect = el.getBoundingClientRect();
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: rect.left, baseY: rect.top, el, pointerId: e.pointerId };
    movedRef.current = false;
    if (el.setPointerCapture) {
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
      }
    }
    e.preventDefault();
  };
  const onDragMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    if (!(e.buttons & 1)) {
      endDrag(e);
      return;
    }
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) movedRef.current = true;
    d.el.style.transform = "translate(" + dx + "px," + dy + "px)";
  };
  const onDragEnd = (e) => {
    endDrag(e);
  };
  const posStyle = pos ? { left: pos.x + "px", top: pos.y + "px" } : void 0;
  const startOfToday = /* @__PURE__ */ new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const sessions = ids.map((id) => byId[id]).filter(Boolean);
  const runningCount = sessions.filter((s) => s.running).length;
  const activeJobs = Object.values(jobsBySession).reduce((n, jobs) => n + liveJobs(jobs), 0);
  const todays = sessions.filter((s) => (s.updatedAt || 0) >= startOfToday.getTime());
  const unreadCount = todays.filter((s) => isUnread(s, current)).length;
  const failedJobs = todays.filter((s) => {
    const jobs = jobsBySession[s.id];
    return Array.isArray(jobs) && jobs.some((j) => j && j.status === "failed");
  }).length;
  const rankOf = (s) => {
    const st = statusOf(s, jobsBySession[s.id]);
    if (isUnread(s, current)) return 0;
    if (st === "approval") return 1;
    if (st === "question" || st === "plan") return 2;
    if (st === "running") return 3;
    if (st === "error") return 4;
    return 5;
  };
  const ordered = todays.slice().sort((a, b) => rankOf(a) - rankOf(b) || (b.updatedAt || 0) - (a.updatedAt || 0));
  const attentionCount = todays.filter((s) => {
    const st = statusOf(s, jobsBySession[s.id]);
    return st === "approval" || st === "question" || st === "plan";
  }).length;
  const dragProps = { onPointerDown: onDragStart, onPointerMove: onDragMove, onPointerUp: onDragEnd, onPointerCancel: onDragEnd };
  if (minimized) {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        ref: rootRef,
        className: "dshd-sticky-pill" + (attentionCount > 0 ? " dshd-pill-attn" : ""),
        style: posStyle,
        title: "Expand sticky dashboard (drag to move)",
        onClick: () => {
          if (!movedRef.current) setMinimized(false);
        },
        ...dragProps,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-dot " + (attentionCount > 0 ? "dshd-dot-approval dshd-dot-attention" : runningCount > 0 ? "dshd-dot-running" : "dshd-dot-idle") }),
          unreadCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-new", children: unreadCount + " NEW" }) : null,
          attentionCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-wait", children: attentionCount + " waiting" }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: runningCount + " running" }),
          activeJobs > 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-sticky-meta", children: activeJobs + " jobs" }) : null
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { ref: rootRef, className: "dshd-sticky", role: "dialog", "aria-label": "Sticky dashboard", style: posStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "dshd-sticky-head", ...dragProps, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-dot " + (runningCount > 0 ? "dshd-dot-running" : "dshd-dot-idle") }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-sticky-title", children: "Live summary" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-sticky-meta", children: (unreadCount > 0 ? unreadCount + " new \xB7 " : "") + runningCount + "/" + sessions.length + " running" + (attentionCount > 0 ? " \xB7 " + attentionCount + " waiting" : "") + (activeJobs > 0 ? " \xB7 " + activeJobs + " jobs" : "") + (failedJobs > 0 ? " \xB7 " + failedJobs + " errored" : "") }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(NotifyBell, {}),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", className: "dshd-icon-btn", title: "Minimize", onClick: () => setMinimized(true), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { fontSize: 12, lineHeight: 1 }, children: "\u2013" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", className: "dshd-icon-btn", title: "Turn off sticky dashboard", onClick: () => setSticky(false), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_dsh_client_ui_primitives4.IconCloseFill14, {}) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "dshd-sticky-body", children: ordered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "dshd-sticky-empty", children: "No sessions active today." }) : ordered.map((s) => {
      const prog = todoProgress(s.projectionValues);
      const jobs = jobsBySession[s.id] || [];
      const act = liveJobs(jobs);
      const stX = statusOf(s, jobs);
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "dshd-sticky-row" + sessionRowClass(stX), onClick: () => {
        try {
          openSession(s.id);
        } catch {
        }
      }, title: "Open session", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: sessionDotClass(stX) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-sticky-name", children: s.displayTitle || s.id }),
        isUnread(s, current) ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-new", children: "NEW" }) : null,
        prog ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-progress dshd-sticky-prog", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { width: prog.pct + "%" } }) }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dshd-sticky-meta", children: act > 0 ? act + " jobs" : formatTime(s.updatedAt, now) })
      ] }, s.id);
    }) })
  ] });
}

// src/client.jsx
injectCss();
installFrameBridge();
var inject = ["sessions", "slots"];
function apply(ctx) {
  const openSession = (id) => {
    ctx.sessions.open(id);
  };
  ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
    name: "sidebar.footer.action",
    id: "dashboard-trigger",
    order: 100
  }, DashboardTrigger));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "dashboard-panel",
    order: 10,
    inject: () => ({ openSession })
  }, DashboardPanel));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "dashboard-sticky",
    order: 20,
    inject: () => ({ openSession })
  }, StickyWidget));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "dashboard-notify",
    order: 30,
    inject: () => ({ openSession })
  }, NotifyToasts));
}

		return module.exports;
	}
});

