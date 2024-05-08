import { ResourceType } from "@cords/sdk";
import { A } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { convert } from "html-to-text";
import { Component, Show } from "solid-js";
import { useCords } from "../lib/cords";
import { useSearchParams } from "../lib/params";
import { getLocalizedField, useTranslation } from "../translations";

type Props = {
	service: ResourceType;
};

const ServiceItem: Component<Props> = (props) => {
	const { locale } = useTranslation();
	const cords = useCords();
	const [query] = useSearchParams();
	const resource = createQuery(() => ({
		queryKey: ["resource", props.service.id],
		queryFn: () => cords.resource(props.service.id),
		initialData: props.service,
		throwOnError: true,
	}));

	return (
		<Show when={resource.data}>
			{(resource) => (
				<A
					href={`/resource/${resource().id}?${new URLSearchParams(query).toString()}`}
					class="bg-elevation1 px-8 py-4 flex flex-col gap-1.5 items-start max-w-full border-hairline border-t"
				>
					<p class="font-header text-primary">
						{getLocalizedField(resource().name, locale())}
					</p>
					<p class="text-sm line-clamp-2 max-w-full">
						{convert(getLocalizedField(resource().description, locale())!)}
					</p>
				</A>
			)}
		</Show>
	);
};

export default ServiceItem;
