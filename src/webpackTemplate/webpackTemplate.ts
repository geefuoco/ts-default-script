/*eslint-disable*/
export function generateWebpackTemplate(): string {
  return `
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
}
