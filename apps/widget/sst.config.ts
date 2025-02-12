/// <reference path="./.sst/platform/config.d.ts" />

// GLOBALS //
const TENANT = "cords";
const PROFILE = "krak";
const LOCAL_STAGES = ["billyhawkes"];
const ROOT_DOMAIN = "nuonn.com";
const STAGES = ["prod", ...LOCAL_STAGES];

export default $config({
	app() {
		return {
			name: TENANT,
			removal: "remove",
			home: "aws",
			providers: {
				aws: {
					// Region for all resources (restrict to Canada)
					region: "ca-central-1",
					// Under main account
					profile: PROFILE,
				},
				cloudflare: true,
			},
		};
	},
	async run() {
		// STAGE VALIDATION //
		const rootStage = $app.stage;
		if (!STAGES.includes(rootStage)) {
			throw new Error(`Stage ${rootStage} not found`);
		}

		// VARIABLES //
		const stage = `${TENANT}-${rootStage}`;
		const domain = `${stage}.${ROOT_DOMAIN}`;

		// KRAK RESOURCES (Multi-Tenant) //
		const vpc = sst.aws.Vpc.get("Vpc", "vpc-08c28b23ee20f3975");
		const aurora = sst.aws.Aurora.get("Aurora", "krak-prod-auroracluster");

		// CLOUDFLARE (DNS) //
		const dns = sst.cloudflare.dns({
			proxy: true,
		});

		const environment = {
			TENANT_STAGE_NAME: stage,
			SITE_URL: LOCAL_STAGES.includes(rootStage)
				? "http://localhost:3000"
				: `https://${domain}`,
		};

		// WEB //
		new sst.aws.SolidStart("Web", {
			link: [aurora],
			domain: {
				name: domain,
				dns,
			},
			vpc,
			environment,
		});

		// DEVELOPMENT //
		new sst.x.DevCommand("Studio", {
			link: [aurora],
			dev: {
				command: "drizzle-kit studio",
			},
			environment,
		});

		return {
			Name: stage,
			Database: $interpolate`postgres://${aurora.username}:${aurora.password}@${aurora.host}:${aurora.port}/${stage}`,
		};
	},
});
