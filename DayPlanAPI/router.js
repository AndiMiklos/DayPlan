var express = require('express')
var router = express.Router()

const access = require('./src/routes/access/access')
const categories = require('./src/routes/categories/categories')

router.use('/access', access)
router.use('/categories', categories)

module.exports = router

