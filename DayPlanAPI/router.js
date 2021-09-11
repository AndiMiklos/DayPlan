var express = require('express')
var router = express.Router()

const access = require('./src/routes/access/access')
const categories = require('./src/routes/categories/categories')
const tasks = require('./src/routes/tasks/tasks')

router.use('/access', access)
router.use('/categories', categories)
router.use('/tasks', tasks)

module.exports = router

