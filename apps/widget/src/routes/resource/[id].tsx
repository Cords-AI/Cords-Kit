import { ResourceType, formatServiceAddress } from "@cords/sdk";
import { A, useNavigate, useParams } from "@solidjs/router";
import {
	createMutation,
	createQuery,
	useQueryClient,
} from "@tanstack/solid-query";
import { convert } from "html-to-text";
import { Component, For, Match, Show, Switch } from "solid-js";
import PartnerLogo from "~/components/PartnerLogo";
import Pending from "~/components/Pending";
import { useCords } from "~/lib/cords";
import { useSearchParams } from "~/lib/params";
import { getSession } from "~/lib/session";
import { getLocalizedField, useTranslation } from "~/translations";

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
				{convert(
					getLocalizedField(props.service.description, locale())!,
				)}
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
	}));

	return (
		<Show when={related.data && related.data.data.length > 0}>
			<h3>{t().resource.related}</h3>
			<For each={related.data?.data}>
				{(service) => <RelatedItem service={service} />}
			</For>
		</Show>
	);
};

const Nearest: Component<{
	id: string;
}> = (props) => {
	const cords = useCords();
	const { t } = useTranslation();
	const [query] = useSearchParams();
	const session = getSession(query.cordsId);
	const related = createQuery(() => ({
		queryKey: ["nearest-neighbour", props.id],
		queryFn: () =>
			cords.nearestNeighbour(props.id, {
				lat: session.data!.lat,
				lng: session.data!.lng,
			}),
		throwOnError: true,
		enabled: !!session.data,
	}));

	return (
		<Show when={related.data && related.data.data.length > 0}>
			<h3>{t().resource.nearest}</h3>
			<For each={related.data?.data}>
				{(service) => <RelatedItem service={service} />}
			</For>
		</Show>
	);
};

