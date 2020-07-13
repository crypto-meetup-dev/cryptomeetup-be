// Depnedencies
const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const KoaRouter = require('koa-router')
const KoaStatic = require('koa-static')
const { userAgent } = require('koa-useragent')

// Local Packages
const Log = require('./src/util/log')
const Store = require('./src/store/store')
const routers = require('./src/route/router')
const Global = require('./src/util/global')
const config = require('./config.json')
const { resolve } = require('path')

const app = new Koa()
app.proxy = true
app.use(userAgent)

// Init
let initNotifyArray = () => {
    return new Promise((resolve, reject) => {
        Store.mainDb.find({ key: "Notify" }, (err, doc) => {
            if (err) Log.fatal(err)
            if (doc.length === 0) {
                Log.info("First run, init database for notifications")
                Store.main.insert({ key: "Notify", notifications: new Array })
            }
        })
    })
}
// init users array
let initUserArray = () => {
    return new Promise((resolve, reject) => {
        Store.userDb.find({ key: "UserList" }, (err, doc) => {
            if (err) Log.fatal(err)
            if (doc.length === 0) {
                Log.info("First run, init database for users")
                Store.user.insert({ key: "UserList", users: new Array() })
            }
            resolve(true)
        })
    })
}
initUserArray()
initNotifyArray()
Global.Add('config', config)

// to Log
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    Log.info(`${ctx.request.ips} ${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", ctx.headers.origin);
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set("Access-Control-Request-Method", "PUT,POST,GET,DELETE,OPTIONS");
    ctx.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, cc"
    );
    if (ctx.method === "OPTIONS") {
        ctx.status = 204;
        return;
    }
    await next();
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

// Merge all routes
app.use(test.routes()).use(test.allowedMethods())
app.use(routers.routes()).use(routers.allowedMethods())

// Serve static file
app.use(KoaStatic("./public"))
app.use(KoaStatic("./data"))

// Error Handling
app.on('error', (err, ctx) => {
    Log.fatal("Server Error: " + err + JSON.stringify(ctx))
})
app.listen(config.port, () => {
    Log.info("listening on http://127.0.0.1:" + config.port)
})