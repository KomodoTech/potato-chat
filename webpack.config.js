// import path from "path";
// import HtmlWebpackPlugin from "html-webpack-plugin";
// import CopyPlugin from "copy-webpack-plugin";
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/client/App.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/client/index.html",
      filename: "./index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "./src/client/style.css" }],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "./dist"),
    },
    proxy: {
      "/api": "http://localhost:3000",
      secure: false,
    },
  },
};
