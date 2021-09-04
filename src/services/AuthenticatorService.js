const Api = require('./Api')

export default {
    login (loginEmail, loginPassword) {
        return Api.post('/access/login', {email: loginEmail, password: loginPassword})
    },
    register (name, email, password, birthday) {
        return Api.post('/access/register', {name: name, email: email, password: password, birthday: birthday})
    },
    userInfo () {
        return Api.get('/access/userInfo')
    },
    logout () {
        return Api.get('/access/logout')
    }
}