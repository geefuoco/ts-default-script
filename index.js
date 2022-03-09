#!/usr/bin/env node
const inquirer = require("inquirer");
const execSync = require("child_process").execSync;
const fs = require("fs");

function init() {
  welcomeMessage();
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the name of your project\n",
      },
      {
        type: "rawlist",
        name: "project-type",
        message: "Please select the type of project you want to create",
        choices: ["Nodejs", "React", "Webpack"],
      },
    ])
    .then((answers) => {
      const title = answers.title;
      const projectType = answers["project-type"];
      if (!title) throw new Error("Cannot create directory with no name");
      console.log(`Creating ${projectType} project in directory ${title}`);

      createAndMoveToFolder(title);
      initializeNpm(projectType);
      createConfigFiles(projectType);
      getTypescriptTypes();
      createOtherFiles(projectType, title);
      setNpmScripts(projectType);
      setUpGit();
      process.chdir("../");
      console.log(
        `Successfully created ${projectType} project in folder ${title}`
      );
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
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
    fs.writeFileSync("./.gitignore", ignore);
  } catch (error) {}
}

function setNpmScripts(projectType) {
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

function welcomeMessage() {
  console.log("Welcome to the default Typescript Project Builder");
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
}

function createAndMoveToFolder(title) {
  fs.mkdirSync(`./${title}`);
  process.chdir(`./${title}`);
}

function initializeNpm(projectType) {
  const dependencies = fetchDependencies(projectType);
  console.log("Initializing npm...");
  executeCommand("npm init -y");
  console.log("Installing dependencies...");
  executeCommand(`npm i -D ${dependencies}`);
}

function createConfigFiles(projectType) {
  console.log("Creating Typescript config file...");
  createTypescriptConfig(projectType);
  console.log("Creating eslint config file...");
  createEslintFile(projectType);
  console.log("Creating prettier config file");
  createPrettierFile();
}

function getTypescriptTypes() {
  executeCommand("npx typesync && npm i");
}

function executeCommand(command) {
  try {
    execSync(command, { encoding: "utf-8", stdio: "inherit" });
  } catch (error) {
    console.log(error);
  }
}

function fetchDependencies(projectType) {
  const dependencies = [
    "typescript",
    "typesync",
    "@typescript-eslint/parser",
    "@typescript-eslint/eslint-plugin",
    "prettier",
    "jest",
    "eslint",
  ];

  switch (projectType) {
    case "Nodejs":
      dependencies.push("ts-node");
      break;
    case "React":
      dependencies.push("react");
      dependencies.push("react-dom");
      dependencies.push("react-scripts");
      dependencies.push("@testing-library/react");
      dependencies.push("@testing-library/jest-dom");
      dependencies.push("@testing-library/user-event");
      dependencies.push("eslint-config-react-app");
      break;
    case "Webpack":
      dependencies.push("webpack");
      dependencies.push("webpack-cli");
      dependencies.push("webpack-dev-server");
      dependencies.push("concurrently");
      dependencies.push("html-webpack-plugin");
      dependencies.push("html-webpack-tags-plugin");
      dependencies.push("ts-loader");
      break;
    default:
      break;
  }

  return dependencies.join(" ");
}

function createEslintFile(projectType) {
  try {
    const config = {
      root: true,
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    };

    if (projectType === "React") {
      config.extends.push("react-app");
      config.extends.push("react-app/jest");
    }

    fs.writeFileSync("./.eslintrc", JSON.stringify(config));
  } catch (error) {
    console.error(error);
  }
}

function createPrettierFile() {
  try {
    const config = {
      semi: true,
      trailingComma: "none",
      singleQuote: false,
      printWidth: 80,
      useTabs: false,
      tabWidth: 2,
      bracketSpacing: true,
      bracketSameLine: false,
    };
    fs.writeFileSync("./.prettierrc", JSON.stringify(config));
  } catch (error) {
    console.error(error);
  }
}

function createTypescriptConfig(projectType) {
  const config = {
    compilerOptions: {
      rootDir: "src",
      outDir: "build",
      target: "es6",
      allowJs: true,
      moduleResolution: "node",
      module: "commonjs",
      sourceMap: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "build"],
  };

  switch (projectType) {
    case "React":
      config.compilerOptions.jsx = "react";
      break;
    case "Webpack":
      config.compilerOptions.module = "es6";
      break;
    default:
      break;
  }

  try {
    fs.writeFileSync("./tsconfig.json", JSON.stringify(config));
  } catch (error) {
    console.error(error);
  }
}

function createOtherFiles(projectType, title) {
  try {
    fs.mkdirSync("./src");
    fs.writeFileSync("./src/index.ts", "//Hello, World!");
    createCSSFile();
    switch (projectType) {
      case "React":
        setupDefaultReact(title);
        break;
      case "Webpack":
        createHtmlFile();
        createWebpackConfig();
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

function setupDefaultReact(title) {
  const defaultData = `
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
`;
  const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="../src/index.css"/>
  <title>${title}</title>
</head>
<body>
<noscript>You need to enable Javascript to run this website</noscript>
<div id="root"></div>
</body>
</html>
  `;
  fs.mkdirSync("./src/components");
  fs.mkdirSync("./public");
  fs.writeFileSync("./src/index.tsx", defaultData);
  fs.writeFileSync("./public/index.html", defaultHtml);
}

function createWebpackConfig() {
  const data = `
/*eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }  
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new HtmlWebpackTagsPlugin({
      tags: [{ path: "../src/index.css" }]
    })
  ],
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, ".")
    },
    compress: true,
    port: "5500"
  },
  target: "web",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build")
  }
};`;
  try {
    fs.writeFileSync("./webpack.config.js", data);
  } catch (error) {
    console.error(error);
  }
}

function createCSSFile() {
  try {
    const data = `
*,
*::before,
*::after{
  padding: 0;
  margin: 0;
  outline: none;
  border: none;
  box-sizing: border-box;
}
    `;

    fs.writeFileSync("./src/index.css", data);
  } catch (error) {
    console.error(error);
  }
}

function createHtmlFile() {
  try {
    const data = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>
<body>
  
</body>
</html>
  `;
    fs.writeFileSync("./src/index.html", data);
  } catch (error) {
    console.error(error);
  }
}

init();
