import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Service } from "./service";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const formatServiceAddress = (address: Service["addresses"][0]) => {
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
