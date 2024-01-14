import apiFetch from "@wordpress/api-fetch";

const useState = wp.element.useState;
const useEffect = wp.element.useEffect;

const App = () => {
	const [pages, setPages] = useState(null);

	useEffect(() => {
		apiFetch({
			path: "/wp/v2/pages",
		}).then((pages) => {
			setPages(pages);
		});
	}, []);

	return (
		<div>
			<h1>CORDS</h1>
			<p>Welcome to the CORDS admin dashboard.</p>
			<table className="wp-list-table widefat fixed striped table-view-list">
				<thead>
					<tr>
						<th>Title</th>
						<th>Content</th>
						<th>CORDS Enabled</th>
						<th>CORDS Widget</th>
					</tr>
				</thead>
				<tbody>
					{pages !== null &&
						pages.map((page) => (
							<tr key={page.id}>
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
										onChange={
											(e) => {}
											// mutation.mutate({
											// 	id: page.id,
											// 	meta: {
											// 		...page.meta,
											// 		cords_enabled: e.target.value === "true",
											// 	},
											// })
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
										onChange={
											(e) => {}
											// mutation.mutate({
											// 	id: page.id,
											// 	meta: {
											// 		...page.meta,
											// 		cords_widget: e.target.value === "true",
											// 	},
											// })
										}
									>
										<option value="true">Show</option>
										<option value="false">Hide</option>
									</select>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default App;
