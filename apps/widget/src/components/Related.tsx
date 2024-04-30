import { ResourceType } from "@cords/sdk";
import { A, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { convert } from "html-to-text";
import { Component, For, Show } from "solid-js";
import { useCords } from "../lib/cords";

const RelatedItem: Component<{
	service: ResourceType;
}> = (props) => {
	const [query] = useSearchParams();
	return (
		<A
			href={`/resource/${props.service.id}?${new URLSearchParams(query).toString()}`}
			class="bg-primary hover:bg-opacity-10 bg-opacity-5 rounded-lg border border-primary p-3 flex flex-col gap-1.5 items-start"
		>
			<p class="font-header text-sm text-primary">{props.service.name.en}</p>
			<p class="text-xs line-clamp-2 max-w-full">{convert(props.service.description.en)}</p>
		</A>
	);
};

type Props = {
	id: string;
};

const Related: Component<{
	id: string;
}> = (props) => {
	const cords = useCords();
	const related = createQuery(() => ({
		queryKey: ["related", props.id],
		queryFn: () => cords.related(props.id),
		throwOnError: true,
		suspense: true,
	}));

	return (
		<Show when={related.data?.data.length > 0}>
			<h3>Related Resources</h3>
			<For each={related.data.data}>{(service) => <RelatedItem service={service} />}</For>
		</Show>
	);
};

export default Related;
