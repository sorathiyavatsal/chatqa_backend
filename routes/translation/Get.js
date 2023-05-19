'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const customerCollection = require("../../models/translation")
const GetPayload = require('../../library/helper/GetPayload');
/**
 * @description get all or specifice category details
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @property {string} phoneNumber - for select specific user details
 * @property {string} email - for select specific user details
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Jarun Borada
 * @date 11-Dec-2020
 */

const validator = Joi.object({
    cId: Joi.string().description(locals['sampleCard'].Get.fieldsDescription.scId),
    page: Joi.number().description(locals['sampleCard'].Get.fieldsDescription.page),
    limit: Joi.number().description(locals['sampleCard'].Get.fieldsDescription.limit),
    status: Joi.boolean().default(true).description(locals['sampleCard'].Get.fieldsDescription.status)
}).unknown(true);

const handler = async (req, res) => {
    try {
        const customerResult = await customerCollection.Aggregate(await GetPayload.ObjectPayload(req.query,'customer'))
        if (!customerResult || !customerResult[0]?.customer) {
            return res.response({
                message: locals["genericErrMsg"]["204"]
            }).code(204);
        }
        return res.response({
            message: locals["genericErrMsg"]["200"], 
           data: customerResult[0].customer
        }).code(200);
    } catch (e) {
        console.log(e)
        return res.response({
            message: locals["genericErrMsg"]["500"]
        }).code(500);
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