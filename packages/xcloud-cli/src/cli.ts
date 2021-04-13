import { program } from 'commander';

import init from './option/init';
import dev from './option/dev';
import build from './option/build';
import commit from './option/commit';

program
  .command('init')
  .description('初始模版')
  .action(init);

program
  .command('dev')
  .description('运行开发环境')
  .option('-h, --host [host]', 'webpack.devServer.host', '0.0.0.0')
  .option('-p, --port [port]', 'webpack.devServer.port', '3000')
  .option('-o, --path [path]', '输出目录', 'dist')
  .option('-u, --publicPath [publicPath]', 'webpack.publicPath', 'auto')
  .action(dev);

program
  .command('build')
  .description('打包生产资源')
  .option('-a, --app [app]', '应用类型', 'spa')
  .option('-t, --target [target]', '组件模块类型')
  .option('-o, --path [path]', '输出目录', 'dist')
  .option('-u, --publicPath [publicPath]', 'webpack.publicPath', 'auto')
  .option('-c, --cloud [cloud]', '云组件类型')
  .action(build);

program
  .command('commit')
  .description('提交 xcloud 组件')
  .option('--id [id]', '组件id')
  .action(commit)
  

program.parse(process.argv);