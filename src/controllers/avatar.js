// Dependencies
const fs = require('fs')

let avatar = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    ctx.type = 'image/png'
    ctx.body = fs.createReadStream('./data/img/' + query.id + ".png")
    await next()
}

module.exports = avatar