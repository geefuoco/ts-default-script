import { mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { generateConfigFiles } from "../configfiles/generateConfigFiles";
import { generateReactFiles } from "../reactTemplate/reactTemplate";
import { generateHtmlTemplate } from "../htmlTemplate/htmlTemplate";
import { generateWebpackTemplate } from "../webpackTemplate/webpackTemplate";

function buildProject(projectName: string, projectType: string) {
  console.log("Creating TS Project...");
  createProjectStructure(projectName);
  initializeNpm(projectType);
  createConfigFiles(projectName);
  createOtherFiles(projectName, projectType);
  getTypescriptTypes();
  setNpmScripts(projectType);
  setUpGit();
  process.chdir("../");
  console.log("Successfully created ts project.");
}

function createProjectStructure(projectName: string): void {
  try {
    mkdirSync(`./${projectName}`);
    process.chdir(`${projectName}`);
    mkdirSync(`./src`);
  } catch (error) {
    console.error(error);
  }
}

function initializeNpm(projectType: string): void {
  const devDependencies = fetchDevDependencies(projectType);
  console.log("Initializing npm...");
  executeCommand("npm init -y");
  console.log("Installing dependencies...");
  executeCommand(`npm i -D ${devDependencies}`);
  if (projectType === "React") {
    executeCommand("npm i react react-dom");
  }
}

function setNpmScripts(projectType: string) {
  executeCommand("npm set-script get-types 'typesync && npm i'");
  executeCommand(
    `npm set-script format "prettier --config .prettierrc 'src/**/*.ts' --write"`
  );
  executeCommand("npm set-script lint 'eslint src --ext .ts --fix'");
  executeCommand("npm set-script test 'jest --watch'");
  switch (projectType) {
    case "React":
      executeCommand("npm set-script start 'BROWSER=none react-scripts start'");
      executeCommand("npm set-script build 'react-scripts build'");
      executeCommand("npm set-script test 'react-scripts test'");
      executeCommand("npm set-script eject 'react-scripts eject'");
      break;
    case "Webpack":
      executeCommand("npm set-script build 'webpack --watch'");
      executeCommand(
        `npm set-script dev "concurrently 'npm run build' 'webpack serve --live-reload'"`
      );
      break;
    default:
      executeCommand("npm set-script build 'tsc'");
      executeCommand("npm set-script watch 'tsc --watch'");
      executeCommand("npm set-script start 'ts-node src/index.ts'");
      break;
  }
}

function setUpGit() {
  const ignore = `
node_modules
build
dist
.env
  `;
  try {
    executeCommand("git init");
    writeFileSync("./.gitignore", ignore);
    executeCommand("git add .");
  } catch (error) {
    console.error(error);
  }
}

function createConfigFiles(projectName: string) {
  const configObject = generateConfigFiles(projectName);
  try {
    writeFileSync("./.eslintrc", configObject.eslint);
    writeFileSync("./.prettierrc", configObject.prettier);
    writeFileSync("./tsconfig.json", configObject.typescript);
  } catch (error) {
    console.error(error);
  }
}

function getTypescriptTypes(): void {
  executeCommand("npx typesync && npm i");
}

function executeCommand(command: string) {
  try {
    execSync(command, { encoding: "utf-8", stdio: "inherit" });
  } catch (error) {
    console.log(error);
  }
}

function fetchDevDependencies(projectType: string): string {
  const devDependencies = [
    "typescript",
    "typesync",
    "@typescript-eslint/parser",
    "@typescript-eslint/eslint-plugin",
    "prettier",
    "jest",
    "eslint"
  ];

  switch (projectType) {
    case "Nodejs":
      devDependencies.push("ts-node");
      break;
    case "React":
      devDependencies.push("react-scripts");
      devDependencies.push("@testing-library/react");
      devDependencies.push("@testing-library/jest-dom");
      devDependencies.push("@testing-library/user-event");
      devDependencies.push("eslint-config-react-app");
      break;
    case "Webpack":
      devDependencies.push("webpack");
      devDependencies.push("webpack-cli");
      devDependencies.push("webpack-dev-server");
      devDependencies.push("concurrently");
      devDependencies.push("html-webpack-plugin");
      devDependencies.push("html-webpack-tags-plugin");
      devDependencies.push("ts-loader");
      break;
    default:
      break;
  }

  return devDependencies.join(" ");
}

function createOtherFiles(projectName: string, projectType: string) {

  try {
    mkdirSync("./public");
    writeFileSync("./src/index.css", "");
    if (projectType === "React") {
      const files = generateReactFiles(projectName);
      mkdirSync("./src/components");
      writeFileSync("./public/index.html", files.html);
      writeFileSync("./src/components/App.tsx", files.app);
      writeFileSync("./src/index.tsx", files.index);
      return;
    }
    if (projectType === "Webpack") {
      const config = generateWebpackTemplate();
      const html = generateHtmlTemplate(projectName);
      writeFileSync("./webpack.config.js", config);
      writeFileSync("./src/index.html", html);
    }
    writeFileSync("./src/index.ts", "//Hello, World!");
  } catch (error) {
    console.error(error);
  }
}

export { buildProject };
