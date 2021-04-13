import path from 'path';
import fs from 'fs';
import { Configuration } from 'webpack';
import rimraf from 'rimraf';

export const PKG_NAME = '@myfe/ui-cloud-cli';

export const CONFIG_NAME = 'xcloud.config.js';

export interface FileInfo {
  filePath?: string;
  type?: string;
}

const fileTree = (list: FileInfo[], dirPath: string) => {
  const files = fs.readdirSync(dirPath);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i]);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      fileTree(list, filePath);
    } else {
      const type = path.extname(files[i]).substring(1);
      list.push({ filePath, type });
    }
  }
};

// 获取项目文件
const getProjectPath = (dir = './'): string => {
  return path.join(process.cwd(), dir);
};


type PageDetail = {
  name?: string,
  pathname?: string,
  src?: string,
  html?: string,
  boot?: string,
};
type Page = string | PageDetail;
type PageConfig = {
  entry: string,
  entryName: string,
  filename: string,
  htmlFilename: string,
} & PageDetail;

export type App = 'spa' | 'mpa' | 'component';
interface CustomConfig extends Configuration {
  app?: App,
  pages?: Page[];
  boot?: string,
  html?: string,
  css?: string,
  indent?: number,
  components?: string,
  hot?: boolean,
  remotes?: {
    [name: string]: string
  },
  exposes?: {
    [name: string]: string
  },
}

interface PkgConfig {
  name: string,
  version: string,
  dependencies: {
    [pkgName: string]: string
  },
  path: string,
}

// 获取项目文件
const getCustomConfig = (configFileName = CONFIG_NAME): Partial<CustomConfig> => {
  const configPath = path.join(process.cwd(), configFileName);
  if (fs.existsSync(configPath)) {
    return require(configPath);
  }
  return {}
};

const getPackageConfig = (() => {
  const pkgPath = path.join(process.cwd(), 'package.json');
  let cache: Partial<PkgConfig> = {};
  if (fs.existsSync(pkgPath)) {
    cache = require(pkgPath);
  }
  cache.path = pkgPath;
  return () => cache
})();

const projectRelative = (filename) => path.join(process.cwd(), filename);

interface PageInfo {
  name: string; // 入口名称
  loc: string; // 页面路径
  ext: string; // 后缀
  boot?: string; // 启动代码
}

function createSPAEntryProxy(config: CustomConfig): PageConfig[] {
  const { pages, name, boot, indent = 1 } = config;
  const { name: pkgName } = require(projectRelative('./package.json'));

  if (!pkgName) {
    throw new Error('请初始化项目')
  }

  const tmpP = path.join(
    path.dirname(require.resolve(PKG_NAME)),
    `../tmp`,
  );
  if (!fs.existsSync(tmpP)) {
    fs.mkdirSync(tmpP)
  }

  const tmpPath = path.join(tmpP, `./${pkgName}`);
  if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath);
  fs.mkdirSync(tmpPath, { recursive: true });

  let globalBootPath;
  if (boot) {
    globalBootPath = projectRelative(boot);
  } else {
    globalBootPath = path.join(path.dirname(require.resolve(PKG_NAME)), './template/spa-bootstrap.tsx');
  }



  const uniqueName = `${pkgName}_spa`;
  const ext = '.tsx';
  const entryProxyLoc = `${tmpPath}/${uniqueName}.entry.proxy${ext}`;
  const pageproxyloc = `${tmpPath}/${uniqueName}.page.proxy${ext}`;
  const bootstrapproxyloc = `${tmpPath}/${uniqueName}.bootstrap.proxy${ext}`;

  // 页面信息
  let pageCode = '[';
  pages.forEach((item) => {
    if (typeof item === 'string') {
      const absolutePath = projectRelative(item);
      const relativePath = path.relative(
        path.dirname(globalBootPath),
        absolutePath,
      );
      const {
        name,
        dir,
      } = path.parse(item);
      const preDir = dir.split(path.sep).slice(indent).join(path.sep);
      let pathname = 'undefined';
      if (name === 'index') {
        pathname = `/${preDir || ''}`;
      } else {
        pathname = `/${preDir ? `${preDir}/` : ''}${name}`;
      }

      pageCode += `{
        src: '${path.dirname(relativePath)}/${path.basename(relativePath)}',
        component: () => import('${absolutePath}'),
        pathname: '${pathname}',
      },`;
    } else {
      const { src, ...others } = item;
      const absolutePath = projectRelative(src);
      const relativePath = path.relative(
        path.dirname(globalBootPath),
        absolutePath,
      );
      pageCode += `{
        src: '${path.dirname(relativePath)}/${path.basename(relativePath)}',
        component: () => import('${absolutePath}'),
        ...${JSON.stringify(others)}
      },`;
    }
  });
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
      name,
    },
  ];
}

