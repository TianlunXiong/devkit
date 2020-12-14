import { Configuration } from 'webpack';
import babelConfig from '../babel/base';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

function baseConfig() {
  const resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.less', '.scss'],
  }
  
  const module = {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: babelConfig,
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 1,
              name: 'images/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader?name=fonts/[name].[hash:8].[ext]',
          },
        ],
      },
    ]
  }
  
  const config: Configuration = {
    module,
    resolve,
    plugins: [],
  }
  return config;
}

function cssRule(option) {
  switch (option) {
    case 'style':
      return {
        module: {
          rules: [
            {
              test: /\.(css|scss)$/,
              use: [
                {
                  loader: require.resolve('style-loader'),
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                  },
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    sourceMap: true,
                    implementation: require('sass'),
                  },
                },
              ],
            },
            {
              test: /\.less$/,
              use: [
                {
                  loader: require.resolve('style-loader'),
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                  },
                },
                {
                  loader: require.resolve('less-loader'),
                },
              ],
            },
          ],
        },
      };
    case 'link':
      return {
        module: {
          rules: [
            {
              test: /\.(css|scss)$/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    publicPath: '../',
                  },
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 2,
                  },
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    sourceMap: true,
                    implementation: require('sass'),
                  },
                },
              ],
            },
            {
              test: /\.less$/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    publicPath: '../',
                  },
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 2,
                  },
                },
                {
                  loader: require.resolve('less-loader'),
                },
              ],
            },
          ]
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[id].[contenthash:8].css',
          }),
        ],
      };
    default: 
      return {};
  }
}

export { cssRule };
export default baseConfig;