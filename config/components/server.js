'use strict'

const Joi = require('joi')

const envVarsSchema = Joi.object({ 
    SERVER_PORT: Joi.number().required(),
    AUTH_KEY: Joi.string().required(),
    BASIC_AUTH: Joi.string().required(),
    SERVER_ENVIRONMENT:Joi.string().required(),
    AUTH_ACCESS_EXPIRY_TIME: Joi.string().required(),
    APP_NAME: Joi.string().required()
}).unknown().required()

const { error, value: envVars } =  envVarsSchema.validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const config = {
    server: {
        port: envVars.SERVER_PORT,
        enviroment:envVars.SERVER_ENVIRONMENT
    },
    auth: {
        authKey: envVars.AUTH_KEY,
        basicAuth: envVars.BASIC_AUTH,
        expireTime: envVars.AUTH_ACCESS_EXPIRY_TIME
    },
    app: {
        name: envVars.APP_NAME
    }
}

module.exports = config