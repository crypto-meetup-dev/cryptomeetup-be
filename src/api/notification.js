const KoaRouter = require('koa-router')

const { notifyUpdate, notifyNew, notifyObject, notifyPush } = require('../controllers/notification')

let notificationRouter = new KoaRouter()

notificationRouter.get("/update", notifyUpdate)
notificationRouter.get("/push", notifyPush)
notificationRouter.get("/new", notifyNew)
notificationRouter.get("/:notifyId", notifyObject)

module.exports = notificationRouter