'use strict'

const Joi = require('joi');
const logger = require('winston');
const locals = require('../../locales');
let ObjectId = require('mongodb').ObjectId;
const subscriptionPlanCollection = require("../../models/subscriptionPlan")
const duplicatSubscriptionPlan = require('./CheckSubscriptionPlanExists')
const PostPatchPayload = require('../../library/helper/PostPatchPayload');
const ActivityLogs = require('../../library/helper/SampleCardActivityLog');
const logCollection = require('../../models/activitylogs');
const GetRequestedUser = require('../../library/helper/GetRequestedUser');
const SetDescription = require('./Set_SampleCardActivityLog');
const moment = require('moment');
const clientDB = require("../../models/mongodb")
/**
 * @description post a new category
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @property {string} categoryName - for select specific category details
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Jarun Borada
 * @date 02-July-2022
 */

const queryvalidator = Joi.object({
    spId: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.scId)
}).unknown(false);

const validator = Joi.object({
    name: Joi.string().description(locals['users'].Post.fieldsDescription.name),
    amount: Joi.number().description(locals['users'].Post.fieldsDescription.email),
    day: Joi.number().min(0).description(locals['signIn'].Post.fieldsDescription.email),
    points:Joi.number().min(0).description(locals['users'].Post.fieldsDescription.isActive),
    status: Joi.boolean().description(locals['sampleCard'].Post.fieldsDescription.status),
    active:  Joi.alternatives().conditional(Joi.ref('status'), {
        is:false,
        then: Joi.boolean().default(false),
        otherwise: Joi.boolean(),
    }).description(locals['sampleCard'].Post.fieldsDescription.height),
}).unknown(false)

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
            const payload = await PostPatchPayload.ObjectPayload(req, 'patch');
            const keys = Object.keys(req.payload)
            const projection = {}
            keys.forEach(object => {
                projection[object] = 1
            })
            projection['_id'] = 0
            const subscriptionPlanResult = await subscriptionPlanCollection.Aggregate(
                [{
                    $match: {
                        _id: ObjectId(req.query.spId)
                    }
                },
                { $project: projection }
                ]);
            if (payload?.name != null && subscriptionPlanResult?.name != payload?.name && await duplicatSubscriptionPlan.IsExists(payload?.name)) {
                code = 409;
                response.message = "This subscritiption plan name Is already Exists";
                return;
            }
            const AuthUser = await GetRequestedUser.User(req.headers.authorization);
            const activitylogs = await ActivityLogs.SampleCardActivityLogs(req.payload, subscriptionPlanResult[0])
            console.log(activitylogs)
            if (false && activitylogs && activitylogs != '') {
                let ActivityLogPayload = await SetDescription.SetDescription(activitylogs)
                ActivityLogPayload["itemId"] = ObjectId(req.query.spId)
                ActivityLogPayload["createdBy"] = ObjectId(AuthUser.userId),
                    ActivityLogPayload["createAt"] = moment().format()
                await logCollection.Insert(ActivityLogPayload);
            }
            const subscriptionPlan = await subscriptionPlanCollection.Update({
                _id: ObjectId(req.query.spId)
            }, payload, dbSession);
            code = 200
            response.message = locals["genericErrMsg"]["200"]
            response.data = subscriptionPlan
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
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, queryvalidator, response, handler }