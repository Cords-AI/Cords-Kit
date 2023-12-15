window.addEventListener("message", function (event) {
	if (event.data.type !== "cords-resize") return;
	const widget = document.getElementById("cords-widget");
	widget.style.height = `${event.data.height}px`;
	widget.style.width = `${event.data.width}px`;
});
