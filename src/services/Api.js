const baseURL = 'http://192.168.0.55:8444'

module.exports.post = async function post(url, body) {
    return await fetch(baseURL+url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',      
        },
        method: 'POST',
        body: JSON.stringify(body)
    })
}

module.exports.get = async function get(url, body) {
    return await fetch(baseURL+url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET',
        body: JSON.stringify(body)
    })
}