// app.config.ts
import { defineConfig } from "@solidjs/start/config";
var app_config_default = defineConfig({
  server: {
    preset: "cloudflare-pages"
  }
});
export {
  app_config_default as default
};
