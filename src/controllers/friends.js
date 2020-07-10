// Local Packages
const Log = require('../util/log')
const Store = require('../store/store')

let friends = async(ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    let friends = await Store.user.findOne({ key: "FriendsProfile", id: query.id })
    ctx.body = friends.users
}

let friendsUpdate = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    ctx.body = query
}

module.exports = {
    friends,
    friendsUpdate
}