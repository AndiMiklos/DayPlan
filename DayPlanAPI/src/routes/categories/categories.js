var express = require('express')
var router = express.Router()
const sendSuccess = require('../../../custom_modules/sendSuccess')
const sendError = require('../../../custom_modules/sendError')
const tables = require('../../../database/database').tables

router.get('/', getCategoriesByUserID)

async function getCategoriesByUserID (req, res) {
    const logger = res.locals.logger
    const table = tables.categories
    try {
        let userID = req.session.userID
        let query = `SELECT ${table.columns.id}, ${table.columns.name}, ${table.columns.color} FROM ${table.name} WHERE ${table.columns.userID} = ?`
        let [results] = await res.locals.mysql.promise().query(query, [userID])
        if (results.length === 0) {
            logger.info('No available categories. Please add some categories')
            sendError(res, 'No available categories. Please add some categories')
        } else {
            logger.info(results)
            sendSuccess(res, results)
        }
    } catch (error) {
        logger.info('500 Server error. Please contact the developers' + error)
        sendError(res, '500 Server error. Please contact the developers')
    }
}

router.post('/add', addCategory)

async function addCategory (req, res) {
    const logger = res.locals.logger
    const table = tables.categories
    try {
        let userID = req.session.userID
        let name = req.body.name
        let color = req.body.color
        if (!name) {
            logger.info('No name was received for the category')
            sendError(res, 'No name was received for the category')
        } else if (!color) {
            logger.info('No color was received for the category')
            sendError(res, 'No color was received for the category')
        } else {
            let query = `INSERT INTO ${table.name} (
                ${table.columns.name},
                ${table.columns.color},
                ${table.columns.userID}
            ) VALUES (?,?,?)`
            let [insertResult] = await res.locals.mysql.promise().query(query, [name, color, userID])
            logger.info('Category added successfully')
            sendSuccess(res, 'Category added successfully')
        }
    } catch (error) {
        logger.info('500 Server error. Please contact the developers' + error)
        sendError(res, '500 Server error. Please contact the developers')
    }
}

router.put('/update/:categoryID', update)

async function update (req, res) {
    const logger = res.locals.logger
    const table = tables.categories
    try {
        let categoryID = req.params.categoryID
        let name = req.body.name
        let color = req.body.color
        if (!name) {
            logger.info('No name was received for the category')
            sendError(res, 'No name was received for the category')
        } else if (!color) {
            logger.info('No color was received for the category')
            sendError(res, 'No color was received for the category')
        } else {
            let query = `UPDATE ${table.name} SET ${table.columns.name} = ?, ${table.columns.color} = ? WHERE ${table.columns.id} = ?;`
            let [insert] = await res.locals.mysql.promise().query(query, [name, color, categoryID])
            logger.info('Category updated successfully')
            sendSuccess(res, 'Category updated successfully')
        }
    } catch (error) {
        logger.info('500 Server error. Please contact the developers' + error)
        sendError(res, '500 Server error. Please contact the developers')
    }
}

router.delete('/:categoryID', deleteCategory)

async function deleteCategory (req, res) {
    const logger = res.locals.logger
    const table = tables.categories
    try {
        let categoryID = req.params.categoryID
        let findQuery = `SELECT ${table.columns.id} FROM ${table.name} WHERE ${table.columns.id} = ?`
        let [findResult] = await res.locals.mysql.promise().query(findQuery, [categoryID])
        if (findResult.length === 0) {
            logger.info('Error! Could not find category to delete')
            sendError(res, 'Error! Could not find category to delete')
        } else {
            let deleteQuery = `DELETE FROM ${table.name} WHERE ${table.columns.id} = ?`
            let [deleteResult] = await res.locals.mysql.promise().query(deleteQuery, [categoryID]) 
            logger.info('Category deleted successfully')
            sendSuccess(res, 'Category deleted successfully')
        }
    } catch (error) {
        logger.info('500 Server error. Please contact the developers' + error)
        sendError(res, '500 Server error. Please contact the developers')
    }
}

router.functions = {
    getCategoriesByUserID,
    addCategory,
    update
}

module.exports = router