import { formatServiceAddress } from "@cords/sdk";
import { useNavigate, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Show } from "solid-js";
import { clipboardIDs, setClipboardIDs } from "../lib/clipboard";
import { useCords } from "../lib/cords";

const Resource = () => {
	const cords = useCords();
	const params = useParams();
	const navigate = useNavigate();
	const resource = createQuery(() => ({
		queryKey: ["resource", params.id],
		queryFn: () => cords.resource(params.id),
		throwOnError: true,
		suspense: true,
	}));

	return (
		<Show when={resource.data}>
			<div class="flex gap-4 p-4 flex-col">
				<h1>{resource.data.name.en}</h1>
				<button
					onClick={() => {
						if (clipboardIDs().indexOf(resource.data.id) === -1) {
							setClipboardIDs((ids) => [...ids, resource.data.id]);
						} else {
							setClipboardIDs((ids) => ids.filter((id) => id !== resource.data.id));
						}
					}}
					class="flex relative h-7 w-7 items-center justify-center text-slate"
				>
					<Show when={clipboardIDs().indexOf(resource.data.id) !== -1}>
						<div class="rounded-full absolute -top-1 -right-1 bg-primary text-white h-4 w-4 flex items-center justify-center border-elevation1 border-[2px]">
							<span class="material-symbols-outlined material-symbols-outlined-thicker text-[10px]">
								check
							</span>
						</div>
					</Show>
					<span class="material-symbols-outlined">assignment</span>
				</button>
				<hr />
				<button onClick={() => navigate(-1)} class="btn my-4">
					CLOSE
				</button>
				<Show when={resource.data.description.en}>
					<h3>Description</h3>
					<p innerHTML={resource.data.description.en} />
					<hr />
				</Show>
				<Show when={resource.data.body.en.eligibility}>
					<h3>Eligability</h3>
					<p innerHTML={resource.data.body.en.eligibility} />
					<hr />
				</Show>
				<Show when={resource.data.body.en.applicationProcess}>
					<h3>Application Process</h3>
					<p innerHTML={resource.data.body.en.applicationProcess} />
					<hr />
				</Show>
				<Show
					when={
						resource.data.body.en.fees ||
						resource.data.body.en.documentsRequired ||
						resource.data.body.en.accessibility
					}
				>
					<h3>Additional Information</h3>
					<Show when={resource.data.body.en.fees}>
						<p class="font-medium -mb-2">Fees</p>
						<p innerHTML={resource.data.body.en.fees} />
					</Show>
					<Show when={resource.data.body.en.documentsRequired}>
						<p class="font-medium -mb-2">Documents Required</p>
						<p innerHTML={resource.data.body.en.documentsRequired} />
					</Show>
					<Show when={resource.data.body.en.accessibility}>
						<p class="font-medium -mb-2">Accessibility</p>
						<p innerHTML={resource.data.body.en.accessibility} />
					</Show>
					<hr />
				</Show>
				<div class="p-4 flex flex-col gap-2 border rounded-3xl bg-elevation1">
					<p class="text-xs text-steel font-medium -mb-2">Contact</p>
					<h4 class="text-lg">{resource.data.name.en}</h4>
					<hr />
					<p class="font-medium text-xs text-charcoal">Address</p>
					<a
						href={`https://www.google.com/maps/search/?api=1&query=${resource.data.address.lat},${resource.data.address.lng}`}
						target="_blank"
						class="text-sm text-primary"
					>
						{formatServiceAddress(resource.data.address)}
					</a>
					<p class="font-medium text-xs text-charcoal">Phone</p>
					{resource.data.phoneNumbers.map((phone) => (
						<p class="text-sm">
							{phone.name ? phone.name + ": " : ""}
							{phone.phone}
						</p>
					))}
					<p class="font-medium text-xs text-charcoal">Email</p>
					<p class="text-sm">
						<a href={`mailto:${resource.data.email.en}`}>{resource.data.email.en}</a>
					</p>
					<p class="font-medium text-xs text-charcoal">Website</p>
					<a class="text-sm text-primary" href={resource.data.website.en} target="_blank">
						{resource.data.website.en}
					</a>
				</div>
			</div>
		</Show>
	);
};

export default Resource;
