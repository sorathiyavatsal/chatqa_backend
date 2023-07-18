'use strict'

const Joi = require('joi');
const logger = require('winston');
const locals = require('../../locales');
let ObjectId = require('mongodb').ObjectId;
const customerCollection = require("../../models/questionAnswer")
const duplicatCustomer = require('./CheckCustomerExists')
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
    cId: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.scId)
}).unknown(false);

const validator = Joi.object({
    other: Joi.object().keys({
        type: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.type).valid('business', 'individual'),
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
        email: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        phone: Joi.object().keys({
            work: Joi.string().allow("").allow(null),
            mobile: Joi.string().allow("").allow(null)
        }).unknown(false),
    }).unknown(false),
    address: Joi.array().max(2).items(Joi.object({
        attention: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.type),
        country: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.type),
        bNumber: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        sName: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        address: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        aNumber: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        district: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        city: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        state: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        website: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        zipCode: Joi.number().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        phone: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        fax: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
    }).unknown(false)
    ),
    banking: Joi.object().keys({
        currency: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.type),
        balance: Joi.number().required().description(locals['sampleCard'].Post.fieldsDescription.type),
        terms: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        isEnablePortal: Joi.boolean().default(false).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        language: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        facebook: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays),
        twitter: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.totalDays)
    }).unknown(false),
    status: Joi.boolean().description(locals['sampleCard'].Post.fieldsDescription.status),
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
            const customerResult = await customerCollection.Aggregate(
                [{
                    $match: {
                        _id: ObjectId(req.query.cId)
                    }
                },
                { $project: projection }
                ]);
            if (payload.other?.email != null && customerResult.other?.email != payload.other?.email && await duplicatCustomer.IsExists(payload.other?.email)) {
                code = 409;
                response.message = "This email Is already Exists";
                return;
            }
            const AuthUser = await GetRequestedUser.User(req.headers.authorization);
            const activitylogs = await ActivityLogs.SampleCardActivityLogs(req.payload, customerResult[0])
            console.log(activitylogs)
            if (false && activitylogs && activitylogs != '') {
                let ActivityLogPayload = await SetDescription.SetDescription(activitylogs)
                ActivityLogPayload["itemId"] = ObjectId(req.query.cId)
                ActivityLogPayload["createdBy"] = ObjectId(AuthUser.userId),
                    ActivityLogPayload["createAt"] = moment().format()
                await logCollection.Insert(ActivityLogPayload);
            }
            const customer = await customerCollection.Update({
                _id: ObjectId(req.query.cId)
            }, payload, dbSession);
            code = 200
            response.message = locals["genericErrMsg"]["200"]
            response.data = customer
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