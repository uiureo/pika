const path = require('path')
const WebpackNotifierPlugin = require('webpack-notifier')

module.exports = {
  mode: 'development',
  entry: {
    popup: './src/popup/index.tsx',
    css: './src/index.scss',
    content: './src/content/index.ts',
    background: './src/background/index.ts'
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].css"
            }
          },
          "extract-loader",
          "css-loader",
          "sass-loader"
        ]
    }
    ]
  },
  plugins: [
    new WebpackNotifierPlugin()
  ]
}
