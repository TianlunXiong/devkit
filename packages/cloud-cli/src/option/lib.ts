import signale from 'signale';
import { Cli } from '../type';
import { projectRelative } from '../config/utils';
import rimraf from 'rimraf';
import fs from 'fs';
import child_process from 'child_process';

export default async function ({ dir = 'src', out = 'lib', target = 'cjs'}: Cli) {

  const srcDir = projectRelative(dir);
  const targetDir = projectRelative(out);

  if (!fs.existsSync(srcDir)) {
    signale.error('源代码目录不存在');
    return
  }

  if (fs.existsSync(targetDir)) rimraf.sync(targetDir);

  const babel = require.resolve('@babel/cli/bin/babel');

  const args = [
    srcDir,
    '--extensions',
    '.tsx',
    '--config-file',
    require.resolve(`../config/babel/${target}`),
  ];

  args.push('--ignore', '**/*.md');
  args.push('--copy-files');
  args.push('--out-dir', targetDir);

  signale.pending('正在打包组件...');

  const child = child_process.spawn(babel, args);

  child.stdout.on('data', (d) => {
    console.log(Buffer.from(d).toString('utf8'));
  });

  child.stderr.on('data', (e) => {
    console.log(Buffer.from(e).toString('utf8'));
  });

  child.on('close', (code) => {
    if (code === 0) {
      signale.success('打包完成');
      return;
    }
  });
}
