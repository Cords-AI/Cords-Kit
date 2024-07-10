import apiFetch from "@wordpress/api-fetch";

const useState = wp.element.useState;
const useEffect = wp.element.useEffect;

const updateOptions = async (options) => {
	await apiFetch({
		method: "POST",
		path: "/cords/v1/options",
		data: options,
	});
};

const updatePage = async ({ id, meta }) => {
	await apiFetch({
		method: "POST",
		path: `/wp/v2/pages/${id}`,
		data: {
			meta,
		},
	});
};

const App = () => {
	const [pages, setPages] = useState(null);
	const [options, setOptions] = useState({
		api_key: "",
	});
	const [load, setLoad] = useState(true);

	useEffect(() => {
		apiFetch({
			path: "/wp/v2/pages",
		}).then((pages) => {
			setPages(pages);
		});
		apiFetch({
			path: "/cords/v1/options",
		}).then((options) => {
			setOptions(options);
		});
		setLoad(false);
	}, [load]);

	return (
		<div>
			<h1>CORDS</h1>
			<p>Welcome to the CORDS admin dashboard.</p>
			<hr />
			<h3>Pages</h3>
			<p>Select which pages you would like to enable CORDS and/or the widget on.</p>
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
										onChange={(e) => {
											updatePage({
												id: page.id,
												meta: {
													...page.meta,
													cords_enabled: e.target.value === "true",
												},
											}).then(() => {
												setLoad(true);
											});
										}}
									>
										<option value="true">True</option>
										<option value="false">False</option>
									</select>
								</td>
								<td>
									<select
										name="enabled"
										value={page.meta.cords_widget ? "true" : "false"}
										onChange={(e) => {
											updatePage({
												id: page.id,
												meta: {
													...page.meta,
													cords_widget: e.target.value === "true",
												},
											}).then(() => {
												setLoad(true);
											});
										}}
									>
										<option value="true">Show</option>
										<option value="false">Hide</option>
									</select>
								</td>
							</tr>
						))}
				</tbody>
			</table>
			<h3>API Key</h3>
			<p>
				Enter your CORDS API key below. This can be found at{" "}
				<a href="https://partners.cords.ai">https://partners.cords.ai</a>
			</p>
			<input
				type="text"
				value={options.api_key}
				onChange={(e) => {
					setOptions({
						api_key: e.target.value,
					});
				}}
			/>
			<button
				onClick={() => {
					updateOptions(options);
				}}
			>
				Save
			</button>
		</div>
	);
};

export default App;
