// Depnedencies
const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const KoaRouter = require('koa-router')
const KoaStatic = require('koa-static')
const { userAgent } = require('koa-useragent')

// Local Packages
const Log = require('./src/util/log')

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

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(KoaStatic('./public'))
app.use(KoaStatic('./public/img'))

// Error Handling
app.on('error', (err, ctx) => {
    Log.fatal("Server Error: ", err, ctx)
})
app.listen(config.port, () => {
    console.log("listening on http://127.0.0.1:" + config.port)
})