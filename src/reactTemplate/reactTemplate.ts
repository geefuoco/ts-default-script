import { generateHtmlTemplate } from "../htmlTemplate/htmlTemplate";

interface ReactFiles {
  index: string;
  app: string;
  html: string;
}

function createReactTemplate(projectName = "Create Ts Project React"): string {
  let html = generateHtmlTemplate(projectName);
  const reactHtml = `
<noscript>Please enable javascript to use this app. </noscript/>
<div id="root"></div>
  `;
  html = html.replace(/<!-- template -->/, reactHtml);
  return html;
}

function generateReactFiles(projectName: string): ReactFiles {
  const index = `
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";

root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  `;

  const html = createReactTemplate(projectName);

  const app = `
import React from "react";

const App:React.FC = () => {
  return <div className="app">Hello, World!</div>;
}

export default App;
  `;

  return { index, app, html };
}

export { generateReactFiles };
