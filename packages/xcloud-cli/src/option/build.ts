import { ICliConfig } from '../interface/cli';
import { getCustomConfig } from '../config/utils';
import buildPage from './build/page';
import buildComponent from './build/component';

export default async function(config: ICliConfig) {
  const { app: argAppType } = config;
  const customConfig = getCustomConfig();
  const { app: configFileAppType } = customConfig;

  const app = argAppType || configFileAppType;

  if (!app) throw new Error('请设置 app');

  if (app === 'spa' || app === 'mpa') {
    buildPage(config);
  }

  if (app === 'component') {
    buildComponent(config, customConfig);
  }
}