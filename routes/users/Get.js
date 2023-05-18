'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const jwt = require('jsonwebtoken');
const usersCollection = require("../../models/users")
const GetPayload = require('../../library/helper/GetPayload');
const { ObjectId } = require('mongodb');
const { auth } = require('../../config/components/server');
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
    name: Joi.string().description(locals['users'].Get.fieldsDescription.name),
    phoneNumber: Joi.string().description(locals['users'].Get.fieldsDescription.phoneNumber),
    email: Joi.string().description(locals['users'].Get.fieldsDescription.email),
    page: Joi.number().description(locals['users'].Get.fieldsDescription.page),
    limit: Joi.number().description(locals['users'].Get.fieldsDescription.limit),
    isActive:Joi.boolean().description(locals['users'].Post.fieldsDescription.isActive),
    role: Joi.string().description(locals['users'].Post.fieldsDescription.role),
    status: Joi.boolean().default(true).description(locals['users'].Get.fieldsDescription.status),
    userId: Joi.string().description(locals['users'].Get.fieldsDescription.userId)
}).unknown(false);

const handler = async (req, res) => {
    try {
        const payload = req.query
        const limit = payload.limit ? payload.limit : 20
        const start = payload.page ? ((payload.page - 1) * limit) : 0

        let authorization = req.headers.authorization.split(' ')[1]
        let user = jwt.decode(authorization)

        const condition = []

        if (payload.isActive==true||payload.isActive==false) {
            condition.push({
                $match: {
                    isActive: payload.isActive
                }
            })
        }
        if (payload.role) {
            condition.push({
                $match: {
                    role: { $in: payload.role.split(",") }
                }
            })
        }

        if (payload.name) {
            condition.push({
                $match: {
                    name: payload.name
                }
            })
        } if (payload.phoneNumber) {
            condition.push({
                $match: {
                    phoneNumber: payload.phoneNumber
                }
            })
        } if (payload.status == true || payload.status == false) {
            condition.push({
                $match: {
                    status: payload.status
                }
            })
        } 
        if (payload.userId) {
            condition.push({
                $match: {
                    _id: ObjectId(payload.userId)
                }
            })
        } 
        else 
        {
            condition.push(
                {
                $match: {
                    _id: { $not: { $in: [ObjectId(user.userId)] } }
                }
            },
            {
                $match: {
                    email: { $not: { $in: ["boradajarun7575@gmail.com"] } }
                }
            }
            )
        }

        condition.push(
            {
                $sort: {
                    _id: -1
                }
            },
            {
                $group: {
                    _id: 0,
                    count: { $sum: 1 },
                    users: { $push: '$$ROOT' },
                }
            }, {
            $project: {
                _id: 0,
                count: 1,
                users: { $slice: ['$users', start, limit] },
            },
        })
        console.log(condition)
        const users = await usersCollection.Aggregate(condition);
        if (!users || !users[0]?.users?.length) {
            return res.response({
                message: "user not found"
            }).code(204);
        }
        return res.response({
            message: locals["genericErrMsg"]["200"],
            data: users[0]
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