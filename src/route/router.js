const KoaRouter = require('koa-router')

let routers = new KoaRouter()

let user = require('../api/user')
let inviteRouter = require('../api/invite')
let notification = require('../api/notification')

routers.use("/user", user.routes(), user.allowedMethods())
routers.use("/invite", inviteRouter.routes(), inviteRouter.allowedMethods())
routers.use("/notification", notification.routes(), notification.allowedMethods())

module.exports = routers