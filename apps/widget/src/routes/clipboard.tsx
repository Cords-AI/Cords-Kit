import { For, Show } from "solid-js";
import empty from "@/assets/empty.svg";
import ServiceItem from "@/components/ServiceItem";
import { useTranslation } from "@/translations";
import { createFileRoute } from "@tanstack/solid-router";
import { CordsAPI } from "@cords/sdk";

export const Route = createFileRoute("/clipboard")({
	component: RouteComponent,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps, context }) => {
		const cords = CordsAPI({
			apiKey: deps.api_key,
		});
		const ids = context.session.clipboardServices.map((s) => s.serviceId);
		return {
			clipboard: ids.length
				? await cords.search({
						ids,
						lat: context.session.lat,
						lng: context.session.lng,
						pageSize: 1000,
					})
				: { data: [] },
		};
	},
});

function RouteComponent() {
	const { t } = useTranslation();
	const data = Route.useLoaderData();
	const { clipboard } = data();

	return (
		<Show
			when={clipboard.data?.length}
			fallback={
				<div class="h-full flex justify-center items-center flex-col">
					<img
						src={empty}
						width={120}
						height={120}
						alt="Person searching a large clipboard with a magnifying glass"
					/>
					<div class="flex justify-center items-center px-8 flex-col">
						<h3 class="mt-10 mb-4">{t().clipboard.empty.title}</h3>
						<p class="text-center">
							{t().clipboard.empty.description}
						</p>
					</div>
				</div>
			}
		>
			<div class="flex flex-col bg-elevation1 h-full">
				<div class="p-6 bg-elevation1">
					<h4>{t().clipboard.title}</h4>
					<p class="text-xs text-steel">
						{t().clipboard.description}
					</p>
				</div>
				<For each={clipboard.data}>
					{(service) => <ServiceItem service={service} />}
				</For>
			</div>
		</Show>
	);
}
