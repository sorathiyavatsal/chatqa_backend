const userCollection = require("../../models/users")
const IsExists = async(email)=>
{
    let duplicatUser = await userCollection.Aggregate([ 
        {
            $match: { email: { $regex: '^'+email+'$', $options: 'i' } }
        },
        {
            $match: { status:true }
        }
    ])
    return !!(duplicatUser.length);
}
module.exports = { IsExists }