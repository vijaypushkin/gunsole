import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "scripting"],
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["content-scripts/content.js"],
      },
    ],
  },
  modules: ["@wxt-dev/module-solid"],
  srcDir: "src",
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
