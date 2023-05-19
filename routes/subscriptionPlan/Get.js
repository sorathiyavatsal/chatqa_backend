'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const subscriptionPlanCollection = require("../../models/subscriptionPlan")
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
    spId: Joi.string().description(locals['sampleCard'].Get.fieldsDescription.scId),
    page: Joi.number().description(locals['sampleCard'].Get.fieldsDescription.page),
    limit: Joi.number().description(locals['sampleCard'].Get.fieldsDescription.limit),
    status: Joi.boolean().default(true).description(locals['sampleCard'].Get.fieldsDescription.status),
    name: Joi.string().description(locals['users'].Post.fieldsDescription.name),
    amount: Joi.number().description(locals['users'].Post.fieldsDescription.email),
    day: Joi.number().description(locals['signIn'].Post.fieldsDescription.email),
    points:Joi.number().description(locals['users'].Post.fieldsDescription.isActive),
    status: Joi.boolean().description(locals['sampleCard'].Post.fieldsDescription.status),
    active: Joi.boolean().description(locals['sampleCard'].Post.fieldsDescription.status)
}).unknown(false);

const handler = async (req, res) => {
    try {
        const subscriptionPlanResult = await subscriptionPlanCollection.Aggregate(await GetPayload.ObjectPayload(req.query,'subscriptionPlan'))
        if (!subscriptionPlanResult || !subscriptionPlanResult[0]?.subscriptionPlan) {
            return res.response({
                message: locals["genericErrMsg"]["204"]
            }).code(204);
        }
        return res.response({
            message: locals["genericErrMsg"]["200"], 
           data: subscriptionPlanResult[0].subscriptionPlan
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