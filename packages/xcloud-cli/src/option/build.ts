import { Cli } from '../type';
import webpack, { Configuration } from 'webpack';
import signale from 'signale';
import rimraf from 'rimraf';
import getWebpackConfig from '../config';

export default async function(cliConfig: Cli) {
  const config = getWebpackConfig('prod', cliConfig);
  await webpackBuilding(config);
}

async function webpackBuilding(config: Configuration): Promise<ResponseBody> {
  signale.pending('正在打包应用...');
  rimraf.sync(config?.output?.path);
  const rsl = await new Promise<ResponseBody>((resolve, reject) => {
    webpack(config).run(e => {
      if (e) {
        console.error(e);
        reject({
          success: false,
          message: e.message,
        });
        return;
      }
      signale.success('应用打包完成!');
      resolve({
        success: true,
      });
    });
  });

  return rsl;
}

interface ResponseBody {
  success: boolean;
  message?: string;
}