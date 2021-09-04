const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const MANIFEST = require('./extension/manifest.json')
const PACKAGE = require('./package.json')

const manifest = {
  name: PACKAGE.chrome.name,
  author: PACKAGE.author,
  version: PACKAGE.version,
  description: PACKAGE.description,
  manifest_version: 2,
  ...MANIFEST,
}
const devServer =
  process.env.NODE_ENV === 'production'
    ? false
    : {
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        hot: true,
      }

module.exports = {
  entry: {
    app: './src/index.js',
    background: './extension/background.js',
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      assets: path.resolve(__dirname, 'src/assets/'),
      hooks: path.resolve(__dirname, 'src/hooks/'),
      services: path.resolve(__dirname, 'src/services/'),
      store: path.resolve(__dirname, 'src/store/'),
      state: path.resolve(__dirname, 'src/state/'),
      models: path.resolve(__dirname, 'src/models/'),
    },
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
  },
  devServer,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: './src/index.html',
      chunks: ['app'],
    }),
    new CopyWebpackPlugin(
      [{ from: './src/assets/img/icon/*', to: './img/icon', flatten: true }],
      {
        copyUnmodified: true,
      }
    ),
    new GenerateJsonPlugin('manifest.json', manifest, null, 2),
    new ZipPlugin({
      filename: `${PACKAGE.chrome.name.replace(
        /\s/g,
        '_'
      )}_${PACKAGE.version.replace(/\./g, ',')}.zip`,
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        include: path.resolve(__dirname, 'src'),
        use: ['file-loader'],
      },
    ],
  },
}
