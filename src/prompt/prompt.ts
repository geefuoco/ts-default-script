import { prompt } from "inquirer";
import { buildProject } from "../projectBuilder/projectBuilder";

const args = process.argv.slice(2);
const projectName = args[0];
if (!projectName) {
  console.error(
    "Cannot create project without name. Please enter name as first arguement"
  );
  process.exit(1);
}

const question = {
  type: "rawlist",
  name: "project-type",
  message: "Please select the type of project you want to create",
  choices: ["Nodejs", "React", "Webpack"]
};

export function start() {
  prompt([question])
    .then((answers) => {
      const template: string | null = answers["project-type"];
      if (!template) throw new Error("Could not find selected template");
      console.log(`Creating ${projectName} with template: ${template}`);
      buildProject(projectName, template);
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
}
