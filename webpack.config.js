const path = require('path');
const paths = require('./config.json').paths;
module.exports = {
  entry: './src/scripts/main.js',
  output: {
    path: path.join(__dirname + paths.build + 'scripts'),
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(njk|nunjucks)$/,
        loader: 'nunjucks-loader'
      }
    ]
  }
};
