import { Type } from '../config/utils'

export interface ICliConfig {
  app?: Type,
  target?: 'es' | 'lib',
  host?: string,
  port?: string,
  publicPath?: string,
  lib?: string,
  path?: string,
  cloud?: string,
}

type BuildType = 'mpa' | 'spa' | 'cloud'
type CSSType = 'style' | 'link'

interface PageItem {
  html: string,
  src: string,
  boot: string,
  children?: Pages
}

interface Pages {
  [pathname: string]: PageItem
}

interface XCloudConfig {
  type?: BuildType,
  css?: CSSType,
  boot?: string,
  pages: Pages
}

export {
  XCloudConfig
}