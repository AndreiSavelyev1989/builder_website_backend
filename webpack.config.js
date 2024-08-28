const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development', // 'production' или 'development'
  entry: './src/server.js', // entry point to the server app
  output: {
    path: path.resolve(__dirname, 'dist'), // app build directory
    filename: 'bundle.js', // output file name
  },
  target: 'node', // app is intended for Node.js
  externals: [nodeExternals()], // exclude external dependencies
  module: {
    rules: [
      {
        test: /\.js$/, // apply the rule only to js files
        exclude: /node_modules/, // exclude node_modules from build
        use: {
          loader: 'babel-loader', // use babel-loader for transpile code from ES6/ES7 to ES5
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};