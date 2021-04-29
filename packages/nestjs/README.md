# **@vikit/nestjs**

## **简介(Introduction)**

基于Koa的依赖注入Web框架，可以看作轻量版的NestJS，可以作为学习利用Typescript实现依赖注入的案例，也可以作为魔改定制的基础Web框架。

A Dependency-Inject Framework Based On Koa. A Light Version Of The Well-Known Framework NestJS.

## **ToDo**
- [x] 控制器的基本修饰器（Controller、Get、Post等）
- [x] 控制器的依赖注入
- [x] 中间件的依赖注入
- [x] 请求/响应循环基本节点
- [ ] 请求/响应循环可视化监控系统
- [ ] 日志系统
- [ ] 测试用例
- [ ] 集成前端Webpack开发环境
- [ ] 集成ORM数据库管理系统

## **Install**

```
yarn add @vikit/nestjs
```

## **Usage**

The App is actually equivalent to Koa as well known. The related  APIs can be found in https://koajs.com or https://www.koajs.com.cn

### **1. Write a controller class**

```ts
// controller.hello.ts

import { Context, Next, Controller, Get } from '@vikit/nestjs';

@Controller('prefix')
class Hello {
  constructor(private inject: AllList) {}

  @Get()
  score(ctx: Context) {
    ctx.body = 'Hello World!';
  }

  @Get('api/:id')
  async student(ctx: Context) {
    const { id } = ctx.params
    ctx.body = `api, ${id}`;
  }
}

export { LikeMiddleWare, Xiaobai };

```
### 2. **Import the controller and run the server**

```ts
// index.ts

import App from '@vikit/nestjs';
import 'controller.hello.ts';

const app = new App(); // same as new Koa()
const PORT = 9001;

app.routes(); // resolve controllers and middlewares 
app.listen(PORT, () => console.log(`the server run on ${PORT}`));

```
然后运行开发环境：
```bash
npx tsnd index.ts
```

### 3. **To get http://localhost:9001 and http://localhost:9001/api/123**

```bash
HTTP 200 OK / "hello, world"
HTTP 200 OK /api/123 "api, 123"
```
