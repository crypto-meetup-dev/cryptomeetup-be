const KoaRouter = require('koa-router')

const { notifyUpdate, notifyNew, notifyObject } = require('../controllers/notification')

let notificationRouter = new KoaRouter()

notificationRouter.get("/update", notifyUpdate)
notificationRouter.get("/new", notifyNew)
notificationRouter.get("/:notifyId", notifyObject)

module.exports = notificationRouter