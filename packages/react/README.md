# @cords/react

The `@cords/react` package provides a React component for integrating the CORDS widget into your application.

## Installation

You can install the SDK using npm or any other package manager:

```bash
npm install @cords/react
```

## Usage

To use the `CordsWidget` component in your React application, you can follow the example provided in the [React example package](https://github.com/Cords-AI/Cords-Kit/blob/master/examples/react/src/App.tsx). Here's a brief overview of how to integrate it:

1. Import the `CordsWidget` component from `@cords/react`.
2. Use the component in your application, providing the necessary prop `apiKey`

#### API Key

To receive an api key you must login and copy your key from https://partners.cords.dev

> Warning: Your api key should be hidden from git using an environment variable

Example usage:

```tsx
import { CordsWidget } from "@cords/react";
import React from "react";

function MyApp() {
	const apiKey = "YOUR_API_KEY_HERE"; // Get your API key from https://partners.cords.dev

	return (
		<div>
			<CordsWidget apiKey={apiKey} />
		</div>
	);
}

export default MyApp;
```

This example demonstrates how to embed a Cords widget into a React application. The [`CordsWidget`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2FUsers%2Fbillyhawkes%2FLocal%20Sites%2Fcords-test%2Fapp%2Fpublic%2Fwp-content%2Fplugins%2FCords-WP-Plugin%2Fpackages%2Freact%2Fdist%2Findex.d.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A2%2C%22character%22%3A0%7D%5D "packages/react/dist/index.d.ts") component takes care of rendering the widget and handling its interactions seamlessly within your app.
