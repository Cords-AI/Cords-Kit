// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en" class="h-full w-full overflow-hidden">
				<head>
					<meta charset="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, maximum-scale=1"
					/>
					<meta name="theme-color" content="#000000" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
					/>
					{assets}
				</head>
				<body class="h-full w-full overflow-hidden">
					<noscript>You need to enable JavaScript to run this app.</noscript>
					<div id="app" class="w-full h-full flex flex-col justify-center items-center">
						{children}
					</div>
					{scripts}
				</body>
			</html>
		)}
	/>
));
