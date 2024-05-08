import { ResourceType, formatServiceAddress } from "@cords/sdk";
import { A, useNavigate, useParams, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { convert } from "html-to-text";
import { Component, For, Show, Suspense } from "solid-js";
import PartnerLogo from "../components/PartnerLogo";
import { clipboardIDs, setClipboardIDs } from "../lib/clipboard";
import { useCords } from "../lib/cords";
import { location } from "../lib/location";
import { getLocalizedField, useTranslation } from "../translations";

const RelatedItem: Component<{
	service: ResourceType;
}> = (props) => {
	const [query] = useSearchParams();
	const { locale } = useTranslation();

	return (
		<A
			href={`/resource/${props.service.id}?${new URLSearchParams(query).toString()}`}
			class="bg-primary hover:bg-opacity-10 bg-opacity-5 rounded-lg border border-primary p-3 flex flex-col gap-1.5 items-start"
		>
			<p class="font-header text-sm text-primary">
				{getLocalizedField(props.service.name, locale())}
			</p>
			<p class="text-xs line-clamp-2 max-w-full">
				{convert(getLocalizedField(props.service.description, locale()))}
			</p>
		</A>
	);
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
			<h3>People have also looked at</h3>
			<For each={related.data.data}>{(service) => <RelatedItem service={service} />}</For>
		</Show>
	);
};

const Nearest: Component<{
	id: string;
}> = (props) => {
	const cords = useCords();
	const related = createQuery(() => ({
		queryKey: ["nearest-neighbour", props.id],
		queryFn: () =>
			cords.nearestNeighbour(props.id, { lat: location().lat, lng: location().lng }),
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
	const { locale } = useTranslation();

	return (
		<Show when={resource.data}>
			<div class="flex gap-4 px-4 py-8 flex-col">
				<h1>{getLocalizedField(resource.data.name, locale())}</h1>
				<div class="flex items-center justify-between">
					<PartnerLogo partner={resource.data.partner} />
					<button
						onClick={() => {
							if (clipboardIDs().indexOf(resource.data.id) === -1) {
								setClipboardIDs((ids) => [...ids, resource.data.id]);
							} else {
								setClipboardIDs((ids) =>
									ids.filter((id) => id !== resource.data.id)
								);
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
				</div>
				<hr />
				<button onClick={() => navigate(-1)} class="btn my-4">
					CLOSE
				</button>
				<Show when={getLocalizedField(resource.data.description, locale())}>
					<h3>Description</h3>
					<p innerHTML={getLocalizedField(resource.data.description, locale())} />
					<hr />
				</Show>
				<Show when={getLocalizedField(resource.data.body, locale()).eligibility}>
					<h3>Eligability</h3>
					<p innerHTML={getLocalizedField(resource.data.body, locale()).eligibility} />
					<hr />
				</Show>
				<Show when={getLocalizedField(resource.data.body, locale()).applicationProcess}>
					<h3>Application Process</h3>
					<p
						innerHTML={
							getLocalizedField(resource.data.body, locale()).applicationProcess
						}
					/>
					<hr />
				</Show>
				<Show
					when={
						getLocalizedField(resource.data.body, locale()).fees ||
						getLocalizedField(resource.data.body, locale()).documentsRequired ||
						getLocalizedField(resource.data.body, locale()).accessibility
					}
				>
					<h3>Additional Information</h3>
					<Show when={getLocalizedField(resource.data.body, locale()).fees}>
						<p class="font-medium -mb-2">Fees</p>
						<p innerHTML={getLocalizedField(resource.data.body, locale()).fees} />
					</Show>
					<Show when={getLocalizedField(resource.data.body, locale()).documentsRequired}>
						<p class="font-medium -mb-2">Documents Required</p>
						<p
							innerHTML={
								getLocalizedField(resource.data.body, locale()).documentsRequired
							}
						/>
					</Show>
					<Show when={getLocalizedField(resource.data.body, locale()).accessibility}>
						<p class="font-medium -mb-2">Accessibility</p>
						<p
							innerHTML={
								getLocalizedField(resource.data.body, locale()).accessibility
							}
						/>
					</Show>
					<hr />
				</Show>
				<div class="p-4 flex flex-col gap-2 border rounded-3xl bg-elevation1">
					<p class="text-xs text-steel font-medium -mb-2">Contact</p>
					<h4 class="text-lg">{getLocalizedField(resource.data.name, locale())}</h4>
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
						<a href={`mailto:${getLocalizedField(resource.data.email, locale())}`}>
							{getLocalizedField(resource.data.email, locale())}
						</a>
					</p>
					<p class="font-medium text-xs text-charcoal">Website</p>
					<a
						class="text-sm truncate text-primary"
						href={
							getLocalizedField(resource.data.website, locale()).startsWith("http")
								? getLocalizedField(resource.data.website, locale())
								: `https://${getLocalizedField(resource.data.website, locale())}`
						}
						target="_blank"
					>
						{getLocalizedField(resource.data.website, locale())}
					</a>
				</div>
				<Suspense>
					<Show when={resource.data.id}>
						<Nearest id={resource.data.id} />
					</Show>
				</Suspense>
				<Suspense>
					<Show when={resource.data.id}>
						<Related id={resource.data.id} />
					</Show>
				</Suspense>
			</div>
		</Show>
	);
};

export default Resource;
