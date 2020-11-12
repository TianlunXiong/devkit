import fs from 'fs';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { Signale } from 'signale';
import { getProjectPath } from '../conifg/utils';
import getWebpackConfig from '../conifg';

export interface IBuildConfig {
  outDir: string;
  analyzer: boolean;
}

export default async function({ outDir, analyzer }: IBuildConfig) {
  const config = getWebpackConfig('prod');
  if (config.output) {
    config.output.path = getProjectPath(outDir);
  }

  if (analyzer) {
    config?.plugins?.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        generateStatsFile: true,
      }),
    );
  }

  const barActive = new Signale({
    scope: 'wmf',
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
  barActive.process('正在打包...');
  webpack(config).run((e) => {
    if (e) {
      console.error(e);
      return;
    }
    barActive.success('打包完成!');
    console.log('finishd');
  });
}