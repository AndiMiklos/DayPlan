var express = require('express')
var router = express.Router()
const sendSuccess = require('../../../custom_modules/sendSuccess')
const sendError = require('../../../custom_modules/sendError')
const tables = require('../../../database/database').tables

router.post('/add', addTaskHistory)

async function addTaskHistory (req, res) {
    const logger = res.locals.logger
    try {
        let userID = req.body.userID
        let taskID = req.body.taskID

        if (!userID) {
            logger.info('Invalid userID')
            sendError(res, 'Invalid userID')
        } else if (!taskID) {
            logger.info('Invalid taskID')
            sendError(res, 'Invalid taskID')
        } else {
            const getQuery = `SELECT ${tables.tasks.columns.id} FROM ${tables.tasks.name} 
                            WHERE ${tables.tasks.columns.id} = ? AND ${tables.tasks.columns.userID} = ?;`
            let [results] = await res.locals.mysql.promise().query(getQuery, [taskID, userID])
            if (results.length === 0) {
                logger.info('Could not find the requested task for this user')
                sendError(res, 'Could not find the requested task for this user')
            } else {
                const insertQuery = `INSERT INTO ${tables.tasks_history.name} (
                    ${tables.tasks_history.columns.taskID},
                    ${tables.tasks_history.columns.userID}) VALUES (?,?);`
                await res.locals.mysql.promise().query(insertQuery, [taskID, userID])
                sendSuccess(res, 'Success')
            }
        }
    } catch (error) {
        logger.info('500 Server error. Please inform the developers' + error)
        sendError(res, '500 Server error. Please inform the developers')
    }
}

router.get('/get/:id', getCompletedTaskByID)

async function getCompletedTaskByID (req, res) {
    const logger = res.locals.logger
    try {
        let id = req.params.id 
        let user = req.body.userID

        if (!id) {
            logger.info('Invalid ID received')
            sendError(res, 'Invalid ID received')
        } else if (!user) {
            logger.info('Invalid user')
            sendError(res, 'Invalid user')
        } else {
            let getQuery = `SELECT 
                ${tables.tasks_history.name}.${tables.tasks_history.columns.id} as completed_id,
                ${tables.tasks_history.name}.${tables.tasks_history.columns.inserted},
                ${tables.tasks.name}.${tables.tasks.columns.id} as task_id, 
                ${tables.tasks.name}.${tables.tasks.columns.name} as task_name, 
                ${tables.tasks.columns.description},
                ${tables.categories.name}.${tables.categories.columns.name},
                ${tables.categories.columns.color} 
                FROM ${tables.tasks.name} INNER JOIN ${tables.categories.name} 
                ON ${tables.categories.name}.${tables.categories.columns.id}=${tables.tasks.columns.categoryID}
                INNER JOIN ${tables.tasks_history.name}
                ON ${tables.tasks.name}.${tables.tasks.columns.id} = ${tables.tasks_history.columns.taskID}
                WHERE ${tables.tasks_history.name}.${tables.tasks_history.columns.id}=?
                AND ${tables.tasks.name}.${tables.tasks.columns.userID}=?;`
            let [results] = await res.locals.mysql.promise().query(getQuery, [id, user])
            if (results.length === 0) {
                logger.info('No task was found')
                sendError(res, 'No task was found')
            } else {
                logger.info('Completed task was found')
                sendSuccess(res, results[0])
            }
        }

    } catch (error) {
        logger.info('500 Server error. Please inform the developers' + error)
        sendError(res, '500 Server error. Please inform the developers')
    }
}

router.get('/get/:from/:to', getCompletedTasksBetweenDates)

async function getCompletedTasksBetweenDates (req, res) {
    const logger = res.locals.logger
    try {
        let from = req.params.from
        let to = req.params.to
        let user = req.body.user
        if (!from) {
            logger.info('Invalid from date received')
            sendError(res, 'Invalid from date received')
        } else if (!to) {
            logger.info('Invalid to date received')
            sendError(res, 'Invalid to date received')
        } else if (!user) {
            logger.info('Invalid user')
            sendError(res, 'Invalid user')
        } else {
            const getQuery = `SELECT 
                ${tables.tasks_history.name}.${tables.tasks_history.columns.id} as completed_id,
                ${tables.tasks_history.name}.${tables.tasks_history.columns.inserted},
                ${tables.tasks.name}.${tables.tasks.columns.id} as task_id, 
                ${tables.tasks.name}.${tables.tasks.columns.name} as task_name, 
                ${tables.tasks.columns.description},
                ${tables.categories.name}.${tables.categories.columns.name},
                ${tables.categories.columns.color} 
                FROM ${tables.tasks.name} INNER JOIN ${tables.categories.name} 
                ON ${tables.categories.name}.${tables.categories.columns.id}=${tables.tasks.columns.categoryID}
                INNER JOIN ${tables.tasks_history.name}
                ON ${tables.tasks.name}.${tables.tasks.columns.id} = ${tables.tasks_history.columns.taskID}
                WHERE ${tables.tasks_history.columns.inserted}<${to} 
                AND ${tables.tasks_history.columns.inserted}>${from}
                AND ${tables.tasks.name}.${tables.tasks.columns.userID}=${user};`
            let [results] = await res.locals.mysql.promise().query(getQuery)
            if (results.length === 0) {
                logger.info('No tasks available for the selected interval')
                sendError(res, 'No tasks available for the selected interval', 404)
            } else {
                logger.info('Tasks fetched')
                sendSuccess(res, results)
            }
        }
    } catch (error) {
        logger.info('500 Server error. Please inform the developers' + error)
        sendError(res, '500 Server error. Please inform the developers')
    }
}

router.delete('/delete/:id', deleteCompletedTask)

async function deleteCompletedTask (req, res) {
    const logger = res.locals.logger
    try {
        let id = req.params.id 
        const getQuery = `SELECT ${tables.tasks_history.columns.id} FROM ${tables.tasks_history.name} WHERE id=?;`
        let [results] = await res.locals.mysql.promise().query(getQuery, [id])
        if (results.length === 0) {
            logger.info('No task with the given id was found')
            sendError(res, 'No task with the given id was found')
        } else if (results.length > 1) {
            logger.info('Server error. Multiple tasks with the same id found')
            sendError(res, 'Server error. Multiple tasks with the same id found')
        } else if (results.length === 1) {
            const deleteQuery = `DELETE FROM ${tables.tasks_history.name} WHERE id=?;`
            await res.locals.mysql.promise().query(deleteQuery, [id])
            sendSuccess(res, 'Successfully deleted task')
        }
    } catch (error) {
        logger.info('500 Server error. Please inform the developers' + error)
        sendError(res, '500 Server error. Please inform the developers')
    }
}

router.functions = {
    addTaskHistory,
    getCompletedTaskByID,
    getCompletedTasksBetweenDates,
    deleteCompletedTask
}

module.exports = router