import { useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";

const en_dict = {
	"powered-by": "Powered by",
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
	location: {
		change: "Change location",
		"use-current": "Use current location",
		search: "Search for a location...",
	},
	search: {
		meta: {
			page: "Page",
			of: "of",
			results: "results",
			seconds: "seconds",
		},
		filters: {
			delivery: {
				local: "Local",
				regional: "Regional",
				provincial: "Provincial",
				national: "National",
			},
			type: {
				"211": "Resources",
				magnet: "Employment",
				mentor: "Mentoring Opportunities",
				prosper: "Benefits",
				volunteer: "Volunteering",
			},
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
	resource: {
		close: "CLOSE",
		description: "Description",
		eligability: "Eligability",
		application: "Application Process",
		additional: "Additional Information",
		fees: "Fees",
		documents: "Documents Required",
		accessibility: "Accessibility",
		contact: "Contact",
		address: "Address",
		phone: "Phone",
		email: "Email",
		website: "Website",
		nearest: "Related Resources",
		related: "People have also looked at",
		"result-from": "Result from",
		distance: "Distance",
	},
};

type Dict = typeof en_dict;

const fr_dict: Dict = {
	"powered-by": "Propulsé par",
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
	location: {
		change: "Changer de lieu",
		"use-current": "Utiliser l'emplacement actuel",
		search: "Rechercher un lieu...",
	},
	search: {
		meta: {
			page: "Page",
			of: "de",
			results: "résultats",
			seconds: "secondes",
		},
		filters: {
			delivery: {
				local: "Local",
				regional: "Régional",
				provincial: "Provinciale",
				national: "National",
			},
			type: {
				"211": "Ressources",
				magnet: "Emploi",
				mentor: "Opportunités de mentorat",
				prosper: "Avantages",
				volunteer: "Volunteering",
			},
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
	resource: {
		close: "FERMER",
		description: "Description",
		eligability: "Admissibilité",
		application: "PProcessus de candidature",
		additional: "Informations complémentaires",
		fees: "Honoraires",
		documents: "Documents requis",
		accessibility: "Accessibilité",
		contact: "Contact",
		address: "Adresse",
		phone: "Téléphone",
		email: "Courriel",
		website: "Site web",
		nearest: "Ressources connexes",
		related: "Les gens ont aussi regardé",
		"result-from": "Résultat de",
		distance: "Distance",
	},
};

export const translations = {
	en: en_dict,
	fr: fr_dict,
};

export const locales = ["en", "fr"] as const;
export type Locale = "en" | "fr";

export const useTranslation = () => {
	const [query, setQuery] = useSearchParams<{ lang?: Locale }>();
	const locale = createMemo(
		() => (query.lang && ["en", "fr"].includes(query.lang) ? query.lang : "en") as Locale
	);

	const setLocale = (lang: Locale) => {
		setQuery({ ...query, lang });
	};

	const t = createMemo(() => translations[locale()]);

	return { t, locale, setLocale };
};

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
