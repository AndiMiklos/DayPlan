var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
const sendSuccess = require('../../../custom_modules/sendSuccess')
const sendError = require('../../../custom_modules/sendError')
const tables = require('../../../database/database').tables
const saltRounds = 10

router.get('/users', getUsers)

function getUsers (req, res) {
    try {
        var query = `SELECT * from users`
        res.locals.mysql.query(query, (error, results, fields) => {
            if (error) {
                sendError(res, '500 Server Error. Please inform the developers!')
            } else if (results) {
                sendSuccess(res, results)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

router.post('/register', register)

async function register (req, res) {
    const logger = res.locals.logger
    try {
        let name = req.body.name
        let email = req.body.email
        let password = req.body.password
        const table = tables.users
        if (!name) {
            logger.info('No name provided!')
            sendError(res, 'No name provided!')
        } else if (!email) {
            logger.info('No email provided!')
            sendError(res, 'No email provided!')
        } else if (!password) {
            logger.info('No password provided!')
            sendError(res, 'No password provided!')
        } else {
            password = await bcrypt.hash(password, saltRounds)
            let findUser = `SELECT * FROM ${table.name} WHERE ${table.columns.email} = ?`
            let [findResult] = await res.locals.mysql.promise().query(findUser, [email])
            if (findResult.length !== 0) {
                logger.info('Another account with this email exists. Please use another email!')
                sendError(res, 'Another account with this email exists. Please use another email!')
                return
            } else {
                let createUser = `INSERT INTO ${table.name} (
                    ${table.columns.name},
                    ${table.columns.email},
                    ${table.columns.password},
                    ${table.columns.isAdmin}
                ) VALUES (?,?,?,0)`
                let [insertResult] = await res.locals.mysql.promise().query(createUser, [name, email, password])
                logger.info('Registered successfully')
                sendSuccess(res, 'Registered successfully')
            }
        }
    } catch (error) {
        logger.info('500 Server error. Please contact the developers' + error)
        sendError(res, '500 Server error. Please contact the developers')
    }
}

router.post('/login', login)

function login (req, res) {
    const logger = res.locals.logger
    try {
        const email = req.body.email
        const password = req.body.password
        console.log(email, password)
        if (!email || !password) {
            logger.info('No email or password received!')
            sendError(res, 'No email or password received!')
            return
        } else {
            const table = tables.users
            let getUser = 'SELECT ' + table.columns.password + ', ' + table.columns.isAdmin + ', ' + table.columns.user_id + ' FROM ' + table.name + ' WHERE ' + table.columns.email + ' = ?;' 
            res.locals.mysql.query(getUser, [email], function (error, results, fields) {
                if (error) {
                    logger.info('500 Server error. Please contact the developers' + error)
                    sendError(res, '500 Server error. Please inform the developers')
                } else if (results.length === 0) {
                    logger.info('Wrong email or password!')
                    sendError(res, 'Wrong email or password!', 400)
                } else if (results.length > 1) {
                    logger.info('Found more than one user with the same email. Denyinig login')
                    sendError(res, 'Found more than one user with the same email. Denyinig login', 400)
                } else {
                    console.log('#1')
                    console.log(password, results[0].password)
                    bcrypt.compare(password, results[0].password, function (error, result) {
                        if (error) {
                            logger.info('500 Server Error. Error when comparing hashes' + error)
                            sendError(res, '500 Server Error. Please inform the developers')
                        } else if (result === true) {
                            req.session.userID = results[0].user_id
                            req.session.user = email
                            req.session.loggedIn = true
                            req.session.admin = results[0].isAdmin
                            logger.info('Successful Login')
                            sendSuccess(res, 'Successful Login')
                        } else if (result === false) {
                            logger.info('Wrong password provided')
                            sendError(res, 'Wrong password provided')
                        }
                    })
                }
            })
        }
    } catch (error) {
        logger.info('500 Server error. Please contact the developers' + error)
        sendError (res, '500 Server error. Please inform the developers')
    }
}

router.get('/logout', logout) 

function logout (req, res) {
    const logger = res.locals.logger
    try {
        if (!req.session) {
            logger.info('No active session found')
            sendError(res, '500 Server error. Please inform the developers')
        } else {
            req.session.user = ''
            req.session.loggedIn = false
            req.session.destroy()
            sendSuccess(res, 'Successfully logged out')
        }
    } catch (error) {
        logger.info('500 Server error. Please contact the developers' + error)
        sendError (res, '500 Server error. Please inform the developers')
    }
}

router.get('/userInfo', userInfo)

async function userInfo (req, res) {
    const logger = res.locals.logger
    const user = req.session.user
    const table = tables.users
    try {
        let getUser = `SELECT ${table.columns.user_id}, ${table.columns.name}, ${table.columns.email}, ${table.columns.isAdmin}
                        FROM ${table.name} WHERE ${table.columns.email}=?`
        let [results] = await res.locals.mysql.promise().query(getUser, [user])
        if (results[0].length === 0) {
            logger.info('No user found')
            sendError (res, 'No user found')
        } else if (results[0].length > 1) {
            logger.info('Multiple users with the same email found!')
            sendError (res, '500 Server error. Please inform the developers')
        } else {
            logger.info('Successfully transmited user data')
            sendSuccess(res, {
                id: results[0].user_id,
                name: results[0].name,
                email: results[0].email,
                isAdmin: results[0].isAdmin
            })
        }
    } catch (error){
        logger.info('500 Server error. Please contact the developers' + error)
        sendError (res, '500 Server error. Please inform the developers')
    }
    
}

router.functions = {
    getUsers,
    register,
    login,
    userInfo
}

module.exports = router