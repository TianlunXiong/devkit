# 依赖异步化 babel 插件

## 1. 动机

在利用 webpack 开发多页应用时，每个独立的页面都需要一些的启动代码( bootstrap code )，比如：
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import PageA from '@page/a';

ReactDOM.render(<PageA />, document.getElementById('app'))

```

以前的方法是利用一些方法比如（修饰器，模块依赖）将启动代码注入，比如：
```tsx
import React from 'react';
import { Page } from '@yourlib'

@Page
class Home extends React.Component { 
  /**
   *  your code here...
   */
}

```

 实际上这种方法并未从底层解耦复杂性，只是一种添加依赖的"快捷方式"，修饰器必须配合优秀的底层架构一起使用，否则会增加系统复杂度，并降低代码可读性。
 
 上面例子的问题在于，组件 Home 与 @Page 是强依赖关系，即没有 @Page 的话，前端页面跑不起来，影响了整个系统。实际上多页面项目的分离点就是页面，引入 @Page 后 ，将分离点又聚合在一起，代码侵入了各个分离的页面。简单说问题就是， @Page 和 Home 在功能上应该是垂直的，而代码却是耦合的。

 实际上，我还未阅读 Taro 的代码，但是，从Taro的项目结构看，除开必要项目设置（如config文件夹），开发多页面仅需要填入一个包含页面路径的数组(app.config.ts)，这跟微信小程序一致。
 
回顾我之前开发的项目目录，多入口/页面的项目一般就是自动检索某个文件夹，然后找到一些文件作为 webpack 入口，然后像上面那样注入启动代码。但是这种自动化是牺牲项目质量的，比如我要迁移某个页面，那么页面就会因为启动代码不同而出现问题，或者我要改变目录结构，那么检索某个入口文件就会出问题。

从这点看，像微信小程序那样，声明式的配置页面更精简，更稳定。因为页面的工作就是，Data ---> Component ---> Render ---> UI

## 2. 功能

不侵入页面文件的代码，并且保证启动代码的无感注入（切入）是这个插件的主要功能。

插件会收集 页面模块 和 启动代码模块的依赖，并动态加载依赖，最后合并成一个文件，将上面的例子转换后就是：
```tsx

Promise([import('react')])
  .then(async ([m0]) => {
    const React = module.default;

    class Home extends React.Component { 
       /**
        *  your code here...
        */
    }

    await Promise([import('react'), import('react-dom')]) // 别担心 react 重复加载，webpack帮我们处理好了
      .then(([m0, m1]) => {
        const React = m0.default;
        const ReactDOM = m1.default;
        ReactDOM.render(<Home />, document.getElementById('app'))
      })
  })

```