import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const getDistanceBetweenTwoPoints = (
	cord1: {
		lat: number;
		lng: number;
	},
	cord2: {
		lat: number;
		lng: number;
	}
) => {
	if (cord1.lat === cord2.lat && cord1.lng === cord2.lng) {
		return 0;
	}

	const radlat1 = (Math.PI * cord1.lat) / 180;
	const radlat2 = (Math.PI * cord2.lat) / 180;

	const theta = cord1.lng - cord2.lng;
	const radtheta = (Math.PI * theta) / 180;

	let dist =
		Math.sin(radlat1) * Math.sin(radlat2) +
		Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

	if (dist > 1) {
		dist = 1;
	}

	dist = Math.acos(dist);
	dist = (dist * 180) / Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344; //convert miles to km

	return dist;
};
