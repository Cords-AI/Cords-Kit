import "@fontsource-variable/inter";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import "./app.css";
import { Layout } from "./Layout";

const queryClient = new QueryClient();

export default function App() {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<Title>CORDS Widget</Title>
					<QueryClientProvider client={queryClient}>
						<Layout>{props.children}</Layout>
					</QueryClientProvider>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
