'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const userPlanCollection = require("../../models/userPlan")
const usersCollection = require("../../models/users")
const moment = require('moment');
const { ObjectId } = require('mongodb');
const activityLogCollection = require('../../models/activitylogs');
const GetRequestedUser = require('../../library/helper/GetRequestedUser');
const duplicatUserPlan = require('./CheckUserPlanExists')
const PostPatchPayload = require('../../library/helper/PostPatchPayload');
const clientDB = require("../../models/mongodb")
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
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
    userId:Joi.string().required().description(locals['users'].Post.fieldsDescription.name),
    planId:Joi.string().required().description(locals['users'].Post.fieldsDescription.name),
    transactionId:Joi.string().required().description(locals['users'].Post.fieldsDescription.name),
    totalPoints: Joi.number().min(0).required().description(locals['users'].Post.fieldsDescription.name),
    points:Joi.number().default(0).description(locals['users'].Post.fieldsDescription.isActive),
    day: Joi.number().min(0).required().description(locals['signIn'].Post.fieldsDescription.email),
    //endDate:Joi.string().description(locals['users'].Post.fieldsDescription.type),
    amount:Joi.number().required().description(locals['users'].Post.fieldsDescription.name),
    isActive: Joi.boolean().default(true).description(locals['users'].Post.fieldsDescription.type)
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
            if (await duplicatUserPlan.IsExists(payload.userId)) {
                code = 409;
                response.message = "This User plan Is already exits";
                return;
            }
            payload = await PostPatchPayload.ObjectPayload(req, 'post');
            payload["endDate"]=payload.endDate?payload.endDate:moment().add(payload.day+1, 'days').format('YYYY-MM-DD');
            let { amount, transactionId } = payload
            try
            {
                const payment = await stripe.paymentIntents.create({
                amount:amount*1000,
                currency: "INR",
                description: "abc compony ",
                payment_method: transactionId,
                confirm: true
            })
            const userPlanResult = await userPlanCollection.Insert(payload, dbSession);
            await usersCollection.Update({
                _id: ObjectId(payload.userId)
            }, {isSubscribe:true}, dbSession);
            let logs = {};
            logs['description'] = `User Plan ${AuthUser?.metaData?.name} is added`;
            logs['type'] = "USER_PLAN"
            logs['status'] = true;
            logs['itemId'] = ObjectId("" + userPlanResult.insertedIds[0]);
            logs['createdBy'] = AuthUser?.userId ? ObjectId(AuthUser.userId) : "",
            logs['createAt'] = moment().format();
            await activityLogCollection.Insert(logs, dbSession);
            code = 200
            response.message = "payment successfull "
            response.data = { details: payment }
        } catch (error) {
            code = 500
            response.message = "payment failed "
            response.data = { details: error }
        }
            //const userPlanResult = await userPlanCollection.Insert(payload, dbSession);
            
            // code = 200;
            // response.message = locals["genericErrMsg"]["200"];
            // response.data =userPlanResult
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