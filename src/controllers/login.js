// Local Package
let Log = require('../util/log')
let Store = require('../store/store')
let getCircleAvatar = require('../util/getCirccleAvatar')

const login = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    // Error Handling
    if (query.id === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }
    if (query.email === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `email`" }
        await next()
        return
    }
    if (query.nickname === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `nickname`" }
        await next()
        return
    }
    if (query.avatar === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `avatar`" }
        await next()
        return
    }

    // Login User Data
    let isFirst = await Store.user.isFirst(query.id)
    if (isFirst) {
        await Store.user.update({ key: "UserList" }, { $addToSet: { users: query.id } }, {})
        await Store.user.insert({ key: "UserProfile", id: query.id, email: query.email, nickname: query.nickname, avatar: query.avatar, status: false, lng: 0, lat: 0 })
        await Store.user.insert({ key: "NotifyProfile", id: query.id, notifications: [] })
        await Store.user.insert({ key: "FriendsProfile", id: query.id, users: [] })
        Log.debug("New user " + query.nickname + " logged in, user data written into database.")
        ctx.body = { message: "Welcome! New user " + query.nickname }
        await getCircleAvatar(query.id, query.avatar)
    }
    else {
        ctx.body = { message: "Welcome back! " + query.nickname }
        Log.debug('Existing user ' + query.nickname + ' logged in.')
    }
    await next()
}

module.exports = login