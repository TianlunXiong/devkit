import dev from './webpack/webpack.config.dev';
import prod from './webpack/webpack.config.prod';
import {
  getCustomConfig,
  projectRelative,
  createEntryProxy,
  PageInfo,
} from './utils';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

type WebpackConfigType = 'dev' | 'prod';

function getWebpackConfig(type: WebpackConfigType) {
  const { pages, boot, ...webpackConfig } = getCustomConfig();

  let config: Configuration;

  switch (type) {
    case 'dev':
      // 增加 react-refresh/babel 热替换插件
      if (dev.module?.rules?.[0]) {
        // @ts-ignore
        dev.module.rules[0]?.use[0]?.options.plugins.push([
          require.resolve('react-refresh/babel'),
        ]);
      }
      config = dev;
      break;
    case 'prod':
      config = prod;
      break;
    default:
      throw new Error('无效类型参数');
  }

  config.entry = {};
  if (pages) {
    const pathInfo: PageInfo[] = [];
    for (let i = 0; i < pages.length; i += 1) {
      const fullPath = projectRelative(pages[i]);

      const pagePathArr = fullPath.split('/');
      const [fileName] = pagePathArr.slice(-1);
      const fileNameSplitted = fileName.split('.');
      const name = fileNameSplitted
        .splice(0, fileNameSplitted.length - 1)
        .join('.');
      const ext = fileNameSplitted[fileNameSplitted.length - 1];
      if (name && ext) {
        // config.entry[name] = fullPath;
        pathInfo.push({
          name,
          loc: fullPath,
          ext,
          boot: boot ? projectRelative(boot) : undefined,
        });
      } else if (!name) {
        throw new Error('无效文件名');
      } else if (!ext) {
        throw new Error('无文件拓展名');
      }
    }

    const proxyEntryInfo = createEntryProxy(pathInfo) || [];

    const { entry } = config;
    proxyEntryInfo.forEach(({ name, loc }) => {
      if (name && loc) {
        entry[name] = loc;
      }
    });
  }

  config.output = {
    path: projectRelative('dist'),
    filename: '[id].entry.js',
    chunkFilename: '[id].chunk.js',
  };

  config.plugins?.push(
    new StatsWriterPlugin({
      filename: 'stats.json', // Default
    }),
  );

  return webpackMerge(config, webpackConfig);
}

export default getWebpackConfig;
