/* @refresh reload */
import { render } from "solid-js/web";

import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import App from "./App";
import "./index.css";

const root = document.getElementById("cords");

if (!root) {
	console.log("No root element found");
}

const queryClient = new QueryClient();

if (root) {
	render(
		() => (
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		),
		root!
	);
}
