import resolveNode from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

const ignoreFfmpegStatic = () => ({
  name: "ignore-ffmpeg-static",
  resolveId(id: string) {
    if (id === "ffmpeg-static") return id;
    return null;
  },
  load(id: string) {
    if (id === "ffmpeg-static") return "export default null;";
    return null;
  }
});

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
      ignoreDynamicRequires: true
    }),
    json(),
    typescript(),
    ignoreFfmpegStatic()
  ]
};
