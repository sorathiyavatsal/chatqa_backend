'use strict'

const Joi = require('joi');
let ObjectId = require('mongodb').ObjectId;
const logger = require('winston');
const locals = require('../../locales');
const { generateTokens } = require('../../middleware/auth');
const userCollection = require('../../models/users')
const refreshToken = require('../../models/refreshToken');
const clientDB = require("../../models/mongodb")
const bcrypt = require('bcryptjs');
const randToken = require('rand-token');
const moment = require("moment");
/**
 * @description for user signIn
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @property {string} categoryName - for select specific category details
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Vatsal Sorathiya
 * @date 11-Dec-2020
 */

const validator = Joi.object({
    email: Joi.string().required().description(locals['signIn'].Post.fieldsDescription.email),
    password: Joi.string().required().description(locals['signIn'].Post.fieldsDescription.password)
}).unknown(false);

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
            const userDetails = await userCollection.SelectOne({
                email: req.payload.email,
                status: true
            })
            if (userDetails) {
                const verificationResult = userDetails?.isActive?true:false
                if (verificationResult && bcrypt.compareSync(req.payload.password, userDetails.password)) {
                    let refreshtokenResult, refreshtoken;

                    await refreshToken.Delete({ userId: ObjectId(userDetails._id) });
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
                    code = 200
                    await refreshToken.Insert({ refreshtoken: refreshtoken,userId:ObjectId(userDetails._id), 'createAt': moment().format()},dbSession);
                    response.message = locals["genericErrMsg"]["200"]
                    userDetails["refresh_token"]=refreshtoken
                    response.data = userDetails
                } else { 
                    if(verificationResult)
                    {      
                        code = 409
                        response.message = locals['signIn'].Post.error.passwordInvalid;
                        }
                        else{
                        code = 405
                        response.message = locals['users'].Post.error.isfalse;
                        }
                }
            } else {
                code = 404
                response.message = "user not found"
                //return res.response({ message: 'user not found' }).code(204);
            }
        }, transactionOptions);
        return res.response(response).code(code);
    } catch (e) {
        logger.error(e.message)
        return res.response({
            message: locals["genericErrMsg"]["500"]
        }).code(500);
    }
    finally {
        dbSession.endSession();
    }
}

const response = {
    status: {
        401: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["401"]) }),
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.any() }),
        204: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["204"]) }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }