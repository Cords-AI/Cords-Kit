import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const PageSchema = z.object({
	content: z.object({
		rendered: z.string(),
	}),
	title: z.object({
		rendered: z.string(),
	}),
});

const Pages = () => {
	const { data: pages } = useQuery({
		queryKey: ["pages"],
		queryFn: async () => {
			const res = await fetch(`${document.location.origin}/wp-json/wp/v2/pages`);
			const data = await res.json();
			console.log(data);
			return PageSchema.array().parse(data);
		},
	});
	return (
		<div className="flex flex-col gap-3 max-w-sm">
			{pages?.map((page) => (
				<div className="border border-gray-700 p-2 rounded flex flex-col gap-2">
					<p>{page.title.rendered.length ? page.title.rendered : "(no title)"}</p>
					<p className="truncate">Content: {page.content.rendered}</p>
				</div>
			))}
		</div>
	);
};

export default Pages;
