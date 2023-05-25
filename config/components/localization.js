'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
    DEFAULT_LANGUAGE: joi.string().required(),
    LANGUAGES: joi.string().required()
}).unknown().required()

const { error, value: envVars } = envVarsSchema.validate(process.env)

const config = {
    localization: {
        DEFAULT_LANGUAGE: envVars.DEFAULT_LANGUAGE,
        LANGUAGES: envVars.LANGUAGES
    }
}

module.exports = config
