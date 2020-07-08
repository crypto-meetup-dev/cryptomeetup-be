// Local Packages
const Log = require('../util/log')
const Store = require('../store/store')

// /invite endpoint
let invite = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    ctx.body = query
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