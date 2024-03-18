/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";

import "@fontsource-variable/inter";
import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { lazy } from "solid-js";
import App from "./App";

const Home = lazy(() => import("./routes/Home"));
const Clipboard = lazy(() => import("./routes/Clipboard"));
const Resource = lazy(() => import("./routes/Resource"));

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		"Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
	);
}

const queryClient = new QueryClient();

render(
	() => (
		<QueryClientProvider client={queryClient}>
			<Router root={App}>
				<Route path="/resource/:id" component={Resource} />
				<Route path="/clipboard" component={Clipboard} />
				<Route path="/" component={Home} />
			</Router>
		</QueryClientProvider>
	),
	root
);
