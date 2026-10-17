const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },

  externals: {
    electron: 'commonjs electron',
  },

  resolve: {
    fallback: {
      fs: false,
      path: false,
      stream: false,
      crypto: false,
      buffer: false,
      util: false,
      assert: false,
      os: false,
      http: false,
      https: false,
      zlib: false,
      url: false,
      constants: false,
    },
  },
};