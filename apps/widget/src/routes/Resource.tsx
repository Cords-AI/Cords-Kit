import { A, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Show } from "solid-js";
import { useCords } from "../lib/cords";

const Resource = () => {
	const cords = useCords();
	const params = useParams();
	const resource = createQuery(() => ({
		queryKey: ["resource", params.id],
		queryFn: () => cords.resource(params.id),
	}));

	return (
		<div class="flex gap-2 p-4 flex-col">
			<Show when={resource.isSuccess}>
				<h1>{resource.data.name.en}</h1>
				<hr class="my-4" />
				<A href="/" class="btn">
					CLOSE
				</A>
				<h3 class="my-4">Description</h3>
				<p>{resource.data.description.en}</p>
			</Show>
		</div>
	);
};

export default Resource;
