module.exports = function (res, message) {
    res.status(200)
    res.send(JSON.stringify({success: true, error: false, msg: message}))
}