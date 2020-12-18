import fs from 'fs';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { Signale } from 'signale';
import { IBuildConfig } from './Interface';
import getWebpackConfig from '../../config';


export default async function({ analyzer }: IBuildConfig) {
  const config = getWebpackConfig('prod');

  if (analyzer) {
    config?.plugins?.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    );
  }

  const barActive = new Signale({
    scope: 'bake-page',
    interactive: true,
    types: {
      process: {
        badge: '●',
        color: 'yellow',
        label: `build`,
      },
      success: {
        label: `build`,
      },
    },
  });
  barActive.process('正在打包页面...');
  webpack(config).run((e) => {
    if (e) {
      console.error(e);
      return;
    }
    barActive.success('页面打包完成!');
    console.log('finishd');
  });
}