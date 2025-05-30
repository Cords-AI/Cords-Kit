// app/router.tsx
import {
	createRouter as createTanStackRouter,
	ErrorComponent,
} from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

const queryClient = new QueryClient();

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: false,
		defaultErrorComponent: ErrorComponent,
		defaultNotFoundComponent: () => <div>404</div>,
		Wrap: ({ children }) => (
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		),
	});

	return router;
}

declare module "@tanstack/solid-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
