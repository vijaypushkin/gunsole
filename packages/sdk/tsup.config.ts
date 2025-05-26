import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true, // generate .d.ts
  sourcemap: true, // helpful for debugging
  clean: true, // clean dist before build
  minify: false, // keep it readable (you can enable if needed)
  skipNodeModulesBundle: true, // don't bundle external deps
  target: "es2020",
});
