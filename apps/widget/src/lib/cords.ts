import { useSearchParams } from "@solidjs/router";
import { CordsAPI } from "cords-sdk";

export const useCords = () => {
	const [searchParams] = useSearchParams<{
		api_key?: string;
	}>();

	return CordsAPI({ apiKey: searchParams.api_key });
};
