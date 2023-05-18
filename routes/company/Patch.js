'use strict'

const Joi = require('joi');
const logger = require('winston');
const locals = require('../../locales');
let ObjectId = require('mongodb').ObjectId;
const companyCollection = require("../../models/company")
const duplicatCompany = require('./CheckCompanyExists')
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
    type: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.type),
    name: Joi.object().keys({
        english: Joi.string().required(),
        arabic: Joi.string().allow("").allow(null),
        city:Joi.string().allow("").allow(null),
        street:Joi.string().allow("").allow(null),
        postal:Joi.string().allow("").allow(null)
    }).unknown(false),
    email: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
    fax: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
    website: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
    divison: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction).label("City/Sub Division Arabic"),
    CSE: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
    countryCode: Joi.number().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
    country: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
    number: Joi.object().keys({
        phone: Joi.string().allow("").allow(null),
        building: Joi.number().allow("").allow(null),
        Id: Joi.number().allow("").allow(null),
        PI: Joi.number().allow("").allow(null),
        vat: Joi.string().allow("").allow(null)
    }).unknown(false),
    banking: Joi.object().keys({
        name: Joi.string().required(),
        branch: Joi.string().allow("").allow(null),
        account:Joi.string().allow("").allow(null),
        number:Joi.number().allow("").allow(null),
        IBAN:Joi.string().allow("").allow(null)
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
            const companyResult = await companyCollection.Aggregate(
                [{
                    $match: {
                        _id: ObjectId(req.query.cId)
                    }
                },
                { $project: projection }
                ]);
                if (payload.email != null && companyResult.email != payload.email && await duplicatCompany.IsExists(payload.email)) {
                    code = 409;
                    response.message = "This email Is already Exists";
                    return;
                }
            const AuthUser = await GetRequestedUser.User(req.headers.authorization);
            const activitylogs = await ActivityLogs.SampleCardActivityLogs(req.payload, companyResult[0])
            console.log(activitylogs)
            if (false && activitylogs && activitylogs != '') {
                let ActivityLogPayload = await SetDescription.SetDescription(activitylogs)
                ActivityLogPayload["itemId"] = ObjectId(req.query.cId)
                ActivityLogPayload["createdBy"] = ObjectId(AuthUser.userId),
                    ActivityLogPayload["createAt"] = moment().format()
                await logCollection.Insert(ActivityLogPayload);
            }
            const company = await companyCollection.Update({
                _id: ObjectId(req.query.cId)
            }, payload, dbSession);
            code = 200
            response.message = locals["genericErrMsg"]["200"]
            response.data = company
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