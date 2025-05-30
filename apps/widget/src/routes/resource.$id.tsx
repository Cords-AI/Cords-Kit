import { CordsAPI, type ResourceType, formatServiceAddress } from "@cords/sdk";
import {
	createFileRoute,
	Link,
	notFound,
	useRouter,
} from "@tanstack/solid-router";
import { convert } from "html-to-text";
import { type Component, For, Show } from "solid-js";
import PartnerLogo from "@/components/PartnerLogo";
import { getLocalizedField, useTranslation } from "@/translations";
import { updateClipboardFn } from "@/lib/clipboard";
import Pending from "@/components/Pending";

export const Route = createFileRoute("/resource/$id")({
	component: RouteComponent,
	pendingComponent: Pending,
	pendingMs: 0,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps, params, context }) => {
		const cords = CordsAPI({
			apiKey: deps.api_key,
		});
		const resource = await cords.resource(params.id);
		if (!resource) {
			throw notFound();
		}
		return {
			resource,
			nearest: await cords.nearestNeighbour(params.id, {
				lat: context.session.lat,
				lng: context.session.lng,
			}),
			related: await cords.related(params.id),
		};
	},
});

const RelatedItem: Component<{
	service: ResourceType;
}> = (props) => {
	const { locale } = useTranslation();

	return (
		<Link to="/resource/$id" params={{ id: props.service.id }}>
			<div class="bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary p-3 flex flex-col gap-1.5 items-start">
				<p class="font-header text-sm text-primary">
					{getLocalizedField(props.service.name, locale())}
				</p>
				<p class="text-xs line-clamp-2 max-w-full">
					{convert(
						getLocalizedField(props.service.description, locale())!,
					)}
				</p>
			</div>
		</Link>
	);
};

const Related: Component<{
	id: string;
	related: ResourceType[];
}> = (props) => {
	const { t } = useTranslation();

	return (
		<Show when={props.related && props.related.length > 0}>
			<h3>{t().resource.related}</h3>
			<For each={props.related}>
				{(service) => <RelatedItem service={service} />}
			</For>
		</Show>
	);
};

const Nearest: Component<{
	id: string;
	nearest: ResourceType[];
}> = (props) => {
	const { t } = useTranslation();

	return (
		<Show when={props.nearest && props.nearest.length > 0}>
			<h3>{t().resource.nearest}</h3>
			<For each={props.nearest}>
				{(service) => <RelatedItem service={service} />}
			</For>
		</Show>
	);
};

