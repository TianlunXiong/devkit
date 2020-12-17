# 快速上手

## 安装

### 使用 npm 或 yarn 安装（推荐）

```bash
# npm
$ npm install m5 --save

# yarn
$ yarn add m5
```

### 或者通过 link 和 script 标签分别引入样式文件和js脚本文件（不推荐）

```html
<link rel="stylesheet" href="https://unpkg.com/m5/dist/m5.min.css">
<script type="text/javascript" src="https://unpkg.com/m5/dist/m5.min.js"></script>
```

## 使用

### 全组件引入

```js
import { Button, Cell } from 'm5';
import 'm5/dist/m5.min.css';
```

### 按需加载

> 注意：m5 默认支持基于 ES module 的 tree shaking，不使用以下插件也会有按需加载的效果。

- 使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 自动加载Sass文件（推荐）

```js
// .babelrc or babel-loader option
{
  "plugins": [
    ['import', {
      libraryName: 'm5',
      style: true, // or 'css'
    }],
  ]
}
```

```js
import { Button, Cell } from 'm5';
```

- 手动引入

```js
import { Button } from 'm5'; // 加载js
import 'm5/dist/m5.min.css'; // 加载css
```

### 定制主题

通过修改css变量定义达到定制主题的效果

```js
document.documentElement.style.setProperty('--theme-primary', '#108ee9');
```

变量名可参考 [default.scss](https://github.com/ZhongAnTech/m5/blob/master/components/style/themes/default.scss)
