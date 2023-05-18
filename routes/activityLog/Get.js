'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const activityLogCollection = require('../../models/activitylogs');
const GetPayload =  require('../../library/helper/GetPayload');
const { ObjectId } = require('mongodb');

/**
 * @description get all or specifice category details
 * @property {string} authorization - authorization
 * @property {string} lang - language
 * @property {string} categoryName - for select specific category details
 * @returns 200 : Success
 * @returns 500 : Internal Server Error
 * 
 * @author Jarun Borada
 * @date 02-July-2022
 */

 const validator = Joi.object({
    activityLogId: Joi.string().description(locals['activityLog'].Get.fieldsDescription.activityLogId),
    type:Joi.string().description(locals['activityLog'].Get.fieldsDescription.type).valid("CLOTHE","PARTY","USER","SETTING","CATALOG","PRODUCT","STOCK"),
    status:Joi.boolean().description(locals['activityLog'].Get.fieldsDescription.status),
    itemId: Joi.string().description(locals['activityLog'].Get.fieldsDescription.itemId),
    createdBy: Joi.string().description(locals['activityLog'].Get.fieldsDescription.createId),
    fromDate:Joi.string().description(locals['activityLog'].Get.fieldsDescription.fromDate),
    page: Joi.number().description(locals['activityLog'].Get.fieldsDescription.page),
    limit: Joi.number().description(locals['activityLog'].Get.fieldsDescription.limit),
    toDate:Joi.string().description(locals['activityLog'].Get.fieldsDescription.toDate)
}).unknown();

const handler = async (req, res) => {
    try {
        const activityLogResult = await activityLogCollection.Aggregate(await GetPayload.ObjectPayload(req.query,'activityLog'))
        if (!activityLogResult || !activityLogResult.length) {
            return res.response({
                message: locals["genericErrMsg"]["204"]
            }).code(204);
        }

        return res.response({
            message: locals["genericErrMsg"]["200"], 
            data: activityLogResult
        }).code(200);
    } catch (e) {
        logger.error(e.message)
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