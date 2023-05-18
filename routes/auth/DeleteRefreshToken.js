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
            let refreshtokenResult = await refreshToken.Delete({ refreshtoken: req.payload.token },dbSession);
            if (refreshtokenResult.deletedCount) {
                code = 200
                response.message="refresh token deleted successfully"
                
            }
            else{
                code = 404
                response.message = "Token Invalid"
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
