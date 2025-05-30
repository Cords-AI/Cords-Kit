// app/routes/__root.tsx
import { Outlet, createRootRoute } from "@tanstack/solid-router";
import appCss from "../app.css?url";
import { z } from "zod";
import { getSessionFn } from "@/lib/session";
import { Layout } from "@/Layout";

export const Route = createRootRoute({
	validateSearch: z.object({
		q: z.string({ message: "Search query is required" }),
		cordsId: z.string({ message: "Cords ID is required" }),
		api_key: z.string({ message: "API Key is required" }),
		lang: z.enum(["en", "fr"]).optional(),
	}),
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Cords Widget",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/logo.svg",
				type: "image/svg+xml",
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
			},
			{
				href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
				rel: "stylesheet",
			},
			{
				href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
				rel: "stylesheet",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: RootComponent,
	beforeLoad: async ({ search }) => {
		const session = await getSessionFn({
			headers: {
				"cords-id": search.cordsId,
			},
		});

		if (!session) {
			throw new Error("Session not found");
		}

		return {
			session,
		};
	},
});

function RootComponent() {
	return (
		<div class="w-full h-full flex flex-col justify-center items-center bg-transparent">
			<Layout>
				<Outlet />
			</Layout>
		</div>
	);
}
