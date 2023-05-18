const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const PostAPI = require('./Post')
const PatchAPI = require('./Patch')
const GetAPI = require('./Get')
const SignInAPI = require('./SignIn')
module.exports = [
    {
        method: 'post',
        path: '/register',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["users"].Post.ApiDescription,
            tags: ['api', 'users'],
            auth: {
                strategies: ['basic','superadmin', 'admin','user']
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
        path: '/user',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["users"].Get.ApiDescription,
            tags: ['api', 'users'],
            auth: {
                strategies: ['basic','superadmin', 'admin','user']
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
        path: '/user',
        handler: PatchAPI.handler,
        config: {
            cors : true,
            description: locals["users"].Post.ApiDescription,
            tags: ['api', 'users'],
            auth: {
                strategies: ['basic','superadmin', 'admin','user']
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
    },
    {
        method: 'post',
        path: '/user/login',
        handler: SignInAPI.handler,
        config: {
            cors: true,
            description: locals["users"].Post.ApiDescription,
            tags: ['api', 'users'],
            auth: {
                strategies: ['basic']
            },
            validate: {
                headers: headerValidator.headerAuth,
                payload: SignInAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            //response: SignInAPI.response
        }
    }
]