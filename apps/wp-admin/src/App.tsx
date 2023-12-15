import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";
import { For } from "solid-js";
import { z } from "zod";

const PageSchema = z.object({
	id: z.number(),
	content: z.object({
		rendered: z.string(),
	}),
	title: z.object({
		rendered: z.string(),
	}),
	meta: z.object({
		cords_enabled: z.boolean().optional(),
		cords_widget: z.boolean().optional(),
	}),
});
type Page = z.infer<typeof PageSchema>;

const updatePage = async ({ id, meta }: { id: number; meta: Page["meta"] }) => {
	await fetch(`${(window as any).wpApiSettings.root}wp/v2/pages/${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-WP-Nonce": (window as any).wpApiSettings.nonce,
		},
		credentials: "include",
		body: JSON.stringify({
			meta,
		}),
	});
	// TODO: Optimistic update
};

const getPages = async () => {
	const res = await fetch(`${(window as any).wpApiSettings.root}wp/v2/pages`);
	const data = await res.json();
	return PageSchema.array().parse(data);
};

const App = () => {
	const queryClient = useQueryClient();
	const mutation = createMutation(() => ({
		mutationFn: updatePage,
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: ["pages"],
			}),
	}));

	const query = createQuery(() => ({
		queryFn: getPages,
		queryKey: ["pages"],
	}));

	return (
		<main>
			<h2 class="wp-heading-inline">CORDS</h2>
			<table class="wp-list-table widefat fixed striped table-view-list">
				<thead>
					<tr>
						<th>Title</th>
						<th>Content</th>
						<th>CORDS Enabled</th>
						<th>CORDS Widget</th>
					</tr>
				</thead>
				<tbody>
					<For each={query.data}>
						{(page) => (
							<tr>
								<td>
									{page.title.rendered.length ? page.title.rendered : "No Title"}
								</td>
								<td>
									<p>{page.content.rendered.slice(0, 20)}</p>
								</td>
								<td>
									<select
										name="enabled"
										value={page.meta.cords_enabled ? "true" : "false"}
										onChange={(e) =>
											mutation.mutate({
												id: page.id,
												meta: {
													...page.meta,
													cords_enabled: e.target.value === "true",
												},
											})
										}
									>
										<option value="true">True</option>
										<option value="false">False</option>
									</select>
								</td>
								<td>
									<select
										name="enabled"
										value={page.meta.cords_widget ? "true" : "false"}
										onChange={(e) =>
											mutation.mutate({
												id: page.id,
												meta: {
													...page.meta,
													cords_widget: e.target.value === "true",
												},
											})
										}
									>
										<option value="true">Show</option>
										<option value="false">Hide</option>
									</select>
								</td>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</main>
	);
};

export default App;
