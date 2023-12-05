import { For, createResource } from "solid-js";
import ServiceItem from "../components/ServiceItem";
import { clipboardIDs, fetchClipboard } from "../lib/clipboard";

const Clipboard = () => {
	const [clipboardServices] = createResource(
		() => clipboardIDs(),
		() => fetchClipboard(clipboardIDs())
	);

	if (clipboardServices() && clipboardServices().length === 0) {
		return <div class="p-3 text-black bg-slate-100">Empty</div>;
	}

	return (
		<div class="p-3 text-black bg-slate-100">
			{clipboardServices.loading && (
				<div class="flex-1 flex justify-center items-center">Loading...</div>
			)}
			{clipboardServices.error && (
				<div class="flex-1 flex justify-center items-center">Error</div>
			)}
			{clipboardServices() && (
				<For each={clipboardServices()}>
					{(service) => <ServiceItem service={service} />}
				</For>
			)}
		</div>
	);
};

export default Clipboard;
