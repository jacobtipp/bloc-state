import { Config } from "bili";

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
    "rxjs/operators": "rxjs.operators"
  },
  externals: [
    "rxjs", "rxjs/operators"
  ]
};

export default config;
