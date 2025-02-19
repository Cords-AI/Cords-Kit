/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "Aurora": {
      "clusterArn": string
      "database": string
      "host": string
      "password": string
      "port": number
      "secretArn": string
      "type": "sst.aws.Aurora"
      "username": string
    }
    "Vpc": {
      "bastion": string
      "type": "sst.aws.Vpc"
    }
    "Web": {
      "type": "sst.aws.SolidStart"
      "url": string
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}