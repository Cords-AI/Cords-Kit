import { ResourceType } from "@cords/sdk";
import volunteer from "../assets/volunteer.jpg";
import { useTranslation } from "../translations";

const PartnerLogo = ({ partner }: { partner: ResourceType["partner"] }) => {
	const { t } = useTranslation();

	return (
		<div class="flex gap-2 items-center">
			<div class="bg-elevation1 h-7 w-7 flex border justify-center items-center rounded-full">
				{partner === "211" && (
					<svg width="22" height="22" viewBox="0 0 64 64">
						<ellipse fill="#FFFFFF" cx="32" cy="32" rx="30.5" ry="18.6" />
						<path
							fill="#ED1E24"
							d="M32,52.1c-17.6,0-32-9-32-20.1c0-11.1,14.4-20.1,32-20.1s32,9,32,20.1C64,43.1,49.6,52.1,32,52.1z M32,14.9C16,14.9,3,22.6,3,32s13,17.1,29,17.1S61,41.4,61,32S48,14.9,32,14.9z"
						/>
						<path d="M28.4,37.3v3.8H16.2v-0.5c1.1-1.4,2.4-3.1,3.8-5.2c1-1.4,2-2.9,2.8-4.4c0.4-0.8,0.5-1.7,0.6-2.6c0-0.7-0.2-1.4-0.7-1.9c-0.4-0.5-1.1-0.8-1.7-0.8c-1.3,0-2.8,0.8-4.4,2.3v-3.9c1.5-1.1,3.3-1.7,5.2-1.8c1.6-0.1,3.1,0.4,4.3,1.4c1,1,1.6,2.4,1.5,3.8c0,2.2-1.7,5.4-5,9.7L28.4,37.3z" />
						<path d="M37.4,22.7v18.4h-4.1V22.7H37.4z" />
						<path d="M46.6,22.7v18.4h-4.1V22.7H46.6z" />
					</svg>
				)}
				{partner === "magnet" && (
					<svg width="22" height="22" viewBox="0 0 64 64">
						<path fill="#EE203E" d="M32,0L4.3,16v32L32,64l27.7-16V16L32,0z" />
						<polygon
							fill="#FFFFFF"
							points="13.9,18.2 13.9,18.5 13.9,45.8 15,46.5 16.2,45.8 16.2,18.5 16.2,18.2 15,17.5 "
						/>
						<polygon
							fill="#FFFFFF"
							points="49,17.5 47.8,18.2 47.8,18.5 47.8,45.8 49,46.5 50.1,45.8 50.1,18.5 50.1,18.2 "
						/>
						<polygon
							fill="#FFFFFF"
							points="18.3,17.5 17.7,18.7 31.3,42.3 32.7,42.3 33.3,41.2 19.6,17.5 "
						/>
						<polygon
							fill="#FFFFFF"
							points="44.3,17.5 33.3,36.7 33.9,37.9 35.2,37.9 46.3,18.7 45.7,17.5 "
						/>
					</svg>
				)}
				{partner === "mentor" && (
					<svg width="22" height="22" viewBox="0 0 64 64">
						<polygon fill="#E58E00" points="16,11.3 16,29.5 32,38.5 32,20.4 " />
						<path
							fill="#A60000"
							d="M0,20.4v18.1l16,9.1V29.5V11.3L0,20.4z M15,45.9L2,38.5l13-7.3V45.9z"
						/>
						<path
							fill="#E58E00"
							d="M31,40.2v14.7l-13-7.3L31,40.2 M32,38.5l-16,9.1l16,9.1V38.5L32,38.5z"
						/>
						<polygon fill="#004373" points="32,20.4 32,38.5 48,29.5 48,11.3 " />
						<path
							fill="#00A695"
							d="M48,11.3v18.1v18.1l16-9.1v-18L48,11.3z M49,45.9V31.2l13,7.3L49,45.9z"
						/>
						<path
							fill="#004373"
							d="M33,40.2l13,7.3l-13,7.3V40.2 M32,38.5v18.1l16-9.1L32,38.5L32,38.5z"
						/>
						<polygon fill="#D91C1C" points="0,20.4 16,11.3 16,29.5 " />
						<polygon fill="#FFAC26" points="32,20.4 16,11.3 16,29.5 " />
						<polygon fill="#0061A6" points="32,20.4 48,11.3 48,29.5 " />
						<polygon fill="#00C2AE" points="64,20.4 48,11.3 48,29.5 " />
					</svg>
				)}
				{partner === "prosper" && (
					<svg width="22" height="22" viewBox="0 0 64 64">
						<radialGradient
							id="prosper-partner-logo-gradient"
							cx="32.3077"
							cy="29.1896"
							r="31.3289"
							fx="41.6139"
							fy="31.2169"
							gradientTransform="matrix(0.8496 0 0 0.8496 4.5514 7.2005)"
							gradientUnits="userSpaceOnUse"
						>
							<stop offset="0" style="stop-color:#FFFFFF" />
							<stop offset="5.722433e-02" style="stop-color:#FBF1EC" />
							<stop offset="0.245" style="stop-color:#EFC5B1" />
							<stop offset="0.4265" style="stop-color:#E4A081" />
							<stop offset="0.5971" style="stop-color:#DC845B" />
							<stop offset="0.7545" style="stop-color:#D77040" />
							<stop offset="0.8936" style="stop-color:#D36330" />
							<stop offset="1" style="stop-color:#D25F2A" />
						</radialGradient>
						<path
							fill="url(#prosper-partner-logo-gradient)"
							d="M41.4,34.2c-2.5,3.7-5,7.4-8,10.1c-9.8,8.8-21.6,9.2-28.2,4.6C15.4,26.7,41.4,34.2,41.4,34.2zM64,17.4c0,0-36.5-16-57.7,8.1C2.2,30.1,0.5,35.7,0,39.4c0.1,0,15.1-12.7,41.4-5.2C46.7,26.3,52.2,18.1,64,17.4z M0,39.5L0,39.5M40.4,34.3L40.4,34.3L40.4,34.3L40.4,34.3z"
						/>
					</svg>
				)}
				{partner === "volunteer" && (
					<img
						class="rounded"
						src={volunteer}
						width={20}
						height={20}
						alt="Volunteer Logo"
					/>
				)}
			</div>
			<p class="text-xs">
				{t().resource["result-from"]} {partner.slice(0, 1).toUpperCase() + partner.slice(1)}
			</p>
		</div>
	);
};

export default PartnerLogo;
