import { location } from "../lib/location";

const LocationFooter = () => {
	return (
		<footer class="bg-elevation1 px-4 text-[10px] flex items-center gap-2 border-t">
			<div class="bg-orange-300 w-2 h-2 rounded-full" />
			<p class="font-medium">
				{location() ? (
					<>
						{location().name} ({location().lat.toFixed(2)}, {location().lng.toFixed(2)})
					</>
				) : (
					"Loading location..."
				)}
			</p>
		</footer>
	);
};

export default LocationFooter;
