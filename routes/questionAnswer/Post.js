'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const questionAnswerCollection = require("../../models/questionAnswer")
const duplicatCustomer = require('./CheckCustomerExists')
const OpenAI = require('../../config/components/OpenAI')
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
    data:Joi.object().required().description(locals['sampleCard'].Post.fieldsDescription.scId)
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
            let payload = req.payload
            if (payload.other?.email!=null && await duplicatCustomer.IsExists(payload.other?.email)) {
                code = 409;
                response.message = "This email Is already Exists";
                return;
            }
            const answer = await OpenAI.createCompletion(payload.data);
            payload = await PostPatchPayload.ObjectPayload(req, 'post');
            payload["answer"]=answer?.data
            console.log(answer.data)
            await questionAnswerCollection.Insert(payload, dbSession);
            code = 200;
            response.message = locals["genericErrMsg"]["200"];
            response.data = answer?.data?.choices;
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
        200: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["200"]), data: Joi.any() }),
        500: Joi.object({ message: Joi.any().default(locals["genericErrMsg"]["500"]) }),
    }
}

module.exports = { validator, response, handler }