import { Loader } from "@googlemaps/js-api-loader";

console.log(import.meta.env.VITE_GOOGLE_MAPS_KEY);

export const loader = new Loader({
	apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
	version: "weekly",
	libraries: ["maps", "places", "marker"],
});

export const mapStyleLight = [
	{
		featureType: "administrative",
		elementType: "geometry",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "transit",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
];
