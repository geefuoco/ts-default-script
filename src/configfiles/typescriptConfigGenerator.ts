export function createTypescriptConfig(projectType: string) {
  const config = {
    compilerOptions: {
      rootDir: "src",
      outDir: "build",
      target: "es6",
      allowJs: true,
      moduleResolution: "node",
      module: projectType === "Webpack" ? "es6" : "commonjs",
      sourceMap: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: true,
      jsx: "react",
      strict: true,
      skipLibCheck: true
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "build"]
  };

  return JSON.stringify(config, null, " ");
}
