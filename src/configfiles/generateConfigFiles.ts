import { createEslintConfig } from "./eslintConfigGenerator";
import { createTypescriptConfig } from "./typescriptConfigGenerator";
import { createPrettierConfig } from "./prettierConfigGenerator";

interface ConfigFiles {
  eslint: string;
  typescript: string;
  prettier: string;
}

export function generateConfigFiles(projectType: string): ConfigFiles {
  return {
    eslint: createEslintConfig(projectType),
    typescript: createTypescriptConfig(projectType),
    prettier: createPrettierConfig()
  };
}
