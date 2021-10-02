import { Config } from "bili";

const config: Config = {
  input: "lib/index.ts",
  babel: {
    minimal: true,
  },
  output: {
    fileName: "bloc-state.[format].js",
    format: ["esm", "cjs", "umd"],
		sourceMap: true, 
    moduleName: "bloc-state",
  },
};

export default config;
