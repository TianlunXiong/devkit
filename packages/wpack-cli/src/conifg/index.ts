import dev from './webpack/webpack.config.dev';
import prod from './webpack/webpack.config.prod';
import { getCustomConfig } from './utils';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';

type WebpackConfigType = 'dev' | 'prod';

function getWebpackConfig(type: WebpackConfigType) {
  const { entries, ...webpackConfig } = getCustomConfig();

  let config: Configuration;

  switch (type) {
    case 'dev':
      config = dev;
      break;
    case 'prod':
      config = prod;
      break;
    default:
      throw new Error('无效类型参数');
  }

  config.entry = {};
  Object.keys(entries || {}).forEach((key) => {
    if (entries?.[key].entry && config.entry) {
      config.entry[key] = entries[key].entry;
    }
    config?.plugins?.push(new HtmlWebpackPlugin({
      template: entries?.[key].template,
      filename: `${key}.html`,
      // chunks: ['manifest', key],
      favicon: entries?.[key].favicon,
      inject: entries?.[key].inject !== false,
    }));
  });

  return webpackMerge(config, webpackConfig);
}

export default getWebpackConfig;

