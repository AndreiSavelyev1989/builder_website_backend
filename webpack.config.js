const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development', // 'production' или 'development'
  entry: './src/index.js', // точка входа серверного приложения
  output: {
    path: path.resolve(__dirname, 'dist'), // директория сборки приложения
    filename: 'bundle.js', // имя выходного файла
  },
  target: 'node', // указываем, что приложение предназначено для Node.js
  externals: [nodeExternals()], // исключаем внешние зависимости
  module: {
    rules: [
      {
        test: /\.js$/, // применяем правило только к js файлам
        exclude: /node_modules/, // исключаем node_modules из сборки
        use: {
          loader: 'babel-loader', // используем babel-loader для транспиляции кода ES6/ES7 в ES5
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};