// Dependencies

// Local Packages
let Log = require('../util/log')
let Store = require('../store/store')

let subscribe = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
}

let subscribeAll = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))

    let allProfiles = await Store.main.findOne({ key: "SubscribeProfiles" })
    if (allProfiles.users.length > 0) {
        let profiles = new Array()
        let i = 0
        for (i = 0;i < allProfiles.users.length; i++) {
            let res = await Store.user.findOne({ key: "SubscribeProfile", id: allProfiles.users[i] })
            profiles.push(res.active)
        }
        ctx.body = profiles

    }
    else {
        ctx.body = false
    }
}

let mineSubscribe = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))

    let mine = await Store.user.findOne({ key: "SubscribeProfile", id: query.id })
    if (mine.status) {
        ctx.body = mine.active
        await next()
    }
    else {
        ctx.body = false
        await next()
    }
}

let createSubscribe = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))

    let user = await Store.user.findOne({ key: "UserProfile", id: query.id })
    let userSubscribeProfile = await Store.user.findOne({ key: "SubscribeProfile", id: query.id })
    if (!userSubscribeProfile.status) {
        let newProlile = {
            userId: query.id,
            nickname: user.nickname,
            token: query.tokenId,
            symbol: query.symbol,
            amount: query.amount
        }
        await Store.user.update({ key: "SubscribeProfile", id: query.id }, { $set: { status: true } }, {})
        await Store.user.update({ key: "SubscribeProfile", id: query.id }, { $set: { active: newProlile } }, {})
        await Store.main.update({ key: "SubscribeProfiles" }, { $addToSet: { users: query.id } }, {})

        ctx.body = { message: "create success" }
    }
    else {
        let newProlile = {
            userId: query.id,
            nickname: user.nickname,
            token: query.tokenId,
            symbol: query.symbol,
            amount: query.amount
        }
        await Store.user.update({ key: "SubscribeProfile", id: query.id }, { $set: { active: newProlile } }, {})
        ctx.body = { message: "update success" }
    }

    await next()
}

let dismissSubscribe = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))

    let userSubscribeProfile = await Store.user.findOne({ key:  "SubscribeProfile", id: query.id })
    if (userSubscribeProfile.status) {
        let allProfiles = await Store.main.findOne({ key: "SubscribeProfiles" })
        let newUsers = allProfiles.users.filter(e => e.id !== parseInt(query.id))
        await Store.main.update({ key: "SubscribeProfiles" }, { $set: { users: newUsers } }, {})
        
        await Store.user.update({ key: "SubscribeProfile", id: query.id }, { $set: { status: false } }, {})
        await Store.user.update({ key: "SubscribeProfile", id: query.id }, { $set: { active: {} } }, {})

        ctx.body = { message: "success" }
    }
    else {
        ctx.body = { message: "No need to modify" }
    }
    await next()
}

let removeSubscribe = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))

    let userSubscribeProfile = await Store.user.findOne({ key: "SubscribeProfile", id: query.id })
    let newUsers = userSubscribeProfile.users.filter(e => e.id !== parseInt(query.removeId))
    await Store.user.update({ key: "SubscribeProfile", id: query.id }, { $set: { users: newUsers } }, {})
}

module.exports = {
    subscribe,
    subscribeAll,
    mineSubscribe,
    createSubscribe,
    dismissSubscribe,
    removeSubscribe
}