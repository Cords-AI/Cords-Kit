"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CordsAPI: () => CordsAPI,
  ResourceOptions: () => ResourceOptions,
  formatServiceAddress: () => formatServiceAddress
});
module.exports = __toCommonJS(index_exports);
var ResourceOptions = {};
var CordsAPI = ({
  apiKey,
  version = "production",
  referer,
  baseUrl: customBaseUrl
}) => {
  const baseUrl = customBaseUrl ? customBaseUrl == null ? void 0 : customBaseUrl.replace(/\/$/, "") : version === "production" ? "https://api.cords.ai" : "https://api.cords.dev";
  const request = async (input, init) => {
    const res = await fetch(input, __spreadProps(__spreadValues({}, init), {
      headers: __spreadValues(__spreadValues({
        "x-api-key": apiKey
      }, referer ? { referer } : {}), init == null ? void 0 : init.headers)
    }));
    if (!res.ok) {
      if (res.status === 403)
        throw new Error(
          "Bad API key. Ensure you have a valid API key."
        );
      const data = await res.json();
      if (data.detail) throw new Error(data.detail);
      else throw new Error("An error occurred");
    }
    return res;
  };
  const formatUrl = (pathname) => {
    const url = new URL(baseUrl);
    url.pathname = url.pathname.replace(/\/$/, "") + pathname;
    return url;
  };
  const search = async (q, _a) => {
    var _b = _a, {
      calculateCityFromSearchString = true,
      calculateProvinceFromSearchString = true
    } = _b, options = __objRest(_b, [
      "calculateCityFromSearchString",
      "calculateProvinceFromSearchString"
    ]);
    var _a2;
    const url = formatUrl("/search");
    const params = new URLSearchParams({
      q
    });
    params.append("lat", options.lat.toString());
    params.append("lng", options.lng.toString());
    if (options.page) params.append("page", options.page.toString());
    if (options.pageSize)
      params.append("pageSize", options.pageSize.toString());
    if (options.distance)
      params.append("distance", options.distance.toString());
    params.append(
      "calculateProvinceFromSearchString",
      calculateProvinceFromSearchString ? "true" : "false"
    );
    params.append(
      "calculateCityFromSearchString",
      calculateCityFromSearchString ? "true" : "false"
    );
    if (options.partner && // Don't add if all values are true (defaults to all)
    !Object.values(options.partner).every((value) => value === true)) {
      for (const [key, value] of Object.entries(options.partner)) {
        params.append(`filter[${key}]`, value ? "true" : "false");
      }
    }
    if (options.delivery && // Don't add if all values are true (defaults to all)
    !Object.values(options.delivery).every((value) => value === true)) {
      for (const [key, value] of Object.entries(options.delivery)) {
        params.append(
          `filter[delivery][${key}]`,
          value ? "true" : "false"
        );
      }
    }
    if ((_a2 = options == null ? void 0 : options.meta) == null ? void 0 : _a2.taxonomy) {
      options.meta.taxonomy.forEach((code) => {
        params.append("filter[meta][TaxonomyCodes][]", code);
      });
    }
    const res = await request(`${url.toString()}?${params}`);
    const data = await res.json();
    return data;
  };
  const related = async (id) => {
    const url = formatUrl(`/resource/${id}/related`);
    const res = await request(url.toString());
    if (!res.ok) {
      const data2 = await res.json();
      throw new Error(data2.detail);
    }
    const data = await res.json();
    return data;
  };
  const resource = async (id) => {
    const url = formatUrl(`/resource/${id}`);
    const res = await request(url.toString());
    if (!res.ok) {
      const data2 = await res.json();
      throw new Error(data2.detail);
    }
    const data = await res.json();
    return data;
  };
  const resourceList = async (ids) => {
    if (ids.length === 0)
      return {
        data: []
      };
    const params = new URLSearchParams();
    ids.forEach((id, index) => params.append(`ids[${index}]`, id));
    const url = formatUrl("/resource/list");
    url.search = params.toString();
    const res = await request(url.toString());
    const data = await res.json();
    return data;
  };
  const nearestNeighbour = async (id, options) => {
    const url = formatUrl(`/resource/${id}/nearest-neighbor`);
    const params = new URLSearchParams({
      lat: options.lat.toString(),
      lng: options.lng.toString()
    });
    const res = await request(
      url.toString() + "?delivery=local&" + params.toString()
    );
    if (!res.ok) {
      const data2 = await res.json();
      throw new Error(data2.detail);
    }
    const data = await res.json();
    return data;
  };
  return {
    search,
    related,
    resource,
    resourceList,
    nearestNeighbour
  };
};
var formatServiceAddress = (address) => {
  const street1 = address.street1 ? address.street1 + ", " : "";
  const street2 = address.street2 ? address.street2 + ", " : "";
  const city = address.city ? address.city + ", " : "";
  const province = address.province ? address.province + ", " : "";
  const postalCode = address.postalCode ? address.postalCode : "";
  const newAddress = street1 + street2 + city + province + postalCode;
  if (newAddress.endsWith(", ")) {
    return newAddress.slice(0, -2);
  } else return newAddress;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CordsAPI,
  ResourceOptions,
  formatServiceAddress
});
