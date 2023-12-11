/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";

import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import App from "./App";

const Home = lazy(() => import("./routes/Home"));
const Clipboard = lazy(() => import("./routes/Clipboard"));

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		"Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
	);
}

render(
	() => (
		<Router root={App}>
			<Route path="/clipboard" component={Clipboard} />
			<Route path="/" component={Home} />
		</Router>
	),
	root
);
