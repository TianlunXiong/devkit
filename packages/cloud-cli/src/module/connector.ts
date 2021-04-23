/**
 * @description 桥接 Node BFF 层 和 webpack-dev-server 的中间件
 */

import proxy from 'koa-http2-proxy';
import path from 'path';
import fs from 'fs';
import { PKG_NAME } from '../config/utils';

export default (config = {}) => {
  const content = findConnectorConfig();
  if (content === null) {
    console.error(('找不到 Connector 配置文件，请先启动 webpack-dev-server'))
    // @ts-ignore
    return async (ctx, next) => { await next() }
  }

  const { host, port } = content;

  return proxy({
    target: `http://${host}:${port}`,
    ws: true,
    ...config,
  })
}

export function createConnectorConfig(content = '') {
  const tmpPath = path.join(path.dirname(require.resolve(PKG_NAME)), '../tmp');
  fs.writeFile(`${tmpPath}/connector.json`, content, () => {
    // 写入完成
  })
}

export function findConnectorConfig() {
  const tmpPath = path.join(path.dirname(require.resolve(PKG_NAME)), '../tmp');
  if (fs.existsSync(`${tmpPath}/connector.json`)) {
    return require(`${tmpPath}/connector.json`);
  }
  return null;
}