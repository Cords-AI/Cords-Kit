import { useEffect, useState } from "react";

function extractPageText(htmlContent: string) {
	// Create a new DOM element
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlContent, "text/html");

	// Selectors for tags to remove
	const selectorsToRemove = [
		"nav",
		"a",
		"header",
		"footer",
		"script",
		"form",
		"button",
		"a",
	];

	// Function to recursively remove elements matching any selector
	function removeElements(element: Element) {
		Array.from(element.querySelectorAll("*")).forEach((child) => {
			if (selectorsToRemove.some((selector) => child.matches(selector))) {
				child.remove();
			} else {
				removeElements(child);
			}
		});
	}

	// Remove elements from the document
	removeElements(doc.body);

	// Extract and return the cleaned-up text content
	return doc.body.textContent || "";
}

export const CordsWidget = ({
	apiKey,
	baseUrl,
}: {
	apiKey: string;
	baseUrl?: string;
}) => {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [cordsId, setCordsId] = useState<string | null>(null);
	const [origin] = useState(baseUrl ?? "https://cords-prod.nuonn.com");

	useEffect(() => {
		const cordsId = document.cookie
			.split("; ")
			.find((row) => row.startsWith("cords-id="))
			?.split("=")[1];
		if (!cordsId) {
			const cordsId = window.location.search.split("cordsId=")[1];
			if (cordsId) {
				document.cookie = `cords-id=${encodeURIComponent(cordsId)}; max-age=${86400 * 30}; path=/; secure=${window.location.protocol === "https:"};`;
				setCordsId(cordsId);
			} else {
				window.location.href = `${origin}/login?redirect=${window.location.href}`;
			}
		} else {
			setCordsId(cordsId);
		}
	}, [cordsId]);

	useEffect(() => {
		// Resize widget to fit content
		window.addEventListener("message", (event) => {
			if (event.data.type !== "cords-resize") return;
			setHeight(event.data.height);
			setWidth(event.data.width);
		});
	}, []);

	if (!cordsId) return null;

	return (
		<div
			id="cords-widget"
			style={{
				border: "0px",
				backgroundColor: "transparent",
				pointerEvents: "none",
				zIndex: 2147483639,
				position: "fixed",
				bottom: "0px",
				width,
				height,
				overflow: "auto",
				opacity: 1,
				maxWidth: "100%",
				right: "0px",
				maxHeight: "100%",
				overscrollBehavior: "contain",
			}}
		>
			<iframe
				src={`${origin}?q=${encodeURIComponent(
					extractPageText(document.body.innerHTML),
				)}&api_key=${apiKey}&cordsId=${cordsId}`}
				style={{
					pointerEvents: "all",
					backgroundColor: "transparent",
					border: "0px",
					float: "none",
					position: "absolute",
					inset: "0px",
					width: "100%",
					height: "100%",
					margin: "0px",
					padding: "0px",
					minHeight: "0px",
					overscrollBehavior: "contain",
				}}
			></iframe>
		</div>
	);
};
