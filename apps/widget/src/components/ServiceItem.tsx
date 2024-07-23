import { SearchResourceType } from "@cords/sdk";
import { A } from "@solidjs/router";
import { convert } from "html-to-text";
import { Component, Show } from "solid-js";
import { useSearchParams } from "~/lib/params";
import { getLocalizedField, useTranslation } from "~/translations";
import { partnerMapping } from "./PartnerLogo";

type Props = {
	service: SearchResourceType;
};

const ServiceItem: Component<Props> = (props) => {
	const { locale } = useTranslation();
	const [query] = useSearchParams();
	const { t } = useTranslation();

	return (
		<A
			href={`/resource/${props.service.id}?${new URLSearchParams(query).toString()}`}
			class="bg-elevation1 p-6 flex flex-col gap-2 items-start max-w-full border-hairline border-t"
		>
			<p class="font-header text-primary">
				{getLocalizedField(props.service.name, locale())}
			</p>
			<p class="text-sm line-clamp-2 max-w-full">
				{convert(getLocalizedField(props.service.description, locale())!)}
			</p>
			<Show
				when={
					props.service.result &&
					props.service.delivery === "local" &&
					props.service.result.distance
				}
			>
				{(distance) => (
					<div class="text-[11px] font-medium">
						<span class="text-body">{t().resource.distance}</span>{" "}
						<span class="text-steel">
							{distance() > 1000
								? `${(distance() / 1000).toFixed(2)} km`
								: `${distance()} m`}
						</span>
					</div>
				)}
			</Show>
			<div class="flex gap-1 items-center">
				<div class="border rounded h-6 flex justify-center items-center px-2 border-typography-heading-color text-[10px] font-bold">
					{partnerMapping[props.service.partner].label}
				</div>
				<Show when={props.service.delivery}>
					{(delivery) => (
						<div class="border rounded h-6 flex justify-center items-center px-2 border-typography-heading-color text-[10px] font-bold">
							{delivery()[0].toUpperCase() + delivery().slice(1)}
						</div>
					)}
				</Show>
			</div>
		</A>
	);
};

export default ServiceItem;
