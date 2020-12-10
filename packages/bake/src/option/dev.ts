import fs from 'fs';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import { getProjectPath } from '../conifg/utils';
import getWebpackConfig from '../conifg';
import { createConnectorConfig } from '../module/connector';

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
  config?.plugins?.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);
  const serverConfig = {
    contentBase: config.output.path,
    headers: {
      'access-control-allow-origin': '*'
    },
    host,
    sockPort: port,
    inline: true,
    hot: true,
    liveReload: false,
    writeToDisk: true,
    disableHostCheck: true,
    stats: {
      preset: 'minimal',
      entrypoints: true,
    },
    //@ts-ignore
    ...(config?.devServer || {})
  };

  createConnectorConfig(
    JSON.stringify({
      host,
      port,
    })
  );

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