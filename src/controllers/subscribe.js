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

    if (query.id === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }

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

    if (query.id === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }
    if (query.tokenId === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `tokenId`" }
        await next()
        return
    }
    if (query.symbol === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `symbol`" }
        await next()
        return
    }
    if (query.amount === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `amount`" }
        await next()
        return
    }

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

let addSubscribe = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))

    if (query.id === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }
    if (query.addId === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `addId`" }
        await next()
        return
    }

    await Store.user.update({ key: "SubscribeProfile", id: query.id }, { $addToSet: { users: query.addId } }, {})
}

let removeSubscribe = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))

    if (query.id === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `id`" }
        await next()
        return
    }
    if (query.removeId === undefined) {
        ctx.status = 406
        ctx.body = { message: "Invalid Request, Missing value on required field `removeId`" }
        await next()
        return
    }

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
    addSubscribe,
    removeSubscribe
}