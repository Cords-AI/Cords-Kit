import { Component, For, createResource } from "solid-js";
import ServiceItem from "../components/ServiceItem";
import { ServiceSchema } from "../lib/service";

type Props = {
	id: string;
};

const fetchService = async (id: string) => {
	const response = await fetch(`https://api.cords.ai/resource/${id}`);
	const data = await response.json();
	const service = ServiceSchema.parse(data);
	return service;
};

const Home: Component<Props> = (props) => {
	const [service] = createResource(props.id, () => fetchService(props.id));

	return (
		<>
			<div class="py-2 text-black flex flex-col gap-2 bg-slate-100">
				{service.loading && (
					<div class="flex-1 flex justify-center items-center">Loading...</div>
				)}
				{service.error && <div class="flex-1 flex justify-center items-center">Error</div>}
				{service() && service().hydratedSimilarResources && (
					<For each={service().hydratedSimilarResources}>
						{(service) => {
							return <ServiceItem service={service} />;
						}}
					</For>
				)}
			</div>
		</>
	);
};

export default Home;
