# **cloud-cli**
一个无负担的前端云开发脚手架


目前云组件的实现基于 Webpack 5 的 module-federation
## **1. 安装(install)**
```
npm install -D cloud-cli
```
or
```
yarn add cloud-cli -D
```

## **2. 命令行(cli):**

### 2.1 新建模版
```
cloud init
```

### 2.2 开发
```
cloud dev
```

### 2.3 构建
```
cloud build
```


## **3. 配置文件(cloud.config.js)：**
查看目录下cloud.config.js文件

新版热替换  https://segmentfault.com/a/1190000023534941
### **3.1. 多页应用**
```
目录结构:
.
├── node_modules
├── package.json
├── pages
│   └── index
│       ├── index.tsx
│       ├── boot.tsx
│       └── index.html
└── cloud.config.js
```

**index.tsx**
```jsx
import React from 'react';
import './index.scss';

const Page = () => <div className="title">Hello, World!</div>;

export default Page;
```

**boot.tsx**
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

export default (Page) => {
  ReactDOM.render(<Page />, document.getElementById('app'))
};
```

**index.html**
```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <meta name="format-detection" content="telephone=no, email=no">
  <title>cloud</title>
</head>

<body>
  <div id="app"></div>
</body>

</html>
```

**cloud.config.js**
```js
module.exports = {
  pages: {
    '/': {
      html: 'pages/index/index.html',
      src: 'pages/index/index.tsx',
      boot: 'pages/index/boot.tsx',
    }
  }
};
```

```
http://localhost:3000

/ -> 200 OK
```

配置文件也可以写成这样: 

**cloud.config.js**
```js
module.exports = {
  src: {
    'home': 'pages/index/index.tsx',
  },
  pages: {
    '/': {
      src: 'home',
      boot: 'pages/index/boot.tsx',
      html: 'pages/index/index.html',
    }
  },
};
```
如果想添加一个 user 页面，可以这样写:

```js
module.exports = {
  src: {
    'home': 'pages/index/index.tsx',
    'user': 'pages/user/index.tsx'
  },
  pages: {
    '/': {
      src: 'home',
      boot: 'pages/index/boot.tsx',
      html: 'pages/index/index.html',
    },
    '/user': {
      src: 'user',
      boot: 'pages/index/boot.tsx',
      html: 'pages/index/index.html',
    }
  },
};
```

```
目录结构:
.
├── node_modules
├── package.json
├── pages
│   ├── index
│   │   ├── boot.tsx
│   │   ├── index.html
│   │   ├── index.scss
│   │   └── index.tsx
│   └── user
│       └── index.tsx
└── cloud.config.js
```

你可能注意到，user 页面使用了 index 中的 boot 和 html 文件，很自然的，配置可以简化为：

```js
module.exports = {
  src: {
    'home': 'pages/index/index.tsx',
    'user': 'pages/user/index.tsx'
  },
  boot: 'pages/index/boot.tsx', 
  html: 'pages/index/index.html',
  pages: {
    '/': {
      src: 'home',
    },
    '/user': {
      src: 'user',
    }
  },
};
```

甚至更简单:
```js
module.exports = {
  src: {
    'home': 'pages/index/index.tsx',
    'user': 'pages/user/index.tsx',
  },
  boot: 'pages/index/boot.tsx', 
  html: 'pages/index/index.html',
  pages: {
    '/': 'home',
    '/user': 'user'
  },
};
```
### **3.2. 单页应用**

继续上面的例子，如果需要在 MPA 和 SPA 之间转化，仅需要改动一个地方：boot内容，导出函数的入参由单个React组件，变为React组件数组，于是可以使用 React-Router 路由

**boot.tsx**
```jsx
import React from 'react';
import { render } from 'react-dom';
import loadable from '@loadable/component'
import {
  BrowserRouter,
  HashRouter,
  Switch,
  Route,
} from "react-router-dom";

export default (pages) => {
  const App = (
    <div>
     <BrowserRouter>
       <Switch>
         {pages.map(({ component, src, pathname, exact }) => {
           const P = loadable(component);
           return (
             <Route key={src} path={pathname} exact={exact}>
               <P />
             </Route>
           );
         })}
       </Switch>
     </BrowserRouter>
    </div>
  );
  render(App, document.getElementById('app'))
};
```
然后运行命令行:
```
cloud --type spa dev 
```

### **3.3. 云组件**

如果想在上面的例子中导出和导入云组件，可以这样：
```js
module.exports = {
  src: {
    'home': 'pages/index/index.tsx',
    'user': 'pages/user/index.tsx',
  },
  boot: 'pages/index/boot.tsx', 
  html: 'pages/index/index.html',
  pages: {
    '/': 'home',
    '/user': 'user'
  },
  cloud: {
    export: ['home', 'user'],
    import: {
      'component-a': 'https://cloud.com/component-a'
    }
  }
};
```
然后运行下面命令行, export字段中的组件就会存入云端
```
cloud build && cloud push
```