import { program } from 'commander';

import init from './option/init';
import dev from './option/dev';
import build from './option/build';
import lib from './option/lib';
// import commit from './option/commit';

program
  .command('init')
  .description('初始模版')
  .action(init);

program
  .command('dev')
  .description('运行开发环境')
  .option('-t, --type [type]', '应用类型', 'mpa')
  .option('-h, --host [host]', 'webpack.devServer.host', '0.0.0.0')
  .option('-p, --port [port]', 'webpack.devServer.port', '3000')
  .option('-o, --path [path]', '输出目录', 'dist')
  .option('-u, --publicPath [publicPath]', 'webpack.publicPath', 'auto')
  .action(dev);

program
  .command('build')
  .description('打包生产资源')
  .option('-t, --type [type]', '应用类型', 'mpa')
  .option('-o, --path [path]', '输出目录', 'dist')
  .option('-u, --publicPath [publicPath]', 'webpack.publicPath', 'auto')
  .action(build);

program
  .command('lib')
  .description('打包库')
  .option('-d, --dir [dir]', '输入目录', 'src')
  .option('-o, --out [out]', '输出目录', 'lib')
  .option('-t, --target [target]', '输出模块类型', 'cjs')
  .action(lib)
  

program.parse(process.argv);