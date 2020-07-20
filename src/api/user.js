// Dependencies
const KoaRouter = require('koa-router')

// Local Dependencies
const login = require('../controllers/login')
const info = require('../controllers/info')
const getAvatar = require('../controllers/avatar')
const getPosition = require('../controllers/position')
const { avatar, nickname, email, position, status } = require('../controllers/update')

let user = new KoaRouter()

user.get("/info", info)
user.get("/login", login)
user.get("/avatar", getAvatar)
user.get("/position", getPosition)
user.get("/update/email", email)
user.get("/update/avatar", avatar)
user.get("/update/nickname", nickname)
user.get("/update/position", position)
user.get("/update/status", status)


module.exports = user