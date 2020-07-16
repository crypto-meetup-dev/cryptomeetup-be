const KoaRouter = require('koa-router')

const { subscribe, subscribeAll, mineSubscribe, createSubscribe, dismissSubscribe, removeSubscribe } = require('../controllers/subscribe')

let subscribeRouter = new KoaRouter()

subscribeRouter.get("/", subscribe)
subscribeRouter.get("/all", subscribeAll)
subscribeRouter.get("/mine", mineSubscribe)
subscribeRouter.get("/create", createSubscribe)
subscribeRouter.get("/remove", removeSubscribe)
subscribeRouter.get("/dismiss", dismissSubscribe)

module.exports = subscribeRouter