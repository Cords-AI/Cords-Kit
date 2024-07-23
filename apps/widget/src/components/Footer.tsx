import { A } from "@solidjs/router";
import logo from "~/assets/logo.svg";
import { useSearchParams } from "~/lib/params";
import { getSession, localizedLocation } from "~/lib/session";
import { useTranslation } from "~/translations";

const Footer = () => {
	const { t, locale } = useTranslation();
	const [query] = useSearchParams();

	const session = getSession(query.cordsId);

	return (
		<footer class="bg-elevation1 px-4 py-2 gap-0.5 flex flex-col justify-between border-t">
			<div class="flex items-center text-[11px] gap-1 h-7">
				<div class="flex items-center">
					<div class="bg-orange-300 w-2 h-2 mr-2 rounded-full" />
					<span class="font-medium">
						{session.data ? localizedLocation(session.data.address, locale()) : ""}
					</span>
				</div>
				<span>•</span>
				<A
					href={`/location?${new URLSearchParams(query).toString()}`}
					class="text-primary h-full flex items-center"
				>
					{t().location.change}
				</A>
			</div>
			<div class="flex justify-between items-center h-7">
				<div class="flex gap-2 h-full">
					<a
						href={`https://cords.ai/${query.lang ? query.lang : "en"}/privacy-policy`}
						target="_blank"
						class="text-[10px] h-full flex items-center"
					>
						{t().footer.privacy}
					</a>
					<a
						href={`https://cords.ai/${query.lang ? query.lang : "en"}/terms-of-use`}
						target="_blank"
						class="text-[10px] h-full flex items-center"
					>
						{t().footer.terms}
					</a>
				</div>
				<a
					href="https://cords.ai"
					target="_blank"
					class="text-[10px] flex h-full items-center justify-end gap-1"
				>
					{t()["powered-by"]}
					<img src={logo} class="w-10" />
				</a>
			</div>
		</footer>
	);
};

export default Footer;
