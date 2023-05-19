
const users = require('./users')
const auth = require('./auth')
const translation = require('./translation')
const subscriptionPlan = require('./subscriptionPlan')
const userPlan = require('./userPlan')
module.exports = [].concat(
    users,
    auth,
    translation,
    subscriptionPlan,
    userPlan
)