import type { Session } from "@supabase/supabase-js";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { queryClient } from "@/lib/query/queryClient";
import { routeTree } from "@/lib/router/routeTree.gen";
import { useAuthStore } from "@/lib/stores/auth";
import { supabase } from "@/lib/supabase";
import "./index.css";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
	defaultErrorComponent: ({ error }: { error: Error }) => (
		<div className="p-4 text-red-500 font-bold">
			Global Error: {error.message}
		</div>
	),
});

// Auth Synchronization with user existence check
async function ensureUserExists(session: Session | null) {
	if (!session?.user?.id) return;

	try {
		const { data } = await supabase
			.from("users")
			.select("id")
			.eq("id", session.user.id)
			.maybeSingle();

		if (!data) {
			console.warn("User not found in public.users — signing out");
			await supabase.auth.signOut();
			useAuthStore.getState().setSession(null);
		}
	} catch (err) {
		console.error("Error checking user existence", err);
	}
}

supabase.auth.onAuthStateChange((_event, session) => {
	useAuthStore.getState().setSession(session);
	// Fire-and-forget check to avoid blocking auth flow
	void ensureUserExists(session);
});

// Initial Session Load & App Mount (with existence check)
supabase.auth.getSession().then(({ data: { session } }) => {
	useAuthStore.getState().setSession(session);
	void ensureUserExists(session);

	const rootElement = document.getElementById("root");
	if (!rootElement) {
		console.error("Root element not found");
		return;
	}

	if (!rootElement.innerHTML) {
		const root = ReactDOM.createRoot(rootElement);
		root.render(
			<StrictMode>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<QueryClientProvider client={queryClient}>
						<RouterProvider router={router} />
					</QueryClientProvider>
				</ThemeProvider>
			</StrictMode>,
		);
	}
});
