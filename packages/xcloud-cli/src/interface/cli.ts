import { App } from '../config/utils'

export interface ICliConfig {
  app?: App,
  target?: 'es' | 'lib',
  host?: string,
  port?: string,
  publicPath?: string,
  lib?: string,
  path?: string,
  cloud?: string,
}