import { A } from "@solidjs/router";
import logo from "../assets/logo.svg";
import { location } from "../lib/location";
import { useSearchParams } from "../lib/params";
import { useTranslation } from "../translations";

const LocationFooter = () => {
	const { t } = useTranslation();
	const [query] = useSearchParams();

	return (
		<footer class="bg-elevation1 px-4 py-3 flex justify-between border-t">
			<div class="flex flex-col text-[10px] justify-between">
				<div class="flex items-center">
					<div class="bg-orange-300 w-2 h-2 mr-2 rounded-full" />
					<span class="font-medium">
						{location() ? location().name : "Loading location..."}
					</span>
				</div>
				<A
					href={`/location?${new URLSearchParams(query).toString()}`}
					class="text-primary pl-4 py-1 -mb-1"
				>
					{t().location.change}
				</A>
			</div>
			<div class="flex flex-col justify-between">
				<a
					href="https://cords.ai"
					target="_blank"
					class="text-[10px] flex items-center justify-end gap-1 py-1 -mt-1"
				>
					{t()["powered-by"]}
					<img src={logo} class="w-10" />
				</a>
				<div class="flex gap-2">
					<a
						href={`https://cords.ai/${query.lang ? query.lang : "en"}/privacy-policy`}
						target="_blank"
						class="text-[10px] py-1 -mb-1"
					>
						Privacy Policy
					</a>
					<a
						href={`https://cords.ai/${query.lang ? query.lang : "en"}/terms-of-use`}
						target="_blank"
						class="text-[10px] py-1 -mb-1"
					>
						Terms of Use
					</a>
				</div>
			</div>
		</footer>
	);
};

export default LocationFooter;
