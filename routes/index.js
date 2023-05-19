
const users = require('./users')
const auth = require('./auth')
const translation = require('./translation')
module.exports = [].concat(
    users,
    auth,
    translation
)