function createMPAEntryProxy(config: CustomConfig): PageConfig[] {
  const { pages, boot, indent = 1 } = config;

  const { name: pkgName } = require(projectRelative('./package.json'));

  if (!pkgName) {
    throw new Error('未找到package.json，请初始化项目');
  }

  const tmpP = path.join(path.dirname(require.resolve(PKG_NAME)), `../tmp`);
  if (!fs.existsSync(tmpP)) {
    fs.mkdirSync(tmpP);
  }

  const tmpPath = path.join(tmpP, `./${pkgName}`);

  const bakePath = path.join(path.dirname(require.resolve(PKG_NAME)), './');
  if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath);
  fs.mkdirSync(tmpPath);

  let globalBootPath;
  if (boot) {
    globalBootPath = projectRelative(boot);
  }

  const pagesConfig: PageConfig[] = [];

  pages.forEach((page) => {
    if (typeof page === 'string') {
      const pagePath = projectRelative(page);
      const { name, dir, ext } = path.parse(page);

      const preDir = dir.split(path.sep).slice(indent).join(path.sep);
      let pureName;

      const S = path.sep;
      if (name === 'index') {
        pureName = `.${S}${preDir ? `${preDir}${S}` : ''}${name}`;
      } else {
        pureName = `.${S}${preDir ? `${preDir}${S}` : ''}${name}${S}index`;
      }

      const uniqueName = `${pkgName}.${pureName.split(S).join('_')}`;

      const entryProxyLoc = `${tmpPath}/${uniqueName}.entry.proxy${ext}`;
      const pageproxyloc = `${tmpPath}/${uniqueName}.page.proxy${ext}`;
      const bootstrapproxyloc = `${tmpPath}/${uniqueName}.bootstrap.proxy${ext}`;

      fs.writeFileSync(pageproxyloc, `export { default } from '${pagePath}'`);
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

      const async = `
      Promise.all([import('${bootstrapproxyloc}'), import('${pageproxyloc}')])
        .then(([{ default: BOOTSTRAP_CODE }, { default: PAGE }]) => {
          if (PAGE && typeof BOOTSTRAP_CODE === 'function') BOOTSTRAP_CODE(PAGE);
        })
      `;
      fs.writeFileSync(entryProxyLoc, async);

      pagesConfig.push({
        entry: entryProxyLoc,
        entryName: pureName,
        filename: `${pureName}.js`,
        htmlFilename: `${pureName}.html`,
      });
    } else {
      const { src, boot: selfBoot, pathname, ...others } = page;
      const pagePath = projectRelative(src);

      const { name, dir, ext } = path.parse(pagePath);

      const uniqueName = `${dir.split(path.sep).join('-')}-${name}`;
      const entryProxyLoc = `${tmpPath}/${uniqueName}.entry.proxy${ext}`;
      const pageproxyloc = `${tmpPath}/${uniqueName}.page.proxy${ext}`;
      let bootstrapproxyloc = `${tmpPath}/${uniqueName}.bootstrap.proxy${ext}`;

      fs.writeFileSync(pageproxyloc, `export { default } from '${pagePath}'`);
      if (selfBoot) {
        const selfBootPath = projectRelative(selfBoot);
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

      let pureName;
      if (pathname) {
        pureName = `${path.join('.', pathname, 'index')}`;
      } else {
        const { name, dir, ext } = path.parse(src);

        const preDir = dir.split(path.sep).slice(indent).join(path.sep);

        if (name === 'index') {
          pureName = `./${preDir ? `${preDir}/` : ''}${name}`;
        } else {
          pureName = `./${preDir ? `${preDir}/` : ''}${name}/index`;
        }
      }

      pagesConfig.push({
        entry: entryProxyLoc,
        entryName: pureName,
        filename: `${pureName}.js`,
        htmlFilename: `${pureName}.html`,
        ...others,
      });
    }
  });
  return pagesConfig;
}


function pkgNameToNormalPkgName(pkgName: string) {
  return pkgName.replace(/^@/, '').replace(/\//, '__')
}


export {
  PageInfo,
  CustomConfig,
  fileTree,
  pkgNameToNormalPkgName,
  getProjectPath,
  getCustomConfig,
  getPackageConfig,
  projectRelative,
  createSPAEntryProxy,
  createMPAEntryProxy,
};
