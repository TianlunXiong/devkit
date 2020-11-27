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
import HtmlWebpackPlugin from 'html-webpack-plugin';
import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs';

const DIST_NAME = 'dist';

type WebpackConfigType = 'dev' | 'prod';

function getWebpackConfig(type: WebpackConfigType) {
  const { pages, boot, template, ...webpackConfig } = getCustomConfig();

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

  if (!template) {
    throw new Error('请指定 html 文件');
  }
  const htmlPath = projectRelative(template);
  const htmls: HtmlWebpackPlugin[] = [];

  config.entry = {};
  if (pages) {
    const pathInfo: PageInfo[] = [];
    const nameToFilenameMapping = {};
    const nameToHtmlFilenameMapping = {};

    for (let i = 0; i < pages.length; i += 1) {
      const fullPath = projectRelative(pages[i]);

      const pagePathArr = fullPath.split('/');
      const pageDir = pagePathArr.indexOf('page');
      if (pageDir === -1) {
        throw new Error('页面组件需要放到 page 文件夹下面');
      }
      const validPagePathArr = pagePathArr.slice(pageDir);
      const fileName = validPagePathArr[validPagePathArr.length - 1];
      const fileNameSplitted = fileName.split('.');
      const name = fileNameSplitted
        .slice(0, fileNameSplitted.length - 1)
        .join('.');
      const fullName = `${validPagePathArr
        .slice(0, validPagePathArr.length - 1)
        .join('/')}/${name}.js`;
      const fullHtmlFileName = `${validPagePathArr
        .slice(0, validPagePathArr.length - 1)
        .join('/')}/${name}.html`;
      const ext = fileNameSplitted[fileNameSplitted.length - 1];
      if (name && ext) {
        nameToFilenameMapping[name] = fullName;
        nameToHtmlFilenameMapping[name] = fullHtmlFileName;
        pathInfo.push({
          name,
          loc: fullPath,
          ext,
          boot: boot ? projectRelative(boot) : undefined,
        });
      } else if (!name) {
        throw new Error('无效文件名');
      } else if (!ext) {
        throw new Error('请完善文件后缀');
      }
    }

    const proxyEntryInfo = createEntryProxy(pathInfo) || [];

    const { entry } = config;
    proxyEntryInfo.forEach(({ name, loc }) => {
      if (name && loc) {
        entry[name] = {
          import: loc,
          filename: nameToFilenameMapping[name],
        };
        htmls.push(
          new HtmlWebpackPlugin({
            filename: nameToHtmlFilenameMapping[name],
            template: htmlPath,
            chunks: [name]
          })
        )
      }
    });
  }

  const dist = projectRelative(DIST_NAME);

  config.output = {
    path: dist,
    // filename: '[id].entry.js',
    chunkFilename: (pathData) => {
      // const dir = pathData.runtime;
      return `chunk/[id].chunk.js`;
    },
  };

  config.plugins?.push(
    new StatsWriterPlugin({
      filename: 'stats.json', // Default
    }),
    ...htmls,
  );

  if (fs.existsSync(dist)) rimraf.sync(dist);

  return webpackMerge(config, webpackConfig);
}

export default getWebpackConfig;
