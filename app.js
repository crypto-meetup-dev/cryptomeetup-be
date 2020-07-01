// Depnedencies
const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const KoaRouter = require('koa-router')
const KoaStatic = require('koa-static')

// Local Packages

const app = new Koa()

app.use(KoaStatic('./public'))

app.listen(5000, () => {
    console.log("listening on http://127.0.0.1:5000")
})