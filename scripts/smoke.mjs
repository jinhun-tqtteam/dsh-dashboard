/**
 * Dependency-free smoke test for lib/client.js (node scripts/smoke.mjs).
 * Catches the "truncated bundle" class of regressions: syntax errors, a
 * missing factory registration, or a broken client plugin face — without
 * needing a browser or the DSH host.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = await readFile(path.join(root, "lib", "client.js"), "utf8");

// Phase 1 — the file must parse at all.
new Function(code);
console.log("ok  syntax");

// Phase 2 — executing the bundle must register exactly one factory.
const registered = [];
const windowShim = {
  __ModuleLoader__: {
    load: (def) => registered.push(def),
  },
};
const react = {
  createElement: (type, props) => ({ $$el: true, type, props }),
  Fragment: Symbol.for("react.fragment"),
  useSyncExternalStore: () => false,
  useState: (init) => [typeof init === "function" ? init() : init, () => {}],
  useEffect: () => {},
  useRef: (v) => ({ current: v }),
};
const jsxRuntime = {
  Fragment: Symbol.for("react.fragment"),
  jsx: (type, props, key) => ({ $$el: true, type, props, key }),
  jsxs: (type, props, key) => ({ $$el: true, type, props, key }),
};
const primitives = new Proxy({}, { get: (_t, key) => ({ displayName: String(key) }) });
const requireShim = (name) => {
  if (name === "react") return react;
  if (name === "react/jsx-runtime") return jsxRuntime;
  if (name === "@deepseek-ai/dsh-client-ui-primitives") return primitives;
  throw new Error("unexpected require: " + name);
};

new Function("window", "require", code)(windowShim, requireShim);
if (registered.length !== 1) throw new Error("expected exactly 1 __ModuleLoader__ registration, got " + registered.length);
const def = registered[0];
if (def.id !== "@dsh-user/dsh-dashboard") throw new Error("registered wrong id: " + def.id);
console.log("ok  registration: " + def.id);

// Phase 3 — the factory must yield the client plugin face: apply + inject.
const mod = def.factory(requireShim);
if (typeof mod.apply !== "function") throw new Error("exports.apply is not a function");
if (!Array.isArray(mod.inject) || !mod.inject.includes("sessions") || !mod.inject.includes("slots")) {
  throw new Error("exports.inject must contain 'sessions' and 'slots', got " + JSON.stringify(mod.inject));
}
console.log("ok  exports: apply + inject [" + mod.inject.join(", ") + "]");

// Phase 4 — apply() must wire all four slots, with openSession -> sessions.open.
const opened = [];
const slotEntries = [];
const ctx = {
  slots: {
    inject: (key, fn) => {
      const out = fn();
      if (out) slotEntries.push({ key, ...out });
    },
    register: (spec, component) => ({ spec, component }),
  },
  sessions: { open: (id) => opened.push(id) },
  effect: () => () => {},
};
mod.apply(ctx);
if (slotEntries.length !== 4) throw new Error("expected 4 slot entries, got " + slotEntries.length);
const byId = Object.fromEntries(slotEntries.map((e) => [e.spec.id, e]));
for (const id of ["dashboard-trigger", "dashboard-panel", "dashboard-sticky", "dashboard-notify"]) {
  if (!byId[id]) throw new Error("missing slot entry id: " + id + " — got: " + Object.keys(byId).join(", "));
}
if (byId["dashboard-trigger"].key !== "sidebar.footer.action") throw new Error("trigger registered into wrong slot: " + byId["dashboard-trigger"].key);
for (const id of ["dashboard-panel", "dashboard-sticky", "dashboard-notify"]) {
  if (byId[id].key !== "shell.overlay") throw new Error(id + " registered into wrong slot: " + byId[id].key);
  byId[id].spec.inject().openSession("sess-1");
}
if (opened.length !== 3 || !opened.every((x) => x === "sess-1")) throw new Error("openSession did not route to ctx.sessions.open: " + JSON.stringify(opened));
console.log("ok  slots: sidebar.footer.action(trigger) + shell.overlay(panel, sticky, notify); openSession -> sessions.open");

console.log("smoke: all checks passed");