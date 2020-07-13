// Local Packages
const Log = require('../util/log')
const Store = require('../store/store')
const user = require('../api/user')

let friends = async(ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
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
    ctx.body = query
}

module.exports = {
    friends,
    friendsUpdate
}