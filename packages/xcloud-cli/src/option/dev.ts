import fs from 'fs';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { getProjectPath } from '../config/utils';
import getWebpackConfig from '../config';
import { createConnectorConfig } from '../module/connector';
import { Cli } from '../type';

const PORT = 3000;
const HOST = '0.0.0.0';
const HOT = true;

export default async function(cliConfig: Cli) {
  const { port = PORT, host = HOST } = cliConfig;
  const config = getWebpackConfig('dev', cliConfig);
  if (fs.existsSync(getProjectPath('tsconfig.json'))) {
    config?.plugins?.push(new ForkTsCheckerWebpackPlugin());
  }

  if (HOT) {
    config?.plugins?.push(new webpack.HotModuleReplacementPlugin());
  }

  const compiler = webpack(config);
  const serverConfig = {
    contentBase: config.output.path,
    headers: {
      'access-control-allow-origin': '*'
    },
    host,
    sockPort: port,
    inline: true,
    hot: HOT,
    liveReload: !HOT,
    writeToDisk: true,
    disableHostCheck: true,
    historyApiFallback: true,
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