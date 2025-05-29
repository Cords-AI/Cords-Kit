import { SearchResourceType } from "@cords/sdk";
import { convert } from "html-to-text";
import { Component, Show } from "solid-js";
import { getLocalizedField, useTranslation } from "@/translations";
import { partnerMapping } from "./PartnerLogo";
import { Link, useSearch } from "@tanstack/solid-router";

type Props = {
	service: SearchResourceType;
};

const ServiceItem: Component<Props> = (props) => {
	const { locale } = useTranslation();
	const { query } = useSearch({
		from: "__root__",
	});
	const { t } = useTranslation();

	return (
		<Link
			to="/resource/$id"
			params={{ id: props.service.id }}
			search={(s) => s}
			class="bg-elevation1 p-6 flex flex-col gap-2 items-start max-w-full border-hairline border-t"
		>
			<p class="font-header text-primary">
				{getLocalizedField(props.service.name, locale())}
			</p>
			<p class="text-sm line-clamp-2 max-w-full">
				{convert(
					getLocalizedField(props.service.description, locale())!,
				)}
			</p>
			{props.service.result &&
				props.service.delivery === "local" &&
				props.service.result.distance && (
					<div class="text-[11px] font-medium">
						<span class="text-body">{t().resource.distance}</span>{" "}
						<span class="text-steel">
							{props.service.result.distance > 1000
								? `${(props.service.result.distance / 1000).toFixed(2)} km`
								: `${props.service.result.distance} m`}
						</span>
					</div>
				)}
			<div class="flex gap-1 items-center">
				<div class="border rounded-sm h-6 flex justify-center items-center px-2 border-typography-heading-color text-[10px] font-bold">
					{partnerMapping[props.service.partner].label}
				</div>
				{props.service.delivery && (
					<div class="border rounded-sm h-6 flex justify-center items-center px-2 border-typography-heading-color text-[10px] font-bold">
						{props.service.delivery[0].toUpperCase() +
							props.service.delivery.slice(1)}
					</div>
				)}
			</div>
		</Link>
	);
};

export default ServiceItem;
