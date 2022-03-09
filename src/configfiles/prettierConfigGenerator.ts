export function createPrettierConfig(): string {
  const config = {
    semi: true,
    trailingComma: "none",
    singleQuote: false,
    printWidth: 80,
    useTabs: false,
    tabWidth: 2,
    bracketSpacing: true,
    bracketSameLine: false
  };
  return JSON.stringify(config, null, " ");
}
