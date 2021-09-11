var express = require('express')
var router = express.Router()
const sendSuccess = require('../../../custom_modules/sendSuccess')
const sendError = require('../../../custom_modules/sendError')
const tables = require('../../../database/database').tables
//!!!!!!! Add checks for all request params and send error if not ok
router.get('/getTask/:id', getTaskByID)

async function getTaskByID (req, res) {
    const logger = res.locals.logger
    try {
        let taskID = req.params.id
        const getTaskQuery = `SELECT * FROM ${tables.tasks.name} WHERE ${tables.tasks.columns.id} = ?;`
        let [results] = await res.locals.mysql.promise().query(getTaskQuery, [taskID])

        if (results.length === 0) {
            logger.info('Could not found the requested task')
            sendError(res, 'Could not found the requested task', 404)
        } else if (results.length > 1) {
            logger.info('A system error occured when trying to get the requested task. Two tasks share the same id')
            sendError(res, 'A system error occured when trying to get the requested task. Two tasks share the same id')
        } else if (results.length === 1) {
            logger.info('Successfully got the task')
            sendSuccess(res, results[0])
        }
    } catch (error) {
        logger.info('500 Server error. Please inform the developers' + error)
        sendError(res, '500 Server error. Please inform the developers')
    }
}

router.post('/add', addTask)

async function addTask (req, res) {
    const logger = res.locals.logger
    try {
        let userID = req.body.userID
        let categoryID = req.body.categoryID
        let name = req.body.name
        let description = req.body.description
        let isRecursive = req.body.isRecursive
        let isDaily = req.body.isDaily
        let isWeekly = req.body.isWeekly
        let weekly = JSON.stringify(req.body.weekly)
        let startDate = req.body.startDate
        console.log(weekly)

        const insertQuery = `INSERT INTO ${tables.tasks.name} (
            ${tables.tasks.columns.userID},
            ${tables.tasks.columns.categoryID},
            ${tables.tasks.columns.name},
            ${tables.tasks.columns.description},
            ${tables.tasks.columns.isRecursive},
            ${tables.tasks.columns.isDaily},
            ${tables.tasks.columns.isWeekly},
            ${tables.tasks.columns.weekly},
            ${tables.tasks.columns.startDate}) VALUES (?,?,?,?,?,?,?,?,?)`
        await res.locals.mysql.promise().query(insertQuery, [userID, categoryID, name, description, isRecursive, isDaily, isWeekly, weekly, startDate])
        sendSuccess(res, 'Inserted')
    } catch (error) {
        logger.info('500 Server error. Please inform the developers' + error)
        sendError(res, '500 Server error. Please inform the developers')
    }
}

router.get('/get/:from/:to', getTasksBetweenDates)

async function getTasksBetweenDates (req, res) {
    const logger = res.locals.logger
    try {
        let from = req.params.from
        let to = req.params.to
        let user = req.body.user
        const getQuery = `SELECT 
            ${tables.tasks.name}.${tables.tasks.columns.id} as task_id, 
            ${tables.tasks.name}.${tables.tasks.columns.name} as task_name, 
            ${tables.tasks.columns.description},
            ${tables.categories.name}.${tables.categories.columns.name},
            ${tables.categories.columns.color} 
            FROM ${tables.tasks.name} INNER JOIN ${tables.categories.name} 
            ON ${tables.categories.name}.${tables.categories.columns.id}=${tables.tasks.columns.categoryID}
            WHERE ${tables.tasks.columns.startDate}<${to} AND ${tables.tasks.name}.${tables.tasks.columns.userID}=${user};`
        let [results] = await res.locals.mysql.promise().query(getQuery)
        if (results.length === 0) {
            logger.info('No tasks available for the selected interval')
            sendError(res, 'No tasks available for the selected interval', 404)
        } else {
            logger.info('Tasks fetched')
            sendSuccess(res, results)
        }

    } catch (error) {
        logger.info('500 Server error. Please inform the developers' + error)
        sendError(res, '500 Server error. Please inform the developers')
    }
}

router.delete('/delete/:id', deleteTask)

async function deleteTask (req, res) {
    const logger = res.locals.logger
    try {
        let id = req.params.id 
        const getQuery = `SELECT ${tables.tasks.columns.id} FROM ${tables.tasks.name} WHERE id=?;`
        let [results] = await res.locals.mysql.promise().query(getQuery, [id])
        if (results.length === 0) {
            logger.info('No task with the given id was found')
            sendError(res, 'No task with the given id was found')
        } else if (results.length > 1) {
            logger.info('Server error. Multiple tasks with the same id found')
            sendError(res, 'Server error. Multiple tasks with the same id found')
        } else if (results.length === 1) {
            const deleteQuery = `DELETE FROM ${tables.tasks.name} WHERE id=?;`
            await res.locals.mysql.promise().query(deleteQuery, [id])
            sendSuccess(res, 'Successfully deleted task')
        }
    } catch (error) {
        logger.info('500 Server error. Please inform the developers' + error)
        sendError(res, '500 Server error. Please inform the developers')
    }
}

router.functions = {
    getTaskByID,
    addTask,
    getTasksBetweenDates,
    deleteTask
}

module.exports = router