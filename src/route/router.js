const KoaRouter = require('koa-router')

let routers = new KoaRouter()

let user = require('../api/user')

routers.use("/user", user.routes(), user.allowedMethods())

module.exports = routers