// Local Packages
const Log = require('../util/log')
const Store = require('../store/store')
const user = require('../api/user')

let friends = async(ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))

    if (query.id === undefined || query.id === "undefined" || query.id === "null") {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }

    let friends = await Store.user.findOne({ key: "FriendsProfile", id: query.id })
    let friendObjects = new Array()
    for(let i = 0; i < friends.users.length; i++) {
        let friend = await Store.user.findOne({ key: "UserProfile", id: friends.users[i] })
        let friendObject = {
            userId: friend.id,
            nickname: friend.nickname,
            lng: friend.lng,
            lat: friend.lat,
            status: friend.status
        }
        friendObjects.push(friendObject)
    }

    ctx.body = friendObjects
}

let friendsUpdate = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    
    if (query.id === undefined || query.id === "undefined" || query.id === "null") {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }
    if (query.removeId === undefined || query.id === "undefined" || query.id === "null") {
        ctx.body = { status: "failed", message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }

    let friends = await Store.user.findOne({ key: "FriendsProfile", id: query.id })
    friends = friends.users.filter(e => e.id !== parseInt(query.removeId))
    await Store.user.update({ key: "FriendsProfile", id: query.id }, { $set: { users: friends } }, {})
    
    ctx.body = { message: "success" }
    
    await next()
}

module.exports = {
    friends,
    friendsUpdate
}