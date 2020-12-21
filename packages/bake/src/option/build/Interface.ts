import { App } from '../../config/utils'

export interface IBuildConfig {
  app: App,
  outDir: string;
  analyzer: boolean;
  target: 'es' | 'lib'
}