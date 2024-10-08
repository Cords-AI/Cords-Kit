var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var ResourceOptions = {};
var CordsAPI = ({
  apiKey,
  version = "production",
  referer
}) => {
  const baseUrl = version === "production" ? "https://api.cords.ai" : "https://api.cords.dev";
  const request = (input, init) => __async(void 0, null, function* () {
    const res = yield fetch(input, __spreadProps(__spreadValues({}, init), {
      headers: __spreadValues(__spreadValues({
        "x-api-key": apiKey
      }, referer ? { referer } : {}), init == null ? void 0 : init.headers)
    }));
    if (!res.ok) {
      if (res.status === 403)
        throw new Error("Bad API key. Ensure you have a valid API key.");
      const data = yield res.json();
      if (data.detail) throw new Error(data.detail);
      else throw new Error("An error occurred");
    }
    return res;
  });
  const search = (q, _a) => __async(void 0, null, function* () {
    var _b = _a, {
      calculateCityFromSearchString = true,
      calculateProvinceFromSearchString = true
    } = _b, options = __objRest(_b, [
      "calculateCityFromSearchString",
      "calculateProvinceFromSearchString"
    ]);
    const url = new URL("/search", baseUrl);
    const params = new URLSearchParams({
      q
    });
    params.append("lat", options.lat.toString());
    params.append("lng", options.lng.toString());
    if (options.page) params.append("page", options.page.toString());
    if (options.pageSize) params.append("pageSize", options.pageSize.toString());
    if (options.distance) params.append("distance", options.distance.toString());
    params.append(
      "calculateProvinceFromSearchString",
      calculateProvinceFromSearchString ? "true" : "false"
    );
    params.append(
      "calculateCityFromSearchString",
      calculateCityFromSearchString ? "true" : "false"
    );
    if (options.partner) {
      for (const [key, value] of Object.entries(options.partner)) {
        params.append(`filter[${key}]`, value ? "true" : "false");
      }
    }
    if (options.delivery) {
      for (const [key, value] of Object.entries(options.delivery)) {
        params.append(`filter[delivery][${key}]`, value ? "true" : "false");
      }
    }
    const res = yield request(`${url.toString()}?${params}`);
    const data = yield res.json();
    return data;
  });
  const related = (id) => __async(void 0, null, function* () {
    const url = new URL(`/resource/${id}/related`, baseUrl);
    const res = yield request(url.toString());
    if (!res.ok) {
      const data2 = yield res.json();
      throw new Error(data2.detail);
    }
    const data = yield res.json();
    return data;
  });
  const resource = (id) => __async(void 0, null, function* () {
    const url = new URL(`/resource/${id}`, baseUrl);
    const res = yield request(url.toString());
    if (!res.ok) {
      const data2 = yield res.json();
      throw new Error(data2.detail);
    }
    const data = yield res.json();
    return data;
  });
  const resourceList = (ids) => __async(void 0, null, function* () {
    if (ids.length === 0)
      return {
        data: []
      };
    const params = new URLSearchParams();
    ids.forEach((id, index) => params.append(`ids[${index}]`, id));
    const url = new URL(`/search?${params.toString()}`, baseUrl);
    const res = yield request(url.toString());
    const data = yield res.json();
    return data;
  });
  const nearestNeighbour = (id, options) => __async(void 0, null, function* () {
    const url = new URL(`/resource/${id}/nearest-neighbor`, baseUrl);
    const params = new URLSearchParams({
      lat: options.lat.toString(),
      lng: options.lng.toString()
    });
    const res = yield request(url.toString() + "?delivery=local&" + params.toString());
    if (!res.ok) {
      const data2 = yield res.json();
      throw new Error(data2.detail);
    }
    const data = yield res.json();
    return data;
  });
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
export {
  CordsAPI,
  ResourceOptions,
  formatServiceAddress
};
