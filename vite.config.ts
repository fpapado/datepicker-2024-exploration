import { defineConfig } from "vite";
// import inspect from "vite-plugin-inspect";
import svgUse from "@svg-use/vite";
import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";
import browserslistToEsbuild from "browserslist-to-esbuild";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: browserslistToEsbuild(),
    cssMinify: "lightningcss",
  },
  plugins: [
    // inspect(),

    // plugin-react does not transform code in node_modules even when specified
    // via `include`, so we use a separate plugin for any additional Babel
    // processing inside node_modules.
    babel({
      // This will transform temporal both in dev/serve and prod/build modes
      include: ["node_modules/**/@js-temporal/polyfill/**"],
      babelConfig: {
        babelrc: false,
        configFile: false,
        // The Temporal polyfill uses JSBI as backwards-compat for BigInt. Since
        // we run in contemporary environments, we can transform those calls
        // away.
        // @see https://github.com/js-temporal/temporal-polyfill#:~:text=recommend%20configuring%20the%20JSBI%20Babel%20plugin
        plugins: ["transform-jsbi-to-bigint"],
      },
    }),
    react(),
    svgUse(),
  ],
});
