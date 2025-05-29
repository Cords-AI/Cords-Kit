// app/routes/__root.tsx
import {
	Outlet,
	createRootRoute,
	HeadContent,
	Scripts,
} from "@tanstack/solid-router";
import appCss from "../app.css?url";
import { z } from "zod";

export const Route = createRootRoute({
	validateSearch: z.object({
		query: z.string().optional(),
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
				rel: "stylesheet",
				href: appCss,
			},
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
				href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
				rel: "stylesheet",
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang="en" class="h-full w-full overflow-hidden bg-transparent">
			<head>
				<HeadContent />
			</head>
			<body class="h-full w-full overflow-hidden bg-transparent">
				<div class="w-full h-full flex flex-col justify-center items-center bg-transparent"></div>
			</body>
		</html>
	);
}
