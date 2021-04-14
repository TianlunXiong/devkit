import { cssRule } from './webpack/webpack.config.base';
import dev from './webpack/webpack.config.dev';
import prod from './webpack/webpack.config.prod';
import {
  getCustomConfig,
  getPackageConfig,
  projectRelative,
  createSPAEntryProxy,
  createMPAEntryProxy,
  PKG_NAME,
  CustomConfig,
  pkgNameToNormalPkgName,
} from './utils';
import { Configuration, ProgressPlugin, container } from 'webpack';
import webpackMerge from 'webpack-merge';
import { StatsWriterPlugin } from 'webpack-stats-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import rimraf from 'rimraf';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { ICliConfig } from '../interface/cli';

const DIST_NAME = 'dist';
const CSS = 'style';
const INDENT = 1;
const HOT = true;
const MANIFEST_NAME = 'manifest.js';

const NODE_ENV = process.env.NODE_ENV;

const { name: pkgName, dependencies } = getPackageConfig();

type WebpackConfigType = 'dev' | 'prod';

function getWebpackConfig(type: 'dev', argsConfig?: ICliConfig): { config: Configuration, customConfig: CustomConfig }
function getWebpackConfig(type: 'prod', argsConfig?: ICliConfig): { config: Configuration, customConfig: CustomConfig };
function getWebpackConfig<T extends WebpackConfigType >(type: T, argsConfig?: ICliConfig): any { // any: 😢 https://github.com/microsoft/TypeScript/issues/24929
  const customConfig = getCustomConfig();

  const {
    app,
    pages,
    boot,
    html,
    css = CSS,
    indent = INDENT,
    components,
    hot = HOT,
    remotes,
    exposes,
    ...webpackConfig
  } = customConfig;

  let config: Configuration = {};

  const name = pkgNameToNormalPkgName(pkgName);
  config.name = name;

  switch (type) {
    case 'dev':
      // 增加 react-refresh/babel 热替换插件
      if (dev?.module?.rules?.[0] && hot) {
        // @ts-ignore
        dev.module.rules[0]?.use[0]?.options.plugins.push('react-refresh/babel');
        dev.plugins.push(new ReactRefreshPlugin())
      }
      if (css === 'style' && hot) {
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
    htmlPath = path.join(path.dirname(require.resolve(PKG_NAME)), './template/index.html')
  }

  const htmls: HtmlWebpackPlugin[] = [];

  config.entry = {};
  if (pages) {
    const pagesConfig = app === 'mpa' ? createMPAEntryProxy(customConfig) : createSPAEntryProxy(customConfig);
    pagesConfig.forEach(
      ({ entryName, filename, entry, htmlFilename, name: subName, html: subHtml }) => {
        if (entryName && filename) {
          config.entry[entryName] = {
            import: entry,
            // filename: filename,
          };
          if (html !== 'off') {
            const htmlConfig: HtmlWebpackPlugin.Options = {
              filename: htmlFilename,
              chunks: [entryName],
            };
            if (htmlPath) htmlConfig.template = htmlPath;
            if (app === 'mpa' && subHtml) htmlConfig.template = projectRelative(subHtml);
            htmlConfig.title = subName || name || pkgName;
            htmls.push(new HtmlWebpackPlugin(htmlConfig));
          }
        }
      },
    );
  }
  const { path: argsPath, publicPath: argsPublicPath = 'auto' } = argsConfig || {};

  const dist = projectRelative(argsPath || DIST_NAME);

  const { output, ...otherWebpackConfig } = webpackConfig;
  const customPublicPath = output?.publicPath;

  let publicPath = customPublicPath || argsPublicPath;

  config.output = {
    path: dist,
    filename: '[id].[contenthash].js',
    chunkFilename: (pathData) => {
      return `js/[id].[contenthash].js`;
    },
    publicPath,
  };

  config.stats = {
    preset: 'minimal',
    entrypoints: true,
  };

  const shared = {};
  for (let depName in dependencies) {
    shared[depName] = {
      singleton: true,
    }
  }

  config.plugins?.push(
    new StatsWriterPlugin({
      filename: 'stats.json',
      stats: {
        preset: 'minimal',
        assets: false,
        entrypoints: true,
      },
    }),
    new ProgressPlugin({
      activeModules: false,
      entries: true,
      modules: true,
      modulesCount: 5000,
      profile: false,
      dependencies: true,
      dependenciesCount: 10000,
      percentBy: null
    }),
    new container.ModuleFederationPlugin({
      name,
      filename: MANIFEST_NAME,
      shared,
      remotes,
      exposes,
    }),
    ...htmls,
  );
  return {
    config: webpackMerge(config, otherWebpackConfig),
    customConfig: {
      app,
      pages,
      boot,
      html,
      css,
      name,
      indent,
      components,
      hot,
      remotes,
      exposes,
    },
  };
}


export default getWebpackConfig;
