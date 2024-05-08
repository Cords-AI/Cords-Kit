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
			href={`/resource/${props.service.id}?${query}`}
			class="bg-primary hover:bg-opacity-10 bg-opacity-5 rounded-lg border border-primary p-3 flex flex-col gap-1.5 items-start"
		>
			<p class="font-header text-sm text-primary">
				{getLocalizedField(props.service.name, locale())}
			</p>
			<p class="text-xs line-clamp-2 max-w-full">
				{convert(getLocalizedField(props.service.description, locale())!)}
			</p>
		</A>
	);
};

const Related: Component<{
	id: string;
}> = (props) => {
	const cords = useCords();
	const { t } = useTranslation();
	const related = createQuery(() => ({
		queryKey: ["related", props.id],
		queryFn: () => cords.related(props.id),
		throwOnError: true,
		suspense: true,
	}));

	return (
		<Show when={related.data && related.data.data.length > 0}>
			<h3>{t().resource.related}</h3>
			<For each={related.data?.data}>{(service) => <RelatedItem service={service} />}</For>
		</Show>
	);
};

const Nearest: Component<{
	id: string;
}> = (props) => {
	const cords = useCords();
	const { t } = useTranslation();
	const related = createQuery(() => ({
		queryKey: ["nearest-neighbour", props.id],
		queryFn: () =>
			cords.nearestNeighbour(props.id, { lat: location().lat, lng: location().lng }),
		throwOnError: true,
		suspense: true,
	}));

	return (
		<Show when={related.data && related.data.data.length > 0}>
			<h3>{t().resource.nearest}</h3>
			<For each={related.data?.data}>{(service) => <RelatedItem service={service} />}</For>
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
	const { t, locale } = useTranslation();

	return (
		<Show when={resource.data}>
			{(resource) => (
				<div class="flex gap-4 px-4 py-8 flex-col">
					<h1>{getLocalizedField(resource().name, locale())}</h1>
					<div class="flex items-center justify-between">
						<PartnerLogo partner={resource().partner} />
						<button
							onClick={() => {
								if (clipboardIDs().indexOf(resource().id) === -1) {
									setClipboardIDs((ids) => [...ids, resource().id]);
								} else {
									setClipboardIDs((ids) =>
										ids.filter((id) => id !== resource().id)
									);
								}
							}}
							class="flex relative h-7 w-7 items-center justify-center text-slate"
						>
							<Show when={clipboardIDs().indexOf(resource().id) !== -1}>
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
						{t().resource.close}
					</button>
					<Show when={getLocalizedField(resource().description, locale())}>
						<h3>{t().resource.description}</h3>
						<p innerHTML={getLocalizedField(resource().description, locale()) ?? ""} />
						<hr />
					</Show>
					<Show when={getLocalizedField(resource().body, locale())?.eligibility}>
						<h3>{t().resource.eligability}</h3>
						<p innerHTML={getLocalizedField(resource().body, locale())?.eligibility} />
						<hr />
					</Show>
					<Show when={getLocalizedField(resource().body, locale())?.applicationProcess}>
						<h3>{t().resource.application}</h3>
						<p
							innerHTML={
								getLocalizedField(resource().body, locale())?.applicationProcess
							}
						/>
						<hr />
					</Show>
					<Show
						when={
							getLocalizedField(resource().body, locale())?.fees ||
							getLocalizedField(resource().body, locale())?.documentsRequired ||
							getLocalizedField(resource().body, locale())?.accessibility
						}
					>
						<h3>{t().resource.additional}</h3>
						<Show when={getLocalizedField(resource().body, locale())?.fees}>
							<p class="font-medium -mb-2">{t().resource.fees}</p>
							<p innerHTML={getLocalizedField(resource().body, locale())?.fees} />
						</Show>
						<Show
							when={getLocalizedField(resource().body, locale())?.documentsRequired}
						>
							<p class="font-medium -mb-2">{t().resource.documents}</p>
							<p
								innerHTML={
									getLocalizedField(resource().body, locale())?.documentsRequired
								}
							/>
						</Show>
						<Show when={getLocalizedField(resource().body, locale())?.accessibility}>
							<p class="font-medium -mb-2">{t().resource.accessibility}</p>
							<p
								innerHTML={
									getLocalizedField(resource().body, locale())?.accessibility
								}
							/>
						</Show>
						<hr />
					</Show>
					<div class="p-4 flex flex-col gap-2 border rounded-3xl bg-elevation1">
						<p class="text-xs text-steel font-medium -mb-2">{t().resource.contact}</p>
						<h4 class="text-lg">{getLocalizedField(resource().name, locale())}</h4>
						<hr />
						<p class="font-medium text-xs text-charcoal">{t().resource.address}</p>
						<a
							href={`https://www.google.com/maps/search/?api=1&query=${resource().address.lat},${resource().address.lng}`}
							target="_blank"
							class="text-sm text-primary"
						>
							{formatServiceAddress(resource().address)}
						</a>
						<p class="font-medium text-xs text-charcoal">{t().resource.phone}</p>
						{resource().phoneNumbers.map((phone) => (
							<p class="text-sm">
								{phone.name ? phone.name + ": " : ""}
								{phone.phone}
							</p>
						))}
						<p class="font-medium text-xs text-charcoal">{t().resource.email}</p>
						<p class="text-sm">
							<a href={`mailto:${getLocalizedField(resource().email, locale())}`}>
								{getLocalizedField(resource().email, locale())}
							</a>
						</p>
						<p class="font-medium text-xs text-charcoal">{t().resource.website}</p>
						<a
							class="text-sm truncate text-primary"
							href={
								getLocalizedField(resource().website, locale())?.startsWith("http")
									? getLocalizedField(resource().website, locale()) ?? ""
									: `https://${getLocalizedField(resource().website, locale())}`
							}
							target="_blank"
						>
							{getLocalizedField(resource().website, locale())}
						</a>
					</div>
					<Suspense>
						<Nearest id={resource().id} />
					</Suspense>
					<Suspense>
						<Related id={resource().id} />
					</Suspense>
				</div>
			)}
		</Show>
	);
};

export default Resource;
