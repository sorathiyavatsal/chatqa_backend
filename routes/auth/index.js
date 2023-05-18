const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const RefreshToken=require('./refreshToken');
const DeleteAPI = require('./DeleteRefreshToken')

module.exports = [
    {
        method: 'post',
        path: '/auth/accessToken',
        handler: RefreshToken.handler,
        config: {
            cors: true,
            description: locals["auth"].Post.ApiDescription,
            tags: ['api', 'auth'],
            auth: "basic",
            validate: {
                headers: headerValidator.headerAuth,
                payload: RefreshToken.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: RefreshToken.response
        }
    },
    {
        method: 'delete',
        path: '/auth/accessToken',
        handler: DeleteAPI.handler,
        config: {
            cors: true,
            description: locals["auth"].Post.ApiDescription,
            tags: ['api', 'auth'],
            auth: "basic",
            validate: {
                headers: headerValidator.headerAuth,
                payload: DeleteAPI.validator,
                failAction: (req, reply, source, error) => {
                    headerValidator.faildAction(req, reply, source, error)
                }
            },
            response: DeleteAPI.response
        }
    }
]
