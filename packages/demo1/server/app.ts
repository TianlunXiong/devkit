import App from 'nestin';
// import proxy from 'koa-proxy'
var proxy = require('koa-http2-proxy');

const app = new App();

app.use(
  proxy({
    target: 'http://0.0.0.0:3000',
    ws: true,
  })
)

app.listen(9000, () => {
  app.cycleLog();
})