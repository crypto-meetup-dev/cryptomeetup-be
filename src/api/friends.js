const KoaRouter = require('koa-router')

const { friends, friendsUpdate } = require('../controllers/friends')

let friendsRouter = new KoaRouter()

friendsRouter.get("/", friends)
friendsRouter.get("/update", friendsUpdate)

module.exports = friendsRouter