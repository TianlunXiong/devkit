import path from 'path';
import fs from 'fs';
import { Configuration } from 'webpack';
import rimraf from 'rimraf';

// const { ModuleFederationPlugin } = container;

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
  src?: string,
  name?: string,
  pathname?: string,
  boot?: string,
};
type Page = string | PageDetail;
type PageConfig = {
  entry: string,
  entryName: string,
  filename: string,
  htmlFilename: string,
} & PageDetail;

interface CustomConfig extends Configuration {
  app?: 'spa' | 'mpa',
  pages?: Page[];
  name?: string,
  boot?: string,
  html?: string,
  css?: string,
  // moduleFederation?: ConstructorParameters<typeof ModuleFederationPlugin>[0]
}

// 获取项目文件
const getCustomConfig = (configFileName = 'bake.config.js'): Partial<CustomConfig> => {
  const configPath = path.join(process.cwd(), configFileName);
  if (fs.existsSync(configPath)) {
    // eslint-disable-next-line import/no-dynamic-require
    return require(configPath);
  }
  return {};
};

const projectRelative = (filename) => path.join(process.cwd(), filename);

interface PageInfo {
  name: string; // 入口名称
  loc: string; // 页面路径
  ext: string; // 后缀
  boot?: string; // 启动代码
}

function createSPAEntryProxy(config: CustomConfig): PageConfig[] {
  const { pages, name, boot } = config;
  
  const tmpPath = path.join(path.dirname(require.resolve('@vikit/bake')), '../tmp');
  if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath);
  fs.mkdirSync(tmpPath);

  let globalBootPath;
  if (boot) {
    globalBootPath = projectRelative(boot);
  }

  const uniqueName = 'spa';
  const ext = '.tsx';
  const entryProxyLoc = `${tmpPath}/${uniqueName}.entry.proxy${ext}`;
  const pageproxyloc = `${tmpPath}/${uniqueName}.page.proxy${ext}`;
  const bootstrapproxyloc = `${tmpPath}/${uniqueName}.bootstrap.proxy${ext}`;

  // 代理入口
  const entryCode = `
  Promise.all([import('${bootstrapproxyloc}'), import('${pageproxyloc}')])
    .then(([{ default: BOOTSTRAP_CODE }, { default: PAGE }]) => {
      if (PAGE && typeof BOOTSTRAP_CODE === 'function') BOOTSTRAP_CODE(PAGE);
    })
  `;
  fs.writeFileSync(entryProxyLoc, entryCode);


  // 页面信息
  let pageCode = '[';
  pages.forEach((item) => {
    if (typeof item === 'string') {
      const absolutePath = projectRelative(item);
      const relativePath = path.relative(path.dirname(globalBootPath), absolutePath);
      pageCode += `{
        src: '${path.dirname(relativePath)}/${path.basename(relativePath)}',
        component: () => import('${absolutePath}')
      },`;
    } else {
      const { src, ...others } = item;
      const absolutePath = projectRelative(src);
      const relativePath = path.relative(path.dirname(globalBootPath), absolutePath);
      pageCode += `{
        src: '${path.dirname(relativePath)}/${path.basename(relativePath)}',
        component: () => import('${absolutePath}'),
        ...${JSON.stringify(others)}
      },`;
    }
  })
  pageCode += ']';

  fs.writeFileSync(pageproxyloc, `export default ${pageCode}`);

  // 启动代码
  if (globalBootPath) fs.writeFileSync(bootstrapproxyloc, `export { default } from '${globalBootPath}'`);

  return [
    {
      entry: entryProxyLoc,
      entryName: 'index',
      filename: 'index.js',
      htmlFilename: 'index.html',
      name: name || 'BAKE SPA',
    },
  ];
}

function createMPAEntryProxy(config: CustomConfig): PageConfig[] {
  const { pages, boot } = config;
  
  const tmpPath = path.join(path.dirname(require.resolve('@vikit/bake')), '../tmp');
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
      const {
        name,
        dir,
        ext,
      } = path.parse(pagePath);

      const uniqueName = `${dir.split(path.sep).join('-')}-${name}`;
      const entryProxyLoc = `${tmpPath}/${uniqueName}.entry.proxy${ext}`;
      const pageproxyloc = `${tmpPath}/${uniqueName}.page.proxy${ext}`;
      const bootstrapproxyloc = `${tmpPath}/${uniqueName}.bootstrap.proxy${ext}`;

      const async = `
      Promise.all([import('${bootstrapproxyloc}'), import('${pageproxyloc}')])
        .then(([{ default: BOOTSTRAP_CODE }, { default: PAGE }]) => {
          if (PAGE && typeof BOOTSTRAP_CODE === 'function') BOOTSTRAP_CODE(PAGE);
        })
      `;

      fs.writeFileSync(entryProxyLoc, async);
      fs.writeFileSync(pageproxyloc, `export { default } from '${pagePath}'`);
      if (globalBootPath) fs.writeFileSync(bootstrapproxyloc, `export { default } from '${globalBootPath}'`);

      const pureName = `${path.dirname(page)}/${name}`;

      pagesConfig.push({
        entry: entryProxyLoc,
        entryName: pureName,
        filename: `${pureName}.js`,
        htmlFilename: `${pureName}.html`,
      });

    } else {
      const { src, boot: selfBoot, ...others } = page;
      const pagePath = projectRelative(src);

      const { name, dir, ext } = path.parse(pagePath);

      const uniqueName = `${dir.split(path.sep).join('-')}-${name}`;
      const entryProxyLoc = `${tmpPath}/${uniqueName}.entry.proxy${ext}`;
      const pageproxyloc = `${tmpPath}/${uniqueName}.page.proxy${ext}`;
      const bootstrapproxyloc = `${tmpPath}/${uniqueName}.bootstrap.proxy${ext}`;

      const async = `
      Promise.all([import('${bootstrapproxyloc}'), import('${pageproxyloc}')])
        .then(([{ default: BOOTSTRAP_CODE }, { default: PAGE }]) => {
          if (PAGE && typeof BOOTSTRAP_CODE === 'function') BOOTSTRAP_CODE(PAGE);
        })
      `;

      fs.writeFileSync(entryProxyLoc, async);
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
        }
      }
      const pureName = `${path.dirname(src)}/${name}`;

      pagesConfig.push({
        entry: entryProxyLoc,
        entryName: pureName,
        filename: `${pureName}.js`,
        htmlFilename: `${pureName}.html`,
        ...others,
      });
    }
  })
  return pagesConfig
}



export {
  PageInfo,
  CustomConfig,
  fileTree,
  getProjectPath,
  getCustomConfig,
  projectRelative,
  createSPAEntryProxy,
  createMPAEntryProxy,
};
