const inquirer = require("inquirer");
const execSync = require("child_process").execSync;
const fs = require("fs");

function executeCommand(string) {
  try {
    execSync(string, { encoding: "utf-8", stdio: "inherit" });
  } catch (error) {
    console.log(error);
  }
}

function fetchDependencies(string) {
  const dependencies = [
    "typescript",
    "typesync",
    "@typescript-eslint/parser",
    "@typescript-eslint/eslint-plugin",
    "prettier",
    "jest",
    "eslint",
  ];

  switch (string) {
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

function createConfigType(string) {
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

  switch (string) {
    case "React":
      config.compilerOptions.jsx = "react";
      break;
    case "Webpack":
      config.compilerOptions.module = "es6";
      break;
    default:
      break;
  }

  return JSON.stringify(config);
}

console.log("Welcome to the default Typescript Project Builder");
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

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
    if (!answers.title) throw new Error("Cannot create directory with no name");
    console.log(
      `Creating ${answers["project-type"]} project in directory ${answers.title}`
    );

    const dependencies = fetchDependencies(answers.title);
    const data = createConfigType(answers.title);

    fs.mkdirSync(`./${answers.title}`);
    process.chdir(`./${answers.title}`);
    console.log("Initializing npm...");
    executeCommand("npm init -y");
    console.log("Fetching dependencies...");
    console.log("Found dependenices. Installing now...");
    executeCommand(`npm i -D ${dependencies}`);
    console.log("Creating Typescript config file...");
    fs.writeFileSync("./tsconfig.json", data);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
