'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({ 
    MONGO_URL: joi.string().required(),
    DB_NAME: joi.string().required()
}).unknown().required()

const { error, value: envVars } =  envVarsSchema.validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const config = {
    mongodb: {
        url: envVars.MONGO_URL,
        db_name: envVars.DB_NAME
    }
}

module.exports = config