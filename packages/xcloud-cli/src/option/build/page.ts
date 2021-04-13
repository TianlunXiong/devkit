import webpack, { Configuration } from 'webpack';
import signale from 'signale';
import rimraf from 'rimraf';
import getWebpackConfig from '../../config';
import { ICliConfig } from '../../interface/cli';

export default async function(cliConfig: ICliConfig) {
  const { config } = getWebpackConfig('prod', cliConfig);
  await webpackBuilding(config);
}

interface ResponseBody<T> {
  success: boolean;
  data?: T;
  message?: string;
}

type ProcessResponse = ResponseBody<never>;

async function webpackBuilding(config: Configuration): Promise<ProcessResponse> {
  signale.pending('正在打包应用...');
  rimraf.sync(config?.output?.path);
  const rsl = await new Promise<ProcessResponse>((resolve, reject) => {
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
