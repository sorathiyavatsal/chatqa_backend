'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const subscriptionPlanCollection = require("../../models/subscriptionPlan")
const moment = require('moment');
const { ObjectId } = require('mongodb');
const activityLogCollection = require('../../models/activitylogs');
const GetRequestedUser = require('../../library/helper/GetRequestedUser');
const duplicatSubscriptionPlan = require('./CheckSubscriptionPlanExists')
const PostPatchPayload = require('../../library/helper/PostPatchPayload');
const clientDB = require("../../models/mongodb")
/**
 * @description for user signIn
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @property {string} categoryName - for select specific category details
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Jarun Borada
 * @date 28-June-2022
 */

const validator = Joi.object({
    name: Joi.string().required().description(locals['users'].Post.fieldsDescription.name),
    amount: Joi.number().required().description(locals['users'].Post.fieldsDescription.email),
    day: Joi.number().min(0).required().description(locals['signIn'].Post.fieldsDescription.email),
    points:Joi.number().min(0).required().description(locals['users'].Post.fieldsDescription.isActive),
    active: Joi.boolean().default(true).description(locals['users'].Post.fieldsDescription.type)
}).unknown(false);

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
            const AuthUser = await GetRequestedUser.User(req.headers.authorization);
            let payload = req.payload
            if (payload.name!=null && await duplicatSubscriptionPlan.IsExists(payload.name)) {
                code = 409;
                response.message = "This subscritiption plan name Is already Exists";
                return;
            }
            payload = await PostPatchPayload.ObjectPayload(req, 'post');
            const subscriptionPlanResult = await subscriptionPlanCollection.Insert(payload, dbSession);
            let logs = {};
            logs['description'] = `Subscritiption Plan ${payload?.name} is added`;
            logs['type'] = "SUBSCITIPTION_PLAN"
            logs['status'] = true;
            logs['itemId'] = ObjectId("" + subscriptionPlanResult.insertedIds[0]);
            logs['createdBy'] = AuthUser?.userId ? ObjectId(AuthUser.userId) : "",
            logs['createAt'] = moment().format();
            await activityLogCollection.Insert(logs, dbSession);
            code = 200;
            response.message = locals["genericErrMsg"]["200"];
            response.data = subscriptionPlanResult;
        }, transactionOptions);
        return res.response(response).code(code);
    } catch (e) {
        console.log(e)
        logger.error(e.message)
        return res.response({ message: locals["genericErrMsg"]["500"] }).code(500);
    }
    finally {
        await dbSession.endSession();
    }
}

const response = {
    status: {
        409: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["409"]) }),
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.object() }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }