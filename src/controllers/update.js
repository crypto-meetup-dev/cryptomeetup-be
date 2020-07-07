// Local Package
let Log = require('../util/log')
let Store = require('../util/store')

const update = {
    async email(ctx, next) {
        let query = ctx.request.query
        query = JSON.parse(JSON.stringify(query))
        if (query.id === undefined) {
            ctx.status = 406
            ctx.body = "Invalid Request, Missing value on required field `id`"
            await next()
            return
        }
        if (query.email === undefined) {
            ctx.status = 406
            ctx.body = "Invalid Request, Missing value on required field `email`"
            await next()
            return
        }
        let UserProfile = await Store.user.find({ key: "UserProfile" })
        if (!query.email === UserProfile.email) {
            Store.user.update({ id: query.id }, { email: query.email })
            ctx.body = { message: "success" }
        }
        else {
            ctx.body = { message: "No need to modify" }
        }
        await next()
    },
    async avatar(ctx, next) {
        let query = ctx.request.query
        query = JSON.parse(JSON.stringify(query))
        if (query.id === undefined) {
            ctx.status = 406
            ctx.body = "Invalid Request, Missing value on required field `id`"
            await next()
            return
        }
        if (query.avatar === undefined) {
            ctx.status = 406
            ctx.body = "Invalid Request, Missing value on required field `avatar`"
            await next()
            return
        }
        let UserProfile = await Store.user.find({ key: "UserProfile" })
        if (!query.avatar === UserProfile.avatar) {
            Store.user.update({ id: query.id }, { avatar: query.avatar })
            ctx.body = { message: "success" }
        }
        else {
            ctx.body = { message: "No need to modify" }
        }
        await next()
    },
    async nickname(ctx, next) {
        let query = ctx.request.query
        query = JSON.parse(JSON.stringify(query))
        if (query.id === undefined) {
            ctx.status = 406
            ctx.body = "Invalid Request, Missing value on required field `id`"
            await next()
            return
        }
        if (query.nickname === undefined) {
            ctx.status = 406
            ctx.body = "Invalid Request, Missing value on required field `nickname`"
            await next()
            return
        }
        let UserProfile = await Store.user.find({ key: "UserProfile" })
        if (!query.nickname === UserProfile.nickname) {
            Store.user.update({ id: query.id }, { nickname: query.nickname })
            ctx.body = { message: "success" }
        }
        else {
            ctx.body = { message: "No need to modify" }
        }
        await next()
    }
}

module.exports = update