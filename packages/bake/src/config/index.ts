import { cssRule } from './webpack/webpack.config.base';
import dev from './webpack/webpack.config.dev';
import prod from './webpack/webpack.config.prod';
import {
  getCustomConfig,
  projectRelative,
  createSPAEntryProxy,
  createMPAEntryProxy,
} from './utils';
import { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import { StatsWriterPlugin } from 'webpack-stats-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import rimraf from 'rimraf';
import fs from 'fs';
import path from 'path';

const DIST_NAME = 'dist';

type WebpackConfigType = 'dev' | 'prod';

function getWebpackConfig(type: WebpackConfigType): Configuration {
  const customConfig = getCustomConfig();
  const {
    app,
    pages,
    boot,
    html,
    css = 'style',
    name = 'BAKE',
    indent = 1,
    components,
    ...webpackConfig
  } = customConfig;

  let config: Configuration = {};

  if (name) {
    config.name = name;
  }

  switch (type) {
    case 'dev':
      // 增加 react-refresh/babel 热替换插件
      if (dev.module?.rules?.[0]) {
        // @ts-ignore
        dev.module.rules[0]?.use[0]?.options.plugins.push([
          require.resolve('react-refresh/babel'),
        ]);
      }
      if (css === 'style') {
        // 增加 css-hot-loader 热替换插件
        if (dev.module?.rules?.[1]) {
          // @ts-ignore
          dev.module.rules[1]?.use?.unshift({
            loader: 'css-hot-loader',
            options: {},
          });
        }
        // 增加 css-hot-loader 热替换插件
        if (dev.module?.rules?.[2]) {
          // @ts-ignore
          dev.module.rules[2]?.use?.unshift({
            loader: 'css-hot-loader',
            options: {},
          });
        }
      }
      config = dev;
      break;
    case 'prod':
      config = prod;
      break;
    default:
      throw new Error('无效类型参数');
  }

  config = webpackMerge(config, cssRule(css));

  let htmlPath;
  if (html) {
    htmlPath = projectRelative(html);
  } else {
    htmlPath = path.join(path.dirname(require.resolve('@vikit/bake')), './template/index.html')
  }

  const htmls: HtmlWebpackPlugin[] = [];

  config.entry = {};
  if (pages) {
    const pagesConfig = app === 'mpa' ? createMPAEntryProxy(customConfig) : createSPAEntryProxy(customConfig);
    pagesConfig.forEach(
      ({ entryName, filename, entry, htmlFilename, name: subName, html }) => {
        if (entryName && filename) {
          config.entry[entryName] = {
            import: entry,
            filename: filename,
          };
          const htmlConfig: HtmlWebpackPlugin.Options = {
            filename: htmlFilename,
            chunks: [entryName],
          };
          if (htmlPath) htmlConfig.template = htmlPath;
          if (app === 'mpa' && html) htmlConfig.template = projectRelative(html);
          htmlConfig.title = subName || name;
          htmls.push(new HtmlWebpackPlugin(htmlConfig));
        }
      },
    );
  }

  const dist = projectRelative(DIST_NAME);

  config.output = {
    path: dist,
    chunkFilename: (pathData) => {
      return `js/[id].chunk.js`;
    },
    publicPath: 'auto'
  };

  config.stats = {
    preset: 'minimal',
    entrypoints: true,
  };

  config.plugins?.push(
    new StatsWriterPlugin({
      filename: 'stats.json',
      stats: {
        preset: 'minimal',
        assets: false,
        entrypoints: true,
      },
    }),
    ...htmls,
  );

  if (fs.existsSync(dist)) rimraf.sync(dist);

  return webpackMerge(config, webpackConfig);
}

export default getWebpackConfig;
