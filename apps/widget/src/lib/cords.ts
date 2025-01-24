import { CordsAPI } from "@cords/sdk";
import { useSearchParams } from "@solidjs/router";

export const useCords = () => {
	const [searchParams] = useSearchParams<{
		api_key?: string;
	}>();

	return CordsAPI({
		apiKey: searchParams.api_key ?? "",
		version: "production",
	});
};
