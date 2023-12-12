import { convert } from "html-to-text";
import { Component } from "solid-js";
import { clipboardIDs, setClipboardIDs } from "../lib/clipboard";
import { Service } from "../lib/service";
import { formatServiceAddress } from "../lib/utils";

type Props = {
	service: Service;
};

const ServiceItem: Component<Props> = (props) => {
	return (
		<div class="bg-elevation1 px-8 py-4 flex flex-col gap-1.5 items-start max-w-full border-hairline border-t">
			<p class="font-header text-primary">{props.service.name.en}</p>
			<p class="text-sm line-clamp-2 max-w-full">{convert(props.service.description.en)}</p>
			<div class="flex gap-2">
				<button
					onClick={() => {
						if (clipboardIDs().includes(props.service.id)) {
							setClipboardIDs(clipboardIDs().filter((id) => id !== props.service.id));
						} else {
							setClipboardIDs([...clipboardIDs(), props.service.id]);
						}
					}}
					class="flex gap-1 text-sm justify-center items-center border px-1.5 border-slate rounded-md"
				>
					{clipboardIDs().includes(props.service.id) ? (
						<>
							<span class="material-symbols-outlined text-lg text-primary">
								assignment
							</span>
							<span class="text-primary">Saved</span>
						</>
					) : (
						<>
							<span class="material-symbols-outlined text-lg">assignment</span>
							Save
						</>
					)}
				</button>
				<a
					href={props.service.website.en}
					target="_blank"
					class="flex gap-1 text-sm justify-center items-center border px-1.5 border-slate rounded-md"
				>
					<span class="material-symbols-outlined text-lg">language</span>
					Website
				</a>
				<a
					href={`https://maps.google.com?q=${formatServiceAddress(
						props.service.address
					)}`}
					target="_blank"
					class="flex gap-1 text-sm justify-center items-center border px-1.5 border-slate rounded-md"
				>
					<span class="material-symbols-outlined text-lg">map</span>
					Directions
				</a>
			</div>
		</div>
	);
};

export default ServiceItem;
