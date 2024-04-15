import { formatServiceAddress } from "@cords/sdk";
import { useNavigate, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
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
		<div class="flex gap-2 p-4 flex-col">
			<h1>{resource.data.name.en}</h1>
			<p>{formatServiceAddress(resource.data.address)}</p>
			<hr class="my-4" />
			<button onClick={() => navigate(-1)} class="btn">
				CLOSE
			</button>
			<h3 class="my-4">Description</h3>
			<p innerHTML={resource.data.description.en} />
		</div>
	);
};

export default Resource;
