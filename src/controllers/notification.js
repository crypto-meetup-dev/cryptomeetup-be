// Local Packages
const Log = require('../util/log')
const Store = require('../store/store')

// notification
let notifyUpdate = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    console.log(query)
    ctx.body = query
}

let notifyNew = async(ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    ctx.body = query
}

let notifyObject = async(ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    ctx.body = query
    
}

let notifyPush = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    
    if (query.id === undefined) {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }

    let res = await Store.user.findOne({ key: "NotifyProfile", id: query.id })
    ctx.type = "application/json"
    ctx.body = res.notifications
}

module.exports = {
    notifyUpdate,
    notifyNew,
    notifyObject,
    notifyPush
}