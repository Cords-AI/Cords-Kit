import { FaRegularBookmark, FaRegularMap, FaSolidBookmark, FaSolidGlobe } from "solid-icons/fa";
import { Component } from "solid-js";
import { clipboardIDs, setClipboardIDs } from "../lib/clipboard";
import { Service } from "../lib/service";

type Props = {
	service: Service;
};

const ServiceItem: Component<Props> = (props) => {
	return (
		<div class="bg-white p-4 flex flex-col items-start">
			<div class="flex-row flex mb-3 justify-between">
				<p class="text-base flex-1">{props.service.name.en}</p>
			</div>
			<p class="text-sm text-slate-500 line-clamp-2 mb-4">{props.service.description.en}</p>
			<div class="flex gap-2">
				<button
					onClick={() => {
						if (clipboardIDs().includes(props.service.id)) {
							setClipboardIDs(clipboardIDs().filter((id) => id !== props.service.id));
						} else {
							setClipboardIDs([...clipboardIDs(), props.service.id]);
						}
					}}
					class="flex gap-2 text-sm justify-center items-center border px-2.5 py-1.5 border-slate-200 rounded-full"
				>
					{clipboardIDs().includes(props.service.id) ? (
						<>
							<FaSolidBookmark size={16} class="text-gray-500" />
							Saved
						</>
					) : (
						<>
							<FaRegularBookmark size={16} class="text-gray-500" />
							Save
						</>
					)}
				</button>
				<a
					href={props.service.website.en}
					target="_blank"
					class="flex gap-2 text-sm justify-center items-center border px-2.5 py-1.5 border-slate-200 rounded-full"
				>
					<FaSolidGlobe size={16} class="text-gray-500" />
					Website
				</a>
				<a
					href={`https://maps.google.com?q=${props.service.address}`}
					target="_blank"
					class="flex gap-2 text-sm justify-center items-center border px-2.5 py-1.5 border-slate-200 rounded-full"
				>
					<FaRegularMap size={16} class="text-gray-500" />
					Directions
				</a>
			</div>
		</div>
	);
};

export default ServiceItem;
