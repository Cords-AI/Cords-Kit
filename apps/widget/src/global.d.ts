/// <reference types="@solidjs/start/env" />

import type { Request as CfRequest, ExecutionContext } from "@cloudflare/workers-types";

/**
 * Reference: https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#parameters
 */
export interface CfPagesEnv {
	TURSO_URL: string;
	TURSO_TOKEN: string;
}

declare module "vinxi/http" {
	interface H3EventContext {
		cf: CfRequest["cf"];
		cloudflare: {
			request: CfRequest;
			env: CfPagesEnv;
			context: ExecutionContext;
		};
	}
}
