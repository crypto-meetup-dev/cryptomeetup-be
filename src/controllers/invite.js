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

    let user = await Store.user.findOne({ key: "UserProfile", id: query.id })
    let res = await Store.user.findOne({ key: "NotifyProfile", id: query.id })
    let notifyId = res.notifications.length + 1
    let notifyObject = {
        notifyGlobalId: Hash.sha256(notifyId + "").substring(0,8),
        notifyId: notifyId,
        userId: query.id,
        title: user.nickname + "希望和你共享 TA 的地图信息",
        body: user.nickname + "希望和你共享 TA 的地图信息（这并不会暴露你的地图信息），要接受吗？",
        accepted: false
    }
    
    await Store.main.insert({ key: "Notify" }, { $push: notifyObject})
    await Store.user.update({ key: "NotifyProfile", id: query.id }, { $push: { notifications: notifyObject } }, {})

    ctx.body = notifyObject
}

let inviteUpdate = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    ctx.body = query
}

module.exports = {
    invite,
    inviteUpdate
}