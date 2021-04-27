import { cssRule } from './webpack/webpack.config.base';
import dev from './webpack/webpack.config.dev';
import prod from './webpack/webpack.config.prod';
import {
  getCustomConfig,
  getPackageConfig,
  projectRelative,
  PKG_NAME,
  pkgNameToNormalPkgName,
} from './utils';
import { Configuration, ProgressPlugin, container } from 'webpack';
import fs from 'fs';
import webpackMerge from 'webpack-merge';
import { StatsWriterPlugin } from 'webpack-stats-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import rimraf from 'rimraf';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { Cli, PageConfig, XCloudConfig } from '../type';

const DIST_NAME = 'dist';
const CSS = 'style';
const HOT = true;
const MANIFEST_NAME = 'manifest.js';
const NODE_ENV = process.env.NODE_ENV;
const { name: pkgName, dependencies } = getPackageConfig();

function getWebpackConfig(type: 'dev' | 'prod', argsConfig: Cli): Configuration {
  const customConfig = getCustomConfig();

  const {
    pages,
    html,
    src: srcMapping,
  } = customConfig;
  let config: Configuration = {};
  const name = pkgNameToNormalPkgName(pkgName);
  
  switch (type) {
    case 'dev':
      // 增加 react-refresh/babel 热替换插件
      if (dev?.module?.rules?.[0] && HOT) {
        // @ts-ignore
        dev.module.rules[0]?.use[0]?.options.plugins.push('react-refresh/babel');
        dev.plugins.push(new ReactRefreshPlugin())
      }
      if (CSS === 'style' && HOT) {
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

  config = webpackMerge(config, {...cssRule(CSS), name });

  let htmlPath;
  if (html) {
    htmlPath = projectRelative(srcMapping[html] || html);
  } else {
    htmlPath = path.join(path.dirname(require.resolve(PKG_NAME)), './template/index.html')
  }

  const htmls: HtmlWebpackPlugin[] = [];

  config.entry = {};
  if (pages && argsConfig.cloud !== true) {
    const pagesConfig =
      argsConfig.type === 'mpa'
      ? createMPAEntryProxy(customConfig): createSPAEntryProxy(customConfig);
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
            if (argsConfig.type === 'mpa' && subHtml) htmlConfig.template = projectRelative(srcMapping[subHtml] || subHtml);
            htmlConfig.title = subName || name || pkgName;
            htmls.push(new HtmlWebpackPlugin(htmlConfig));
          }
        }
      },
    );
  }
  config.plugins.push(...htmls);

  const distPath = projectRelative(argsConfig.out || DIST_NAME);
  rimraf.sync(distPath);

  config.output = {
    path: path.resolve(process.cwd(), distPath),
    filename: '[id].[contenthash:8].js',
    chunkFilename: (pathData) => {
      return `js/[id].[contenthash:8].js`;
    },
    publicPath: argsConfig.publicPath || 'auto',
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
  );

  if (customConfig.cloud) {
    if (customConfig.cloud.export || customConfig.cloud.import) {
      const shared = {};
      for (let depName in dependencies) {
        shared[depName] = {
          singleton: true,
        };
      }
  
      let remotes = {};
      let exposes = {};
  
      const comp_export = customConfig.cloud.export;
  
      if (comp_export instanceof Array) {
        comp_export.forEach((name) => {
          if (customConfig.src[name]) exposes[`./${path.join('./', name)}`] = `./${path.join('./', customConfig.src[name])}`;
        })
      } else if (comp_export instanceof Object) {
        Object.keys(comp_export).forEach((name) => {
          const t = customConfig.src[name] || comp_export[name]
          if (t) exposes[`./${path.join('./', name)}`] = t;
        })
      }

      const m = {
        name,
        filename: MANIFEST_NAME,
        shared,
        remotes,
        exposes,
      }

      config.plugins.push(
        new container.ModuleFederationPlugin(m)
      );
    }
  }

  return config;
}