const Resource = () => {
	const cords = useCords();
	const params = useParams();
	const navigate = useNavigate();
	const [query] = useSearchParams();
	const resource = createQuery(() => ({
		queryKey: ["resource", params.id],
		queryFn: () => cords.resource(params.id),
		throwOnError: true,
	}));
	const { t, locale } = useTranslation();

	const session = getSession(query.cordsId);

	const queryClient = useQueryClient();

	const toggleClipboard = createMutation(() => ({
		mutationKey: ["clipboard"],
		mutationFn: async (id: string) => {
			await fetch(
				`${import.meta.env.VITE_SITE_URL}/api/clipboard/${id}`,
				{
					method: "PUT",
					headers: {
						"cords-id": query.cordsId!,
					},
				},
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["session"] });
		},
	}));

	return (
		<Switch>
			<Match when={resource.isPending}>
				<Pending />
			</Match>
			<Match when={resource.isSuccess}>
				<Show when={resource.data}>
					{(resource) => (
						<div class="flex gap-4 px-4 py-8 flex-col">
							<h1>
								{getLocalizedField(resource().name, locale())}
							</h1>
							<div class="flex items-center justify-between">
								<PartnerLogo partner={resource().partner} />
								<button
									onClick={() => {
										toggleClipboard.mutate(resource().id);
									}}
									class="flex relative h-7 w-7 items-center justify-center text-slate"
								>
									<Show
										when={session.data?.clipboardServices.some(
											(service) =>
												service.serviceId ===
												resource().id,
										)}
									>
										<div class="rounded-full absolute -top-1 -right-1 bg-primary text-white h-4 w-4 flex items-center justify-center border-elevation1 border-[2px]">
											<span class="material-symbols-outlined material-symbols-outlined-thicker text-[10px]">
												check
											</span>
										</div>
									</Show>
									<span class="material-symbols-outlined">
										assignment
									</span>
								</button>
							</div>
							<hr />
							<button
								onClick={() => navigate(-1)}
								class="btn my-4"
							>
								{t().resource.close}
							</button>
							<Show
								when={getLocalizedField(
									resource().description,
									locale(),
								)}
							>
								<h3>{t().resource.description}</h3>
								<p
									innerHTML={
										getLocalizedField(
											resource().description,
											locale(),
										) ?? ""
									}
								/>
								<hr />
							</Show>
							<Show
								when={
									getLocalizedField(resource().body, locale())
										?.eligibility
								}
							>
								<h3>{t().resource.eligability}</h3>
								<p
									innerHTML={
										getLocalizedField(
											resource().body,
											locale(),
										)?.eligibility
									}
								/>
								<hr />
							</Show>
							<Show
								when={
									getLocalizedField(resource().body, locale())
										?.applicationProcess
								}
							>
								<h3>{t().resource.application}</h3>
								<p
									innerHTML={
										getLocalizedField(
											resource().body,
											locale(),
										)?.applicationProcess
									}
								/>
								<hr />
							</Show>
							<Show
								when={
									getLocalizedField(resource().body, locale())
										?.fees ||
									getLocalizedField(resource().body, locale())
										?.documentsRequired ||
									getLocalizedField(resource().body, locale())
										?.accessibility
								}
							>
								<h3>{t().resource.additional}</h3>
								<Show
									when={
										getLocalizedField(
											resource().body,
											locale(),
										)?.fees
									}
								>
									<p class="font-medium -mb-2">
										{t().resource.fees}
									</p>
									<p
										innerHTML={
											getLocalizedField(
												resource().body,
												locale(),
											)?.fees
										}
									/>
								</Show>
								<Show
									when={
										getLocalizedField(
											resource().body,
											locale(),
										)?.documentsRequired
									}
								>
									<p class="font-medium -mb-2">
										{t().resource.documents}
									</p>
									<p
										innerHTML={
											getLocalizedField(
												resource().body,
												locale(),
											)?.documentsRequired
										}
									/>
								</Show>
								<Show
									when={
										getLocalizedField(
											resource().body,
											locale(),
										)?.accessibility
									}
								>
									<p class="font-medium -mb-2">
										{t().resource.accessibility}
									</p>
									<p
										innerHTML={
											getLocalizedField(
												resource().body,
												locale(),
											)?.accessibility
										}
									/>
								</Show>
								<hr />
							</Show>
							<div class="p-4 flex flex-col gap-2 border rounded-3xl bg-elevation1">
								<p class="text-xs text-steel font-medium -mb-2">
									{t().resource.contact}
								</p>
								<h4 class="text-lg">
									{getLocalizedField(
										resource().name,
										locale(),
									)}
								</h4>
								<hr />
								<Show
									when={
										resource().address.lat &&
										resource().address.lng
									}
								>
									<p class="font-medium text-xs text-charcoal">
										{t().resource.address}
									</p>
									<a
										href={`https://www.google.com/maps/search/?api=1&query=${resource().address.lat},${resource().address.lng}`}
										target="_blank"
										class="text-sm text-primary"
									>
										{formatServiceAddress(
											resource().address,
										)}
									</a>
								</Show>
								<Show when={resource().phoneNumbers.length > 0}>
									<p class="font-medium text-xs text-charcoal">
										{t().resource.phone}
									</p>
									{resource().phoneNumbers.map((phone) => (
										<p class="text-sm">
											{phone.name
												? phone.name + ": "
												: ""}
											{phone.phone}
										</p>
									))}
								</Show>
								<Show
									when={getLocalizedField(
										resource().email,
										locale(),
									)}
								>
									<p class="font-medium text-xs text-charcoal">
										{t().resource.email}
									</p>
									<p class="text-sm">
										<a
											href={`mailto:${getLocalizedField(resource().email, locale())}`}
										>
											{getLocalizedField(
												resource().email,
												locale(),
											)}
										</a>
									</p>
								</Show>
								<Show
									when={getLocalizedField(
										resource().website,
										locale(),
									)}
								>
									<p class="font-medium text-xs text-charcoal">
										{t().resource.website}
									</p>
									<a
										class="text-sm truncate text-primary"
										href={
											getLocalizedField(
												resource().website,
												locale(),
											)?.startsWith("http")
												? (getLocalizedField(
														resource().website,
														locale(),
													) ?? "")
												: `https://${getLocalizedField(resource().website, locale())}`
										}
										target="_blank"
									>
										{getLocalizedField(
											resource().website,
											locale(),
										)}
									</a>
								</Show>
							</div>
							<Show when={resource().id}>
								<Nearest id={resource().id} />
							</Show>
							<Show when={resource().id}>
								<Related id={resource().id} />
							</Show>
						</div>
					)}
				</Show>
			</Match>
		</Switch>
	);
};

export default Resource;
