const companyCollection = require("../../models/company")
const IsExists = async (email) => {
    let duplicatCompany = await companyCollection.Aggregate([
        {
            $match: { email: email }
        },
        {
            $match: { status: true }
        }
    ])
    return !!(duplicatCompany.length);
}
module.exports = { IsExists }