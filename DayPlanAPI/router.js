var express = require('express')
var router = express.Router()

const access = require('./src/routes/access/access')
const categories = require('./src/routes/categories/categories')
const tasksRouter = require('./src/routes/tasks/router')

router.use('/access', access)
router.use('/categories', categories)
router.use('/tasks', tasksRouter)

module.exports = router

