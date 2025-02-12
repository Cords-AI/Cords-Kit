// src/CordsWidget.tsx
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
function extractPageText(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const selectorsToRemove = [
    "nav",
    "a",
    "header",
    "footer",
    "script",
    "form",
    "button",
    "a"
  ];
  function removeElements(element) {
    Array.from(element.querySelectorAll("*")).forEach((child) => {
      if (selectorsToRemove.some((selector) => child.matches(selector))) {
        child.remove();
      } else {
        removeElements(child);
      }
    });
  }
  removeElements(doc.body);
  return doc.body.textContent || "";
}
var CordsWidget = ({
  apiKey,
  baseUrl
}) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [cordsId, setCordsId] = useState(null);
  const [origin] = useState(baseUrl != null ? baseUrl : "https://cords-prod.nuonn.com");
  useEffect(() => {
    var _a;
    const cordsId2 = (_a = document.cookie.split("; ").find((row) => row.startsWith("cords-id="))) == null ? void 0 : _a.split("=")[1];
    if (!cordsId2) {
      const cordsId3 = window.location.search.split("cordsId=")[1];
      if (cordsId3) {
        document.cookie = `cords-id=${encodeURIComponent(cordsId3)}; max-age=${86400 * 30}; path=/; secure=${window.location.protocol === "https:"};`;
        setCordsId(cordsId3);
      } else {
        window.location.href = `${origin}/login?redirect=${window.location.href}`;
      }
    } else {
      setCordsId(cordsId2);
    }
  }, [cordsId]);
  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.type !== "cords-resize") return;
      setHeight(event.data.height);
      setWidth(event.data.width);
    });
  }, []);
  if (!cordsId) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      id: "cords-widget",
      style: {
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
        overscrollBehavior: "contain"
      },
      children: /* @__PURE__ */ jsx(
        "iframe",
        {
          src: `${origin}?q=${encodeURIComponent(
            extractPageText(document.body.innerHTML)
          )}&api_key=${apiKey}&cordsId=${cordsId}`,
          style: {
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
            overscrollBehavior: "contain"
          }
        }
      )
    }
  );
};
export {
  CordsWidget
};
