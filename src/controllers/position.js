
let position = async (ctx, next) => {
    let query = ctx.request.query
    query = JSON.parse(JSON.stringify(query))
    ctx.body = query
}

module.exports = position