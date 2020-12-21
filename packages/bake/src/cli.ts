import { program } from 'commander';

import dev from './option/dev';
import build from './option/build';
import init from './option/init';

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
  .description('打包生产资源')
  .option('-p, --app <app>', '应用类型', 'spa')
  .option('-t, --target <lib>', '输出模块类型')
  .option('-d, --out-dir <path>', '输出目录', 'dist')
  .option('-a, --analyzer', '是否启用分析器')
  .action(build);

program.parse(process.argv);