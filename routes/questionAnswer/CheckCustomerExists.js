const customerCollection = require("../../models/questionAnswer")
const IsExists = async (email) => {
    let duplicatCustomer = await customerCollection.Aggregate([
        {
            $match: { email: email }
        },
        {
            $match: { status: true }
        }
    ])
    return !!(duplicatCustomer.length);
}
module.exports = { IsExists }