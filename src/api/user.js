// Dependencies
const KoaRouter = require('koa-router')

let user = new KoaRouter()

user.get("/info", async (ctx, next) => {
    ctx.body = {data: "userinfo"}
})

module.exports = user