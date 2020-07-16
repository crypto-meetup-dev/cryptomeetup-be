const KoaRouter = require('koa-router')

let routers = new KoaRouter()

let user = require('../api/user')
let inviteRouter = require('../api/invite')
let friendsRouter = require('../api/friends')
let notification = require('../api/notification')
let subscribeRouter = require('../api/subscribe')

routers.use("/user", user.routes(), user.allowedMethods())
routers.use("/invite", inviteRouter.routes(), inviteRouter.allowedMethods())
routers.use("/subscribe", subscribeRouter.routes(), subscribeRouter.allowedMethods())
routers.use("/friends", friendsRouter.routes(), friendsRouter.allowedMethods())
routers.use("/notification", notification.routes(), notification.allowedMethods())

module.exports = routers