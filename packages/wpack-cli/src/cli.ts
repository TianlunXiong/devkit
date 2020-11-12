import { program } from 'commander';

import dev from './option/dev';
import prod from './option/prod';
import init from './option/init';
import pkg from '../package.json';

program.version(String(pkg.version));

program
  .command('init')
  .description('初始模版')
  .action(init);

program
  .command('dev')
  .description('运行开发环境')
  .option('-m, --mode <mode>', '编译模式')
  .option('-h, --host <host>', '站点主机地址', '0.0.0.0')
  .option('-p, --port <port>', '站点端口号', '3000')
  .action(dev);

program
  .command('build')
  .description('打包静态资源')
  .option('-d, --out-dir <path>', '输出目录', 'dist')
  .option('-a, --analyzer', '是否启用分析器')
  .action(prod);

program.parse(process.argv);