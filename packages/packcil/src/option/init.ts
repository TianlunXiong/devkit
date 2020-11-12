import fs from 'fs';
import path from 'path';
import { sync } from 'mkdirp';
import chalk from 'chalk';
import signale from 'signale';
import { getProjectPath } from '../conifg/utils';
import {
  AppTemplate,
  BootstrapTemplate,
  HtmlTemplate,
  WebpackTemplate,
  ScssTemplate,
} from '../template';

const wirte = (dir: string, code: string) => {
  fs.writeSync(fs.openSync(dir, 'w'), code);
};


export default async function () {
  const pwd = getProjectPath();

  const folders = {
    src: [
      {
        name: 'bootstrap.tsx',
        code: BootstrapTemplate,
      },
      {
        name: 'app.tsx',
        code: AppTemplate,
      },
      {
        name: 'app.scss',
        code: ScssTemplate,
      },
      {
        name: 'index.html',
        code: HtmlTemplate,
      },
    ],
  };


  const configFileName = 'wp5.config.js';
  wirte(path.resolve(pwd, configFileName), WebpackTemplate());

  Object.keys(folders).forEach((key) => {
    sync(key);
    folders[key].forEach((file) => {
      wirte(path.resolve(pwd, key, file.name), file.code());
      console.info(`   ${chalk.green('create')} ${key}/${file.name}`);
    });
  });

  signale.success('模版初始化成功');
}
