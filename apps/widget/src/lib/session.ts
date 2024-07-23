import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";
import { Session } from "~/types";

const updateSession = async (session: Session) => {
	const res = await fetch(`${import.meta.env.VITE_SITE_URL}/api/session`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"cords-id": session.id,
		},
		body: JSON.stringify(session),
	});
	const data = await res.json();
	return data as Session;
};

export const getSession = (cordsId?: string) =>
	createQuery(() => ({
		queryKey: ["session"],
		queryFn: async () => {
			const res = await fetch(`${import.meta.env.VITE_SITE_URL}/api/session`, {
				headers: {
					"cords-id": cordsId!,
				},
			});
			let data = (await res.json()) as Session & {
				clipboardServices: {
					sessionId: string;
					serviceId: string;
				}[];
			};
			if (data.address === "Toronto, ON, Canada (Default)") {
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						data = {
							...data,
							lat: position.coords.latitude,
							lng: position.coords.longitude,
							address: "Your Location, Set by device",
						};
						await updateSession(data);
					},
					async () => {
						const res = await fetch("https://api.cords.dev/info");
						const info = await res.json();
						data = {
							...data,
							lat: info.lat,
							lng: info.lng,
							address: "Your Location, Set by device",
						};
						await updateSession(data);
					},
					{
						enableHighAccuracy: false,
						timeout: 10000,
					}
				);
			}
			return data;
		},
		enabled: !!cordsId,
		gcTime: 0,
		staleTime: 0,
	}));

export const useSessionMutation = () => {
	const queryClient = useQueryClient();
	return createMutation(() => ({
		mutationFn: updateSession,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["session"] });
		},
	}));
};
