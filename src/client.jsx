import { injectCss } from "./styles.js";
import { DashboardPanel } from "./components/DashboardPanel.jsx";
import { DashboardTrigger } from "./components/DashboardTrigger.jsx";
import { StickyWidget } from "./components/StickyWidget.jsx";

injectCss();

/** Services this client plugin face needs from the runtime. */
export const inject = ["sessions", "slots"];

/**
 * Client plugin body: wire the three UI entries into the slot system.
 * useSessions/useWorkspaces are standard props supplied by the host for
 * root-scope slots; openSession is provided per entry via the descriptor
 * inject factory (it is not a standard prop).
 */
export function apply(ctx) {
	const openSession = (id) => { ctx.sessions.open(id); };
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
}