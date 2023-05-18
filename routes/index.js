
const users = require('./users')
const auth = require('./auth')
const customer = require('./customer')
const company = require('./company')
module.exports = [].concat(
    users,
    auth,
    customer,
    company 
)