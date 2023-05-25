'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const userCollection = require("../../models/users");
const clientDB = require("../../models/mongodb");

/**
 * @description post a new order
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Vatsal Sorathiya
 * @date 11-Dec-2020
 */

const validator = Joi.object({
    token: Joi.string().required().description(locals['signIn'].Post.fieldsDescription.email)
}).unknown();

const handler = async (req, res) => {
    const client = await clientDB.getClient();
    const dbSession = await client.startSession()

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    let code;
    const response = {}
    try {
        await dbSession.withTransaction(async () => {
            let user = jwt.decode(req.payload.token)
            if (!(user?.id)) {
                code = 401;
                response.message = locals["genericErrMsg"]["401"];
                return;
            }
            let data = { 'active': true }
            const userResult = await userCollection.Update({ _id: ObjectId(user.id) }, data, dbSession)
            code = 200;
            response.message = locals["genericErrMsg"]["200"]
            response.data = userResult
        }, transactionOptions);
        return res.response(response).code(code);
    } catch (e) {
        console.log(e)
        logger.error(e.message)
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
        409: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["204"]) }),
    }
}

module.exports = { validator, response, handler }