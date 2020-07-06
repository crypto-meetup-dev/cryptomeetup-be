// Depnedencies
const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const KoaRouter = require('koa-router')
const KoaStatic = require('koa-static')
const { userAgent } = require('koa-useragent')

// Local Packages
const Log = require('./src/util/log')
const routers = require('./src/route/router')
const config = require('./config.json')

const app = new Koa()
app.proxy = true
app.use(userAgent)
// to Log
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    Log.info(`${ctx.request.ips} ${ctx.method} ${ctx.url} - ${rt}`);
});

let test = new KoaRouter()

test.get('/ping', async (ctx, next) => {
    ctx.body = "pong!"
    await next()
})
// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(test.routes()).use(test.allowedMethods())
app.use(routers.routes()).use(routers.allowedMethods())

app.use(KoaStatic("./public"))

// Error Handling
app.on('error', (err, ctx) => {
    Log.fatal("Server Error: ", err, ctx)
})
app.listen(config.port, () => {
    console.log("listening on http://127.0.0.1:" + config.port)
})