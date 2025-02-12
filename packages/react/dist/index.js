"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  CordsWidget: () => CordsWidget
});
module.exports = __toCommonJS(index_exports);

// src/CordsWidget.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const [width, setWidth] = (0, import_react.useState)(0);
  const [height, setHeight] = (0, import_react.useState)(0);
  const [cordsId, setCordsId] = (0, import_react.useState)(null);
  const [origin] = (0, import_react.useState)(baseUrl != null ? baseUrl : "https://cords-widget.pages.dev");
  (0, import_react.useEffect)(() => {
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
  (0, import_react.useEffect)(() => {
    window.addEventListener("message", (event) => {
      if (event.data.type !== "cords-resize") return;
      setHeight(event.data.height);
      setWidth(event.data.width);
    });
  }, []);
  if (!cordsId) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CordsWidget
});
