'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const userPlanCollection = require("../../models/userPlan");
const usersCollection = require("../../models/users");
const { ObjectId } = require('mongodb');

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
    userId: Joi.string().description(locals['users'].Post.fieldsDescription.name),
}).unknown(false);

const handler = async (req, res) => {
    try {
        const AuthUser = await GetRequestedUser.User(req.headers.authorization)
        const userId = req.query?.userId?ObjectId(req.query?.userId): ObjectId(AuthUser?.userId)
        const userPlan = await userPlanCollection.SelectOne({ userId: userId, status: true, isActive: true })
        const user = await usersCollection.SelectOne({ _id: userId, isSubscribe: false })
        if (!user) {
            return res.response({
                message: locals["genericErrMsg"]["204"]
            }).code(204);
        }
        return res.response({
            message: locals["genericErrMsg"]["200"],
            data: userPlan?.points?userPlan?.totalPoints-userPlan?.points:user?.points
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