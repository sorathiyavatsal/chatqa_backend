
const users = require('./users')
const auth = require('./auth')
//const translation = require('./translation')
const subscriptionPlan = require('./subscriptionPlan')
const userPlan = require('./userPlan')
const questionAnswer = require('./questionAnswer')
const stripeAnswer = require('./stripe')
module.exports = [].concat(
    users,
    auth,
    //translation,
    subscriptionPlan,
    userPlan,
    questionAnswer,
    stripeAnswer
)