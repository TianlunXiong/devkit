import fs from 'fs';
import path from 'path';
import { sync } from 'mkdirp';
import chalk from 'chalk';
import signale from 'signale';
import { exec } from 'child_process';
import { getProjectPath, CONFIG_NAME } from '../config/utils';
import {
  PageTemplate,
  BootstrapTemplate,
  WebpackTemplate,
  ScssTemplate,
} from '../template';

const wirte = (dir: string, code: string) => {
  fs.writeSync(fs.openSync(dir, 'w'), code);
};


export default async function () {
  const pwd = getProjectPath();

  const folders = {
    'pages/index': [
      {
        name: 'boot.tsx',
        code: BootstrapTemplate,
      },
      {
        name: 'index.tsx',
        code: PageTemplate,
      },
      {
        name: 'index.scss',
        code: ScssTemplate,
      },
    ],
  };

  // 生产 xcloud.config.js
  wirte(path.resolve(pwd, CONFIG_NAME), WebpackTemplate());

  // 创建 pages 文件夹，并写入页面
  Object.keys(folders).forEach((key) => {
    sync(key);
    folders[key].forEach((file) => {
      wirte(path.join(pwd, key, file.name), file.code());
      console.info(`   ${chalk.green('create')} ${key}/${file.name}`);
    });
  });
  signale.success('模版初始化成功');
  signale.pending('安装 react react-dom react-router-dom @loadable/component\n');
  exec('yarn add react react-dom react-router-dom @loadable/component', (err) => {
    if (err) {
      signale.error(err);
      return;
    }
    signale.success('React安装完成')
  }).stdout.on('data', (d) => {
    console.log(d)
  })
}
