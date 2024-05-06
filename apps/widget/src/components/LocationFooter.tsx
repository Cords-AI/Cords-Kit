import { A, useSearchParams } from "@solidjs/router";
import { location } from "../lib/location";

const LocationFooter = () => {
	const [query] = useSearchParams();
	return (
		<footer class="bg-elevation1 px-4 text-[10px] flex items-center gap-2 border-t">
			<div class="bg-orange-300 w-2 h-2 rounded-full" />
			<p class="font-medium">{location() ? location().name : "Loading location..."}</p>
			<span class="font-bold">•</span>
			<A href={`/location?${new URLSearchParams(query).toString()}`} class="text-primary">
				Change Location
			</A>
		</footer>
	);
};

export default LocationFooter;
