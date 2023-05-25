const subscriptionPlanCollection = require("../../models/subscriptionPlan")
const IsExists = async (name) => {
    let duplicatSubscriptionPlan = await subscriptionPlanCollection.Aggregate([
        {
            $match:  { name: { $regex: '^' + name + '$', $options: 'i' } }
        },
        {
            $match: { status: true }
        }
    ])
    return !!(duplicatSubscriptionPlan.length);
}
module.exports = { IsExists }