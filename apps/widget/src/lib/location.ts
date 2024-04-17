import { createEffect, createSignal } from "solid-js";

export const [location, setLocation] = createSignal<{
	lat: number;
	lng: number;
	name: string;
}>(null);

export const setInitialLocation = () =>
	createEffect(() => {
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
					name: "Your Location",
				});
			},
			{
				timeout: 10000,
			}
		);
	});
