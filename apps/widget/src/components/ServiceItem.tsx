import { SearchResourceType } from "@cords/sdk";
import { convert } from "html-to-text";
import { Show } from "solid-js";
import { getLocalizedField, useTranslation } from "@/translations";
import { partnerMapping } from "./PartnerLogo";
import { Link } from "@tanstack/solid-router";

const ServiceItem = (props: { service: SearchResourceType }) => {
	const { locale } = useTranslation();

	return (
		<Link to="/resource/$id" params={{ id: props.service.id }}>
			<div class="bg-elevation1 p-6 flex flex-col gap-2 items-start max-w-full border-hairline border-t">
				<p class="font-header text-primary">
					{getLocalizedField(props.service.name, locale())}
				</p>
				<p class="text-sm line-clamp-2 max-w-full">
					{convert(
						getLocalizedField(props.service.description, locale())!,
					)}
				</p>
				<div class="flex gap-1 items-center">
					<div class="border rounded h-6 flex justify-center items-center px-2 border-typography-heading-color text-[10px] font-bold">
						{partnerMapping[props.service.partner].label}
					</div>
					<Show when={props.service.delivery}>
						{(delivery) => (
							<div class="border rounded h-6 flex justify-center items-center px-2 border-typography-heading-color text-[10px] font-bold">
								{delivery()[0].toUpperCase() +
									delivery().slice(1)}
							</div>
						)}
					</Show>
				</div>
			</div>
		</Link>
	);
};

export default ServiceItem;