function createMPAEntryProxy(config: XCloudConfig): PageConfig[] {
  const { src: srcMapping, pages, boot } = config;

  const { name: pkgName } = require(projectRelative('./package.json'));

  if (!pkgName) {
    throw new Error('未找到package.json，请初始化项目');
  }

  const tmpP = path.join(path.dirname(require.resolve(PKG_NAME)), `../tmp`);
  if (!fs.existsSync(tmpP)) {
    fs.mkdirSync(tmpP, { recursive: true });
  }

  const tmpPath = path.join(tmpP, `./${pkgName}`);

  const bakePath = path.join(path.dirname(require.resolve(PKG_NAME)), './');
  if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath);
  fs.mkdirSync(tmpPath, { recursive: true });

  let globalBootPath;
  if (boot) {
    globalBootPath = projectRelative(srcMapping[boot] || boot);
  }

  const pagesConfig: PageConfig[] = [];

  Object.keys(pages).forEach((pageName) => {
    let src: string, pageBoot: string, html: string;
    const item = pages[pageName];
    if (typeof item === 'object') {
      src = srcMapping[item.src] || item.src;
      pageBoot= srcMapping[item.boot] || item.boot ;
      html = srcMapping[item.html] || item.html ;
    } else  {
      src = srcMapping[item];
    }

    const pagePath = projectRelative(src);
    const { name, dir, ext } = path.parse(pagePath);

    const uniqueName = `${dir.split(path.sep).join('-')}-${name}`;
    const entryProxyLoc = `${tmpPath}/${uniqueName}.entry.proxy${ext}`;
    const pageproxyloc = `${tmpPath}/${uniqueName}.page.proxy${ext}`;
    let bootstrapproxyloc = `${tmpPath}/${uniqueName}.bootstrap.proxy${ext}`;

    fs.writeFileSync(pageproxyloc, `export { default } from '${pagePath}'`);
    if (pageBoot) {
      const selfBootPath = projectRelative(pageBoot);
      fs.writeFileSync(
        bootstrapproxyloc,
        `export { default } from '${selfBootPath}'`,
      );
    } else {
      if (globalBootPath) {
        fs.writeFileSync(
          bootstrapproxyloc,
          `export { default } from '${globalBootPath}'`,
        );
      } else {
        fs.writeFileSync(
          bootstrapproxyloc,
          `export { default } from '${path.resolve(
            bakePath,
            './template/mpa-bootstrap.tsx',
          )}'`,
        );
      }
    }
    const async = `
      Promise.all([import('${bootstrapproxyloc}'), import('${pageproxyloc}')])
        .then(([{ default: BOOTSTRAP_CODE }, { default: PAGE }]) => {
          if (PAGE && typeof BOOTSTRAP_CODE === 'function') BOOTSTRAP_CODE(PAGE);
        })
      `;
      fs.writeFileSync(entryProxyLoc, async);

      const pureName = `${path.join('.', pageName, 'index')}`;

      pagesConfig.push({
        entry: entryProxyLoc,
        entryName: pureName,
        filename: `${pureName}.js`,
        htmlFilename: `${pureName}.html`,
      });
  })
  return pagesConfig;
}

function createSPAEntryProxy(config: XCloudConfig): PageConfig[] {
  const { pages, boot, html, src: srcMapping } = config;
  const { name: pkgName } = require(projectRelative('./package.json'));

  if (!pkgName) {
    throw new Error('请初始化项目')
  }

  const tmpP = path.join(
    path.dirname(require.resolve(PKG_NAME)),
    `../tmp`,
  );
  if (!fs.existsSync(tmpP)) {
    fs.mkdirSync(tmpP, { recursive: true })
  }

  const tmpPath = path.join(tmpP, `./${pkgName}`);
  if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath);
  fs.mkdirSync(tmpPath, { recursive: true });

  let globalBootPath;
  if (boot) {
    globalBootPath = projectRelative(srcMapping[boot] || boot);
  }

  const uniqueName = `${pkgNameToNormalPkgName(pkgName)}_spa`;
  const ext = '.tsx';
  const entryProxyLoc = `${tmpPath}/${uniqueName}.entry.proxy${ext}`;
  const pageproxyloc = `${tmpPath}/${uniqueName}.page.proxy${ext}`;
  const bootstrapproxyloc = `${tmpPath}/${uniqueName}.bootstrap.proxy${ext}`;

  // 页面信息
  let pageCode = '[';
  Object.keys(pages).forEach((pathName) => {
    const item = pages[pathName];
    let src: string;
    if (typeof item === 'object') {
      src = srcMapping[item.src] || item.src;
    } else {
      src = srcMapping[item];
    }
    const absolutePath = projectRelative(src);
    const relativePath = path.relative(
      path.dirname(globalBootPath),
      absolutePath,
    );
    pageCode += `{
      src: '${path.dirname(relativePath)}/${path.basename(relativePath)}',
      component: () => import('${absolutePath}'),
      pathname: '${pathName}'
    },`;
  })
  pageCode += ']';

  fs.writeFileSync(pageproxyloc, `export default ${pageCode}`);

  // 启动代码
  if (globalBootPath)
    fs.writeFileSync(
      bootstrapproxyloc,
      `export { default } from '${globalBootPath}'`,
    );

  // 代理入口
  const entryCode = `
    Promise.all([import('${bootstrapproxyloc}'), import('${pageproxyloc}')])
      .then(([{ default: BOOTSTRAP_CODE }, { default: PAGE }]) => {
        if (PAGE && typeof BOOTSTRAP_CODE === 'function') BOOTSTRAP_CODE(PAGE);
      })
    `;
  fs.writeFileSync(entryProxyLoc, entryCode);

  return [
    {
      entry: entryProxyLoc,
      entryName: 'index',
      filename: 'index.js',
      htmlFilename: 'index.html',
    },
  ];
}


export default getWebpackConfig;
