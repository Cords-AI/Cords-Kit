import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { createEffect, createSignal } from "solid-js";

export const [location, setLocation] = makePersisted(
	createSignal<{
		lat: number;
		lng: number;
		name: string;
	}>({
		lat: 43.6532,
		lng: -79.3832,
		name: "Toronto, ON, Canada (Default)",
	}),
	{
		storage: cookieStorage,
		storageOptions: {
			sameSite: "None",
			secure: true,
		},
		name: "cords-location",
	}
);

export const setUserLocation = (callback?: () => void) => {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			setLocation({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
				name: "Your Location",
			});
		},
		async () => {
			const res = await fetch("https://api.cords.dev/info");
			const data = await res.json();
			setLocation({
				lat: data.lat,
				lng: data.lng,
				name: "Your Location, Set by device",
			});
			callback?.();
		},
		{
			enableHighAccuracy: false,
			timeout: 10000,
		}
	);
};

export const setInitialLocation = createEffect(() => {
	if (location().name !== "Toronto, ON, Canada (Default)") return;
	setUserLocation();
});
