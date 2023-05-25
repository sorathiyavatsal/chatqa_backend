const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const PostAPI = require('./Post')
const PatchAPI = require('./Patch')
const GetAPI = require('./Get')
const SendUserEmailAPI = require('./SendUserEmail')
const VerifyEmailAPI = require('./VerifyEmailUser')
const ForgotPasswordAPI = require('./forgotPassword');
const SignInAPI = require('./SignIn');
module.exports = [
    {
        method: 'post',
        path: '/signup',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["users"].Post.ApiDescription,
            tags: ['api', 'auth'],
            auth: {
                strategies: ['basic', 'user','admin']
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
            tags: ['api', 'user'],
            auth: {
                strategies: ['basic', 'user', 'admin']
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
                strategies: ['basic','user', 'admin']
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
        path: '/senduseremail',
        handler: SendUserEmailAPI.handler,
        config: {
            cors: true,
            description: locals["signIn"].Post.ApiDescription,
            tags: ['api', 'auth'],
            auth: {
                strategies: ["basic"]
            },
            validate: {
                headers: headerValidator.headerAuth,
                payload: SendUserEmailAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: SendUserEmailAPI.response
        }
    },
    {
        method: 'patch',
        path: '/forgotPassword',
        handler: ForgotPasswordAPI.handler,
        config: {
            cors: true,
            description: locals["signIn"].Post.ApiDescription,
            tags: ['api', 'auth'],
            auth: {
                strategies: ['basic']
            },
            validate: {
                headers: headerValidator.headerAuth,
                payload: ForgotPasswordAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
           // response: ForgotPasswordAPI.response
        }
    },
    {
        method: 'patch',
        path: '/verifyemail',
        handler: VerifyEmailAPI.handler,
        config: {
            cors: true,
            description: locals["signIn"].Post.ApiDescription,
            tags: ['api','auth'],
            auth: {
                strategies: ['basic']
            },
            validate: {
                headers: headerValidator.headerAuth,
                payload: VerifyEmailAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: VerifyEmailAPI.response
        }
    },
    {
        method: 'post',
        path: '/login',
        handler: SignInAPI.handler,
        config: {
            cors: true,
            description: locals["users"].Post.ApiDescription,
            tags: ['api', 'auth'],
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
            response: SignInAPI.response
        }
    }
]