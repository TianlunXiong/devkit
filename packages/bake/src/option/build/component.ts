import { Signale } from 'signale';
import { IBuildConfig } from './Interface';
import {  CustomConfig } from '../../config/utils';
import rimraf from 'rimraf';
import fs from 'fs';
import child_process from 'child_process';

export default async function({ outDir = 'dist', lib = 'cjs' }: IBuildConfig, { components }: CustomConfig) {

  if (!components) {
    throw new Error('请输入组件目录')
  }

  const realDir = `${outDir}/${lib}`;

  if (fs.existsSync(realDir)) rimraf.sync(realDir);

  const babel = require.resolve('@babel/cli/bin/babel');

  const args = [
    components,
    '--extensions',
    '.tsx',
    '--config-file',
    require.resolve(`../../config/babel/${lib}`),
  ];

  args.push('--ignore', '**/*.md')
  args.push('--copy-files');
  args.push('--out-dir', realDir);

  const barActive = new Signale({
    scope: 'bake-page',
    interactive: true,
    types: {
      process: {
        badge: '●',
        color: 'yellow',
        label: `build`,
      },
      success: {
        label: `build`,
      },
    },
  });
  barActive.process('正在打包组件...');

  const child = child_process.spawn(babel, args);

  child.stdout.on('data', (d) => {
    console.log(Buffer.from(d).toString('utf8'));
  })

  child.stderr.on('data', (e) => {
    console.log(Buffer.from(e).toString('utf8'));
  })

  child.on('close', (code) => {
    if (code === 0) {
      barActive.success('打包完成');
      return;
    }
  })
  
}