function RouteComponent() {
	const loaderData = Route.useLoaderData();
	const context = Route.useRouteContext();
	const { session } = context();

	const { t, locale } = useTranslation();
	const router = useRouter();

	return (
		<div class="flex gap-4 px-4 py-8 flex-col">
			<h1>{getLocalizedField(loaderData().resource.name, locale())}</h1>
			<div class="flex items-center justify-between">
				<PartnerLogo partner={loaderData().resource.partner} />
				<button
					onClick={async () => {
						await updateClipboardFn({
							data: { id: loaderData().resource.id },
							headers: {
								"cords-id": session.id,
							},
						});
						router.invalidate();
					}}
					class="flex relative h-7 w-7 items-center justify-center text-slate"
				>
					<Show
						when={session.clipboardServices.some(
							(service) =>
								service.serviceId === loaderData().resource.id,
						)}
					>
						<div class="rounded-full absolute -top-1 -right-1 bg-primary text-white h-4 w-4 flex items-center justify-center border-elevation1 border-2">
							<span class="material-symbols-outlined material-symbols-outlined-thicker">
								check
							</span>
						</div>
					</Show>
					<span class="material-symbols-outlined">assignment</span>
				</button>
			</div>
			<hr />
			<button onClick={() => router.history.back()} class="btn my-4">
				{t().resource.close}
			</button>
			<Show
				when={getLocalizedField(
					loaderData().resource.description,
					locale(),
				)}
			>
				<h3>{t().resource.description}</h3>
				<p
					innerHTML={
						getLocalizedField(
							loaderData().resource.description,
							locale(),
						) ?? ""
					}
				/>
				<hr />
			</Show>
			<Show
				when={
					getLocalizedField(loaderData().resource.body, locale())
						?.eligibility
				}
			>
				<h3>{t().resource.eligability}</h3>
				<p
					innerHTML={
						getLocalizedField(loaderData().resource.body, locale())
							?.eligibility
					}
				/>
				<hr />
			</Show>
			<Show
				when={
					getLocalizedField(loaderData().resource.body, locale())
						?.applicationProcess
				}
			>
				<h3>{t().resource.application}</h3>
				<p
					innerHTML={
						getLocalizedField(loaderData().resource.body, locale())
							?.applicationProcess
					}
				/>
				<hr />
			</Show>
			<Show
				when={
					getLocalizedField(loaderData().resource.body, locale())
						?.fees ||
					getLocalizedField(loaderData().resource.body, locale())
						?.documentsRequired ||
					getLocalizedField(loaderData().resource.body, locale())
						?.accessibility
				}
			>
				<h3>{t().resource.additional}</h3>
				<Show
					when={
						getLocalizedField(loaderData().resource.body, locale())
							?.fees
					}
				>
					<p class="font-medium -mb-2">{t().resource.fees}</p>
					<p
						innerHTML={
							getLocalizedField(
								loaderData().resource.body,
								locale(),
							)?.fees
						}
					/>
				</Show>
				<Show
					when={
						getLocalizedField(loaderData().resource.body, locale())
							?.documentsRequired
					}
				>
					<p class="font-medium -mb-2">{t().resource.documents}</p>
					<p
						innerHTML={
							getLocalizedField(
								loaderData().resource.body,
								locale(),
							)?.documentsRequired
						}
					/>
				</Show>
				<Show
					when={
						getLocalizedField(loaderData().resource.body, locale())
							?.accessibility
					}
				>
					<p class="font-medium -mb-2">
						{t().resource.accessibility}
					</p>
					<p
						innerHTML={
							getLocalizedField(
								loaderData().resource.body,
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
					{getLocalizedField(loaderData().resource.name, locale())}
				</h4>
				<hr />
				<Show
					when={
						loaderData().resource.address.lat &&
						loaderData().resource.address.lng
					}
				>
					<p class="font-medium text-xs text-charcoal">
						{t().resource.address}
					</p>
					<a
						href={`https://www.google.com/maps/search/?api=1&query=${loaderData().resource.address.lat},${loaderData().resource.address.lng}`}
						target="_blank"
						class="text-sm text-primary"
					>
						{formatServiceAddress(loaderData().resource.address)}
					</a>
				</Show>
				<Show when={loaderData().resource.phoneNumbers.length > 0}>
					<p class="font-medium text-xs text-charcoal">
						{t().resource.phone}
					</p>
					{loaderData().resource.phoneNumbers.map((phone) => (
						<p class="text-sm">
							{phone.name ? phone.name + ": " : ""}
							{phone.phone}
						</p>
					))}
				</Show>
				<Show
					when={getLocalizedField(
						loaderData().resource.email,
						locale(),
					)}
				>
					<p class="font-medium text-xs text-charcoal">
						{t().resource.email}
					</p>
					<p class="text-sm">
						<a
							href={`mailto:${getLocalizedField(loaderData().resource.email, locale())}`}
						>
							{getLocalizedField(
								loaderData().resource.email,
								locale(),
							)}
						</a>
					</p>
				</Show>
				<Show
					when={getLocalizedField(
						loaderData().resource.website,
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
								loaderData().resource.website,
								locale(),
							)?.startsWith("http")
								? (getLocalizedField(
										loaderData().resource.website,
										locale(),
									) ?? "")
								: `https://${getLocalizedField(loaderData().resource.website, locale())}`
						}
						target="_blank"
					>
						{getLocalizedField(
							loaderData().resource.website,
							locale(),
						)}
					</a>
				</Show>
			</div>
			<Show when={loaderData().resource.id}>
				<Nearest
					id={loaderData().resource.id}
					nearest={loaderData().nearest.data}
				/>
			</Show>
			<Show when={loaderData().resource.id}>
				<Related
					id={loaderData().resource.id}
					related={loaderData().related.data}
				/>
			</Show>
		</div>
	);
}
