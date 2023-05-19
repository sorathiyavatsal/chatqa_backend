const { ObjectId } = require("mongodb");
const userPlanCollection = require("../../models/userPlan")
const IsExists = async (userId) => {
    let duplicatUserPlan = await userPlanCollection.Aggregate([
        {
            $match:  { userId: ObjectId(userId) }
        },
        {
            $match: { isActive: true }
        }
    ])
    return !!(duplicatUserPlan.length);
}
module.exports = { IsExists }