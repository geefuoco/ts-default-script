export function createEslintConfig(projectType: string): string {
  const config = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"]
  };

  if (projectType === "React") {
    config.extends.push("react-app");
    config.extends.push("react-app/jest");
  }

  return JSON.stringify(config, null, " ");
}
