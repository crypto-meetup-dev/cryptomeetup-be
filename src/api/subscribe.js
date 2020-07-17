const KoaRouter = require('koa-router')

const { subscribe, subscribeAll, mineSubscribe, createSubscribe, dismissSubscribe, removeSubscribe, addSubscribe } = require('../controllers/subscribe')

let subscribeRouter = new KoaRouter()

subscribeRouter.get("/", subscribe)
subscribeRouter.get("/all", subscribeAll)
subscribeRouter.get("/mine", mineSubscribe)
subscribeRouter.get("/create", createSubscribe)
subscribeRouter.get("/dismiss", dismissSubscribe)
subscribeRouter.get("/add", addSubscribe)
subscribeRouter.get("/remove", removeSubscribe)

module.exports = subscribeRouter