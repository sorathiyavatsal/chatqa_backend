const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const PostAPI = require('./Post')
const PatchAPI = require('./Patch')
const GetAPI = require('./Get')
module.exports = [
    {
        method: 'post',
        path: '/company',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["sampleCard"].Post.ApiDescription,
            tags: ['api', 'company'],
            auth: {
                strategies: ['superadmin','admin','user']
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
        path: '/company',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["sampleCard"].Get.ApiDescription,
            tags: ['api', 'company'],
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
        path: '/company',
        handler: PatchAPI.handler,
        config: {
            cors : true,
            description: locals["sampleCard"].Post.ApiDescription,
            tags: ['api', 'company'],
            auth: {
                strategies: ['superadmin','admin','user']
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