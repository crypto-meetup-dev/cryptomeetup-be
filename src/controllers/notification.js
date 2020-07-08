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

module.exports = {
    notifyUpdate,
    notifyNew,
    notifyObject
}