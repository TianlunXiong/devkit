// import signale from 'signale';
// import { ICliConfig } from '../interface';
// import { CustomConfig } from '../config/utils';
// import rimraf from 'rimraf';
// import fs from 'fs';
// import child_process from 'child_process';

// export default async function (
//   { path = '', target = 'lib' }: ICliConfig,
//   { components }: CustomConfig,
// ) {
//   if (!components) {
//     console.error('请输入组件目录');
//     return;
//   }

//   const realDir = `${path}/${target}`;

//   if (fs.existsSync(realDir)) rimraf.sync(realDir);

//   const babel = require.resolve('@babel/cli/bin/babel');

//   const args = [
//     components,
//     '--extensions',
//     '.tsx',
//     '--config-file',
//     require.resolve(`../../config/babel/${target}`),
//   ];

//   args.push('--ignore', '**/*.md');
//   args.push('--copy-files');
//   args.push('--out-dir', realDir);

//   signale.pending('正在打包组件...');

//   const child = child_process.spawn(babel, args);

//   child.stdout.on('data', (d) => {
//     console.log(Buffer.from(d).toString('utf8'));
//   });

//   child.stderr.on('data', (e) => {
//     console.log(Buffer.from(e).toString('utf8'));
//   });

//   child.on('close', (code) => {
//     if (code === 0) {
//       signale.success('打包完成');
//       return;
//     }
//   });
// }
