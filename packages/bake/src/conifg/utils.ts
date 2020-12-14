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

interface CustomConfig extends Configuration {
  app: string,
  pages: string[];
  boot?: string,
  html: string,
  css?: string,
  // moduleFederation?: ConstructorParameters<typeof ModuleFederationPlugin>[0]
}

// 获取项目文件
const getCustomConfig = (configFileName = 'bake.config.js'): Partial<CustomConfig> => {
  console.log(process.cwd())
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

const createEntryProxy = (pageInfo: PageInfo[]) => {
  const proxyEntry: { name: string, loc: string }[] = [];

  const tmpPath = path.join(path.dirname(require.resolve('@vikit/bake')), '../tmp');
  if (fs.existsSync(tmpPath)) rimraf.sync(tmpPath);
  fs.mkdirSync(tmpPath);

  pageInfo.forEach(({ name, loc, ext, boot }) => {
    const entryProxyLoc = `${tmpPath}/${name}.entry.proxy.${ext}`;
    const pageproxyloc = `${tmpPath}/${name}.page.proxy.${ext}`;
    const bootstrapproxyloc = `${tmpPath}/${name}.bootstrap.proxy.${ext}`;
    const eager = `// 代理入口
    import PAGE from '${pageproxyloc}';
${ boot ? `
import BOOTSTRAP_CODE from '${bootstrapproxyloc}';
if (PAGE && typeof BOOTSTRAP_CODE === 'function') BOOTSTRAP_CODE(PAGE);
` : '// 无启动代码'}
    `;
    const async = `
      Promise.all([import('${bootstrapproxyloc}'), import('${pageproxyloc}')])
      .then(([{ default: BOOTSTRAP_CODE }, { default: PAGE }]) => {
        if (PAGE && typeof BOOTSTRAP_CODE === 'function') BOOTSTRAP_CODE(PAGE);
      })
    `
    fs.writeFileSync(entryProxyLoc, async);
    fs.writeFileSync(pageproxyloc, `export { default } from '${loc}'`);
    if (boot) fs.writeFileSync(bootstrapproxyloc, `export { default } from '${boot}'`);
    proxyEntry.push({
      name,
      loc: entryProxyLoc,
    });
  })
  return proxyEntry;
}

export {
  fileTree,
  createEntryProxy,
  getProjectPath,
  CustomConfig,
  getCustomConfig,
  projectRelative,
  PageInfo,
};
