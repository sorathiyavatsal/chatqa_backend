'use strict'
const Joi = require('joi');
const logger = require('winston');
const locals = require('../../locales');
const usersCollection = require("../../models/users")
const refreshToken = require('../../models/refreshToken');
const { generateTokens } = require('../../middleware/auth');
const randToken = require('rand-token');
const { ObjectId } = require('bson');
const moment = require("moment");
const clientDB = require("../../models/mongodb")

const validator = Joi.object({
    token: Joi.string().required().description('token is required')
}).unknown();

const handler = async (req, res) => {
    const client = await clientDB.getClient();
    const dbSession = await client.startSession()

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    var code;
    const response = {}
    try {
        await dbSession.withTransaction(async () => {
            let refreshtokenResult, refreshtoken;
            refreshtokenResult = await refreshToken.SelectOne({ refreshtoken: req.payload.token });
            if (!refreshtokenResult) {
                code = 404
                response.message = "Token Invalid";
                
            }
            else{
            const userDetails = await usersCollection.SelectOne({
                "_id": ObjectId(refreshtokenResult.userId)
            })

            if (userDetails.status == false || userDetails?.isActive==false) {
                code = 405
                response.message = locals['users'].Post.fieldsDescription.isfalse
            }
            if (userDetails) {
                let token;
                do {
                    refreshtoken = randToken.uid(256);
                    refreshtokenResult = await refreshToken.SelectOne({ refreshtoken: refreshtoken });
                }
                while (refreshtokenResult)
                userDetails['access_token'] = "Bearer " + await generateTokens({
                    userId: "" + userDetails._id,
                    userRole: userDetails.role,
                    metaData: userDetails
                })
                let data = { refreshtoken: refreshtoken, 'updateAt': moment().format() };
                let refreshtokenResults = await refreshToken.Update({ userId: ObjectId(userDetails._id) }, data,dbSession)
                if (refreshtokenResults) {
                    code = 200
                    response.message = locals["genericErrMsg"]["200"]
                    userDetails["refresh_token"]=refreshtoken
                    response.data = userDetails

                }
            }
          else {
                code = 404
                response.message = locals["genericErrMsg"]["204"]
            }
        }
        }, transactionOptions);
        return res.response(response).code(code);
    } catch (e) {
        logger.error(e.message)
        console.log(e)
        return res.response({ message: locals["genericErrMsg"]["500"] }).code(500);
    }
    finally {
        dbSession.endSession();
    }
}

const response = {
    status: {
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.any() }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
        204: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["204"]) }),
        409: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["409"]) }),
    }
}

module.exports = { validator, handler, response }
