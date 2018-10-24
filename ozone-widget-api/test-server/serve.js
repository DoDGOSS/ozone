const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');

const app = new Koa();
app.use(serve("test-server"));
app.use(mount("/js", serve("dist")));

app.listen(3001);
console.log("Listening on port 3001");
console.log("Container test page: http://127.0.0.1:3001/container.html");
