import { Config } from "bili";
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
    "rxjs/operators": "rxjs.operators",
  },
  externals: ["rxjs", "rxjs/operators"],
  plugins: {
    typescript2: {
      tsconfig: "./tsconfig-build.json",
    },
  },
};

export default config;
