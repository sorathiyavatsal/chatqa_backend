const joi = require('joi');
const config = require('../config');
const defaultLan = config.localization.DEFAULT_LANGUAGE;
const locals = require('../locales');
const logger = require('winston');

const headerAuth = joi.object({
    authorization: joi.string().required().description(locals["header"].Authorization),
    language: joi.string().default(defaultLan).description(locals["header"].Language)
}).options({ allowUnknown: true });

const faildAction = (request, h, err) => {
    logger.log('header-error', err.message);
    throw err;
}

const strategiesValidator = (req, strategy) => {
    logger.error("auth strateguiesValidator Error ", "auth strategy not found");
    if (req && req.route && req.route.settings && req.route.settings.auth && req.route.settings.auth.strategies) {
        if (req.route.settings.auth.strategies.includes(strategy)) {
            return false
        } else {
            return { message: locals["genericErrMsg"]["401"], code: 401 }
        }
    } else {
       
        return { message: locals["genericErrMsg"]["500"], code: 500 }
    }
}

module.exports = { headerAuth, faildAction, strategiesValidator };