var express = require('express')
var router = express.Router()

const tasks = require('./tasks')
const tasksHistory = require('./tasksHistory')

router.use('/', tasks)
router.use('/completed', tasksHistory)

module.exports = router