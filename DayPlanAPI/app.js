const express = require('express')
const http = require('http')
const https = require('https')
const mysql = require('mysql2')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const bodyParser = require('body-parser')
const cors = require('cors')
const winston = require('winston')
var config = require('./config/config').get()

const router = require('./router')
const { urlencoded } = require('express')

const app = express()

const mysqlPool = mysql.createPool({
    host: config.mysqlOptions.host,
    user: config.mysqlOptions.user,
    password: config.mysqlOptions.password,
    database: config.mysqlOptions.database,
    multipleStatements: true
})

const sessionStorage = new MySQLStore({}, mysqlPool.promise())

const logger = winston.createLogger(config.winstonOptions)

const sessionOptions = config.sessionOptions
sessionOptions['store'] = sessionStorage

const authSession = session(sessionOptions)

const setResLocals = function (req, res, next) {
    res.locals.mysql = mysqlPool
    res.locals.config = config
    res.locals.logger = logger
    next()
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(cors())

app.use(authSession)

app.use(setResLocals)

// app.get('/', (req, res) => res.send('Hi'))

app.use('/', router)

server = http.createServer(app)

server.listen(8444, () => console.log('API Listening on port 8444'))