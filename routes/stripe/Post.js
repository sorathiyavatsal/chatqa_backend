'use strict'

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const logger = require('winston');
const locals = require('../../locales');
const clientDB = require("../../models/mongodb")
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
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
    amount:Joi.number().required().description(locals['users'].Post.fieldsDescription.name),
    id:Joi.string().required().description(locals['users'].Post.fieldsDescription.name)
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
            let { amount, id } = req.payload
            try {
                const payment = await stripe.paymentIntents.create({
                    amount,
                    currency: "INR",
                    description: "abc compony ",
                    payment_method: id,
                    confirm: true
                })
                code = 200
                response.message = "payment successfull "
                response.data = { details: payment }
            } catch (error) {
                code = 500
                response.message = "payment failed "
                response.data = { details: error }
            }
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