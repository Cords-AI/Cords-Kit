import { A } from "@solidjs/router";
import { convert } from "html-to-text";
import { Component } from "solid-js";
import { Service } from "../lib/service";

type Props = {
	service: Service;
};

const ServiceItem: Component<Props> = (props) => {
	return (
		<A
			href={`/resource/${props.service.id}`}
			class="bg-elevation1 px-8 py-4 flex flex-col gap-1.5 items-start max-w-full border-hairline border-t"
		>
			<p class="font-header text-primary">{props.service.name.en}</p>
			<p class="text-sm line-clamp-2 max-w-full">{convert(props.service.description.en)}</p>
		</A>
	);
};

export default ServiceItem;
