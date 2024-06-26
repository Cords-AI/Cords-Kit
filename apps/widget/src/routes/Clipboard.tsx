import { createQuery } from "@tanstack/solid-query";
import { For, Show } from "solid-js";
import empty from "../assets/empty.svg";
import ServiceItem from "../components/ServiceItem";
import { clipboardIDs } from "../lib/clipboard";
import { useCords } from "../lib/cords";
import { useTranslation } from "../translations";

const Clipboard = () => {
	const cords = useCords();
	const clipboard = createQuery(() => ({
		queryKey: ["clipboard", clipboardIDs()],
		queryFn: () => cords.resourceList(clipboardIDs()),
		throwOnError: true,
		suspense: true,
	}));
	const { t } = useTranslation();

	return (
		<Show
			when={clipboard.data?.data.length}
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
						<p class="text-center">{t().clipboard.empty.description}</p>
					</div>
				</div>
			}
		>
			<div class="flex flex-col bg-elevation1 h-full">
				<div class="p-8 bg-elevation1">
					<h4>{t().clipboard.title}</h4>
					<p class="text-xs text-steel">{t().clipboard.description}</p>
				</div>
				<For each={clipboard.data?.data}>
					{(service) => <ServiceItem service={service} />}
				</For>
			</div>
		</Show>
	);
};

export default Clipboard;
