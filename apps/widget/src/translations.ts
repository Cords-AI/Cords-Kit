import { createMemo, createSignal } from "solid-js";

const en_dict = {
	home: {
		similar: {
			title: "Similar",
			description: "View similar services to the current page",
		},
		related: {
			title: "Related",
			description: "Other services you may be interested in",
		},
	},
	search: {
		meta: {
			page: "Page",
			of: "de",
			results: "résultats",
			seconds: "secondes",
		},
	},
	clipboard: {
		title: "Clipboard",
		description: "View your clipboarded services",
		empty: {
			title: "Your clipboard is empty.",
			description: "Save search results to your clipboard for easy access anytime.",
		},
	},
};

type Dict = typeof en_dict;

const fr_dict: Dict = {
	home: {
		similar: {
			title: "Similaire",
			description: "Voir les services similaires à la page actuelle",
		},
		related: {
			title: "En rapport",
			description: "Autres services susceptibles de vous intéresser",
		},
	},
	search: {
		meta: {
			page: "Page",
			of: "of",
			results: "results",
			seconds: "seconds",
		},
	},
	clipboard: {
		title: "Presse-papiers",
		description: "Visualiser les services figurant dans le presse-papiers",
		empty: {
			title: "Votre presse-papiers est vide.",
			description:
				"Enregistrez les résultats de la recherche dans votre presse-papiers pour y accéder facilement à tout moment.",
		},
	},
};

export const translations = {
	en: en_dict,
	fr: fr_dict,
};

export type Locale = "en" | "fr";
export const [locale, setLocale] = createSignal<Locale>("en");

export const t = createMemo(() => translations[locale()]);

export type LocalizationObject<T> = {
	en?: T | null;
	fr?: T | null;
};

export const getLocalizedField = <T>(
	obj: LocalizationObject<T>,
	locale: string
): T | undefined | null => {
	if (locale === "fr" && obj["fr"] !== "") return obj[locale];
	else return obj["en"];
};
