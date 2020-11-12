import fs from 'fs';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { getProjectPath } from '../conifg/utils';
import getWebpackConfig from '../conifg';

export interface IDevelopmentConfig {
  mode?: 'native';
  host: string;
  port: number;
}

export default async function({ host, port }: IDevelopmentConfig) {
  const config = getWebpackConfig('dev');
  if (fs.existsSync(getProjectPath('tsconfig.json'))) {
    config?.plugins?.push(new ForkTsCheckerWebpackPlugin());
  }

  const compiler = webpack(config);
  const serverConfig = {
    publicPath: '/',
    noInfo: true,
    inline: true,
  };
  const devServer = new WebpackDevServer(compiler, serverConfig);
  devServer.listen(port, host, (err) => {
    if (err) {
      return console.error(err);
    }
    console.warn(`http://${host}:${port}\n`);
  });

  ['SIGINT', 'SIGTERM'].forEach((sig: any) => {
    process.on(sig, () => {
      devServer.close();
      process.exit();
    });
  });
}