import { Loader } from "@googlemaps/js-api-loader";

export const loader = new Loader({
	apiKey: "AIzaSyCofacJESTP_LzuZiBFAaqqv4OpMpWiM1E",
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
