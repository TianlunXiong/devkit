import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import { XCloudConfig, PkgConfig } from '../interface'

export const PKG_NAME = '@vikit/xcloud-cli';
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

// 获取项目文件
const getCustomConfig = (configFileName = CONFIG_NAME): XCloudConfig => {
  const configPath = path.join(process.cwd(), configFileName);
  if (fs.existsSync(configPath)) {
    return require(configPath);
  }
  throw new Error('no config file')
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

function pkgNameToNormalPkgName(pkgName: string) {
  return pkgName.replace(/^@/, '').replace(/\//, '__')
}


export {
  fileTree,
  pkgNameToNormalPkgName,
  getProjectPath,
  getCustomConfig,
  getPackageConfig,
  projectRelative,
};
