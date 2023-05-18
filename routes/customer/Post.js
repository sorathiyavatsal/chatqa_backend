'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const customerCollection = require("../../models/customer")
const moment = require('moment');
const { ObjectId } = require('mongodb');
const activityLogCollection = require('../../models/activitylogs');
const GetRequestedUser = require('../../library/helper/GetRequestedUser');
const duplicatCustomer = require('./CheckCustomerExists')
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
    other: Joi.object().keys({
        type: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.type).valid('business', 'individual'),
        name: Joi.object().keys({
            salutation: Joi.string().allow(null).allow(""),
            first: Joi.string().allow("").allow(null),
            last: Joi.string().allow("").allow(null)
        }).unknown(false),
        companyName: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        displayName: Joi.object().keys({
            first: Joi.string().required(),
            second: Joi.string().allow("").allow(null)
        }).unknown(false),
        email: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        phone: Joi.object().keys({
            work: Joi.string().allow("").allow(null),
            mobile: Joi.string().allow("").allow(null)
        }).unknown(false),
    }).unknown(false),
    address: Joi.array().min(1).max(2).items(Joi.object({
        attention: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.type),
        country: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.type),
        bNumber: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        sName: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        address: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        aNumber: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        district: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        city: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        state: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        zipCode: Joi.number().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        website:Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        phone: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        fax: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
    }).unknown(false)),
    banking: Joi.object().keys({
        currency: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.type),
        balance: Joi.number().required().description(locals['sampleCard'].Post.fieldsDescription.type),
        terms: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        isEnablePortal: Joi.boolean().default(false).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        language: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        facebook: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        twitter: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays)
    }).unknown(false)
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
            if (payload.other?.email!=null && await duplicatCustomer.IsExists(payload.other?.email)) {
                code = 409;
                response.message = "This email Is already Exists";
                return;
            }
            payload = await PostPatchPayload.ObjectPayload(req, 'post');
            const customerResult = await customerCollection.Insert(payload, dbSession);
            let logs = {};
            logs['description'] = `Customer ${payload.other?.email} is added`;
            logs['type'] = "CUSTOMER"
            logs['status'] = true;
            logs['itemId'] = ObjectId("" + customerResult.insertedIds[0]);
            logs['createdBy'] = AuthUser?.userId ? ObjectId(AuthUser.userId) : "",
                logs['createAt'] = moment().format();
            await activityLogCollection.Insert(logs, dbSession);
            code = 200;
            response.message = locals["genericErrMsg"]["200"];
            response.data = customerResult;
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