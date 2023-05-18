'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const companyCollection = require("../../models/company")
const moment = require('moment');
const { ObjectId } = require('mongodb');
const activityLogCollection = require('../../models/activitylogs');
const GetRequestedUser = require('../../library/helper/GetRequestedUser');
const duplicatCompany = require('./CheckCompanyExists')
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
        type: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.type),
        name: Joi.object().keys({
            english: Joi.string().required(),
            arabic: Joi.string().allow("").allow(null),
            city:Joi.string().allow("").allow(null),
            street:Joi.string().allow("").allow(null),
            postal:Joi.string().allow("").allow(null)
        }).unknown(false),
        email: Joi.string().required().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        fax: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        website: Joi.string().allow("").allow(null).description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
        divison: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction).label("City/Sub Division Arabic"),
        CSE: Joi.string().description(locals['sampleCard'].Post.fieldsDescription.perDayProduction),
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
            name: Joi.string(),
            branch: Joi.string().allow("").allow(null),
            account:Joi.string().allow("").allow(null),
            number:Joi.number().allow("").allow(null),
            IBAN:Joi.string().allow("").allow(null)
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
            if (payload.email!=null && await duplicatCompany.IsExists(payload?.email)) {
                code = 409;
                response.message = "This email Is already Exists";
                return;
            }
            payload = await PostPatchPayload.ObjectPayload(req, 'post');
            const companyResult = await companyCollection.Insert(payload, dbSession);
            let logs = {};
            logs['description'] = `company ${payload.other?.email} is added`;
            logs['type'] = "Company"
            logs['status'] = true;
            logs['itemId'] = ObjectId("" + companyResult.insertedIds[0]);
            logs['createdBy'] = AuthUser?.userId ? ObjectId(AuthUser.userId) : "",
                logs['createAt'] = moment().format();
            await activityLogCollection.Insert(logs, dbSession);
            code = 200;
            response.message = locals["genericErrMsg"]["200"];
            response.data = companyResult;
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