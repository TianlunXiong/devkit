import dev from './webpack/webpack.config.dev';
import prod from './webpack/webpack.config.prod';
import { getCustomConfig, projectRelative } from './utils';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

type WebpackConfigType = 'dev' | 'prod';

function getWebpackConfig(type: WebpackConfigType) {
  const { page, ...webpackConfig } = getCustomConfig();

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
  if (page) {
    for (let i = 0; i < page.length; i += 1) {
      const fullPath = projectRelative(page[i]);
      
      const pagePathArr = fullPath.split('/');
      const [fileName] = pagePathArr.slice(-1);
      const name = /^(\w+)(\.\w+)?$/.exec(fileName)?.[1] || null;
      if (name) {
        config.entry[name] = fullPath;
      } else {
        throw new Event('无效文件名');
      }
    }
  }

  config.output = {
    path: projectRelative('dist'),
    filename: '[id].entry.js',
    chunkFilename: '[id].chunk.js',
  };

  // console.log(config.entry);

  config.plugins?.push(
    new StatsWriterPlugin({
      filename: "stats.json" // Default
    })
  )

  return webpackMerge(config, webpackConfig);
}

export default getWebpackConfig;

