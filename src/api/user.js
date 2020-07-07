// Dependencies
const KoaRouter = require('koa-router')

// Local Dependencies
const login = require('../controllers/login')
const getAvatar = require('../controllers/avatar')
const { avatar, nickname, email } = require('../controllers/update')

let user = new KoaRouter()

user.get("/login", login)
user.get("/avatar", getAvatar)
user.get("/update/email", email)
user.get("/update/avatar", avatar)
user.get("/update/nickname", nickname)


module.exports = user