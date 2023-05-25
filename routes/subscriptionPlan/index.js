const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const PostAPI = require('./Post')
const PatchAPI = require('./Patch')
const GetAPI = require('./Get')
module.exports = [
    {
        method: 'post',
        path: '/subscriptionPlan',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["sampleCard"].Post.ApiDescription,
            tags: ['api', 'subscriptionPlan'],
            auth: {
                strategies: ['superadmin','admin']
            },
            validate: {
                headers: headerValidator.headerAuth,
                payload: PostAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: PostAPI.response
        }
    },
    {
        method: 'get',
        path: '/subscriptionPlan',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["sampleCard"].Get.ApiDescription,
            tags: ['api', 'subscriptionPlan'],
            auth: {
                strategies: ['superadmin', 'admin','user']
            },
            validate: {
                headers: headerValidator.headerAuth,
                query: GetAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: GetAPI.response
        }
    },
    {
        method: 'patch',
        path: '/subscriptionPlan',
        handler: PatchAPI.handler,
        config: {
            cors : true,
            description: locals["sampleCard"].Post.ApiDescription,
            tags: ['api', 'subscriptionPlan'],
            auth: {
                strategies: ['superadmin','admin']
            },
            validate: {
                headers: headerValidator.headerAuth,
                payload: PatchAPI.validator,
                query:PatchAPI.queryvalidator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
        }
    }

]