import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";
import { Session } from "~/types";

export const getSession = (cordsId: string) =>
	createQuery(() => ({
		queryKey: ["session", cordsId],
		queryFn: async () => {
			const res = await fetch(`${import.meta.env.VITE_SITE_URL}/api/session`, {
				headers: {
					"cords-id": cordsId!,
				},
			});
			const data = await res.json();
			return data as Session & {
				clipboardServices: {
					sessionId: string;
					serviceId: string;
				}[];
			};
		},
		enabled: !!cordsId,
	}));

export const useSessionMutation = () => {
	const queryClient = useQueryClient();
	return createMutation(() => ({
		mutationKey: ["session"],
		mutationFn: async (session: Session) => {
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
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["session"] });
		},
	}));
};
