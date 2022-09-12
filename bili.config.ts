import { Config } from "bili";
import { visualizer } from "rollup-plugin-visualizer";
import typescript2 from "rollup-plugin-typescript2";

const config: Config = {
  input: "lib/index.ts",
  babel: {
    minimal: true,
  },
  output: {
    fileName: "bloc-state.[format].js",
    format: ["esm", "cjs-min"],
    sourceMap: true,
    moduleName: "bloc-state",
  },
  globals: {
    rxjs: "rxjs",
  },
  externals: ["rxjs"],
  plugins: {
    typescript2: {
      tsconfig: "./tsconfig-build.json",
    },
    visualizer: visualizer(),
  },
};

export default config;
