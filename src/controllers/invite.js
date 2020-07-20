// Local Packages
const Log = require('../util/log')
const Store = require('../store/store')
const Hash = require('../util/hash')

// /invite endpoint
let invite = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))

    if (query.id === undefined) {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }
    if (query.email === undefined) {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `email`" }
        await next()
        return
    }

    let src = await Store.user.findOne({ key: "UserProfile", id: query.id })
    let user = await Store.user.findOne({ key: "UserProfile", email: query.email })
    if (user === null) {
        ctx.body = { status: 'failed', message: 'No sepecified user found' }
        await next()
        return
    }
    let res = await Store.user.findOne({ key: "NotifyProfile", id: user.id })
    let notifyId = res.notifications.length + 1
    let notifyObject = {
        notifyGlobalId: Hash.sha256(notifyId + "").substring(0,8),
        notifyId: notifyId,
        userId: src.id,
        title: src.nickname,
        body: src.nickname + "希望和你共享 TA 的地图信息（这并不会暴露你的地图信息），要接受吗？",
        proceed: false
    }

    await Store.main.insert({ key: "Notify" }, { $push: notifyObject })
    await Store.user.update({ key: "NotifyProfile", id: user.id }, { $push: { notifications: notifyObject } }, {})

    ctx.body = notifyObject
    await next()
}

let inviteUpdate = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    ctx.body = query

    if (query.id === undefined) {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }
    if (query.result === undefined) {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `result`" }
        await next()
        return
    }
    if (query.notifyId === undefined) {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `notifyId`" }
        await next()
        return
    }
    if (query.inviteUser === undefined) {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `inviteUser`" }
        await next()
        return
    }

    switch(query.result) {
        case "accept":
            accept(query)
        case "deny":
            deny(query)
    }

    ctx.body = { message: "success" }
}

async function accept(query) {
    await Store.user.update({ key: "FriendsProfile", id: query.id }, { $addToSet: { users: query.inviteUser } }, {})
    let res = await Store.user.findOne({ key: "NotifyProfile", id: query.id })
    let notifications = res.notifications.filter(e => e.notifyId !== parseInt(query.notifyId))
    await Store.user.update({ key: "NotifyProfile", id: query.id }, { $set: { notifications: notifications }}, {})
}

async function deny(query) {
    let res = await Store.user.findOne({ key: "NotifyProfile", id: query.id })
    let notifications = res.notifications.filter(e => e.notifyId !== parseInt(query.notifyId))
    await Store.user.update({ key: "NotifyProfile", id: query.id }, { $set: { notifications: notifications }}, {})
}

module.exports = {
    invite,
    inviteUpdate
}