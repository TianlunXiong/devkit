# 快速上手

## 安装

### 使用 npm 或 yarn 安装（推荐）

```bash
# npm
$ npm install @vikit/ui --save

# yarn
$ yarn add @vikit/ui
```

## 使用

### 通过 node_modules 引入

```js
import { Button, Cell } from '@vikit/ui';
import '@vikit/ui/dist/index.min.css';
```

### 通过 云组件 引入

```js
import { Button } from '@vikit/cloud/component'; // 加载js
```

### 定制主题

通过修改css变量定义达到定制主题的效果

```js
document.documentElement.style.setProperty('--theme-primary', '#108ee9');
```
