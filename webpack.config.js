const path = require("path");
const nodePolyfill = require('node-polyfill-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      url: require.resolve("url/"),
      buffer: require.resolve("buffer/"),
      crypto: false,
      fs: false,
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      http: require.resolve("stream-http"),
      querystring: require.resolve("querystring-es3"),
      zlib: false,
      os: false,
      net: require.resolve("net-browserify"),
      express: require.resolve("express"),
      async_hooks: require.resolve("async_hooks"),
      timers: require.resolve("timers-browserify"),
    },
  },
  plugins: [
    new nodePolyfill()
  ]
};
