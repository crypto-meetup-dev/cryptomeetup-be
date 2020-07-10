// Local Packages
const Log = require('../util/log')
const Store = require('../store/store')

let position = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    let user = await Store.user.findOne({ key: "UserProfile", id: query.id })
    console.log(user)
    let position = [user.lng, user.lat]
    ctx.body = position
}

module.exports = position