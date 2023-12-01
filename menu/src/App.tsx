import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Pages from "./components/Pages";

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<h1 className="text-xl py-4">CORDS</h1>
			<Pages />
		</QueryClientProvider>
	);
};

export default App;
