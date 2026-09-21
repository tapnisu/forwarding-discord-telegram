import resolveNode from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true
  },
  plugins: [
    resolveNode({ preferBuiltins: true }),
    commonjs({
      ignore: ["ffmpeg-static"],
      ignoreDynamicRequires: true
    }),
    json(),
    typescript()
  ]
};
