import path from 'path';
import fs from 'fs';
import VirtualModulesPlugin from 'webpack-virtual-modules';

const virtualModules = new VirtualModulesPlugin();

const PLUGINID = 'InitializeEntryPlugin';

interface BunchOf<T> {
  [key: string]: T;
}

export const toArray = <T>(value: T | Array<T>): Array<T> =>
  value ? (Array.isArray(value) ? value : [value]) : [];

module.exports = class InitializeEntryPlugin {
  context?: string;
  initEntries: string[];
  definedFiles: BunchOf<string>;
  importPassTo = {} as BunchOf<string>;
  entryPoints = {} as BunchOf<string>;
  test?: string;

  constructor(options: any) {
    const { insert } = options;

    if (insert) this.initEntries = toArray(insert);
    else
      throw new Error(
        'This plugin needs an initializer { insert } in options to include!',
      );

    this.test = options.test;
    this.definedFiles = options.define || {};
  }

  loadInitializerReplacements() {
    const context = this.context!;

    for (const insertable of this.initEntries) {
      if (this.definedFiles[insertable]) return;

      const initFile = path.resolve(context, insertable);

      if (!fs.existsSync(initFile))
        throw new Error(`Initializer ${insertable} not found in ${context}!`);

      if (!fs.lstatSync(initFile).isFile())
        throw new Error(`Initializer ${initFile} found but is not a file!`);

      this.definedFiles[insertable] = fs.readFileSync(initFile, 'utf-8');
    }
  }

  apply(compiler: any) {

    virtualModules.apply(compiler);

    // 保存原来的入口文件
    compiler.hooks.entryOption.tap(
      PLUGINID,
      (context: string, entries: any) => {
        this.context = context;
        this.loadInitializerReplacements();

        if (typeof entries !== 'object' || Array.isArray(entries))
          entries = { main: entries };

        for (const x in entries) {
          const { import: e } = entries[x];

          this.entryPoints[x] =
            typeof e == 'string'
              ? e
              : Array.isArray(e)
              ? e[e.length - 1]
              : false;
        }
      },
    );

    //gain access to module construction
    compiler.hooks.normalModuleFactory.tap(PLUGINID, (compilation: any) => {
      //when a module is requested, but before webpack looks for it in filesystem
      compilation.hooks.beforeResolve.tap(PLUGINID, (result: any) => {
        const target = result.dependencies[0];

        // 入口文件
        if (target.type == 'entry') {
          let { loc } = target;
          
          // if(!loc) return result;

          const name =
            typeof loc == 'string' ? loc.slice(0, loc.indexOf(':')) : loc.name;

          const replacableEntry = this.entryPoints[name];

          if (result.request == replacableEntry) {

            // 将入口文件名改为 [name].intermediate.js
            const initModule = replacableEntry.replace(
              /\.js$/,
              '.intermediate.js',
            );
            const initPath = path.resolve(this.context!, initModule);

            // 将入口文件内容修改为 insert 的新内容
            const initContent = this.definedFiles[this.initEntries[0]]!;

            // 写入虚拟地址
            virtualModules.writeModule(initPath, initContent);

            // 修改入口
            result.request = initPath;

            // 建立 修改后的入口 与 原入口 的映射
            this.importPassTo[initPath] = path.resolve(
              this.context!,
              replacableEntry,
            );
          }
        } else if (result.request == '__webpack_entry__') {
          const requestedBy = result.contextInfo.issuer;
          const targetEntry = this.importPassTo[requestedBy];

          if (!targetEntry)
            throw new Error(
              `Module '__webpack_entry__' was requested by ${requestedBy} but that module is not an initializer!`,
            );

          result.request = targetEntry;
        }

        // return result;
      });
    });
  }
};
