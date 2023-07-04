const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const PostAPI = require('./Post')

module.exports = [
    {
        method: 'post',
        path: '/stripe',
        handler: PostAPI.handler,
        config: {
            cors: true,
            description: locals["sampleCard"].Post.ApiDescription,
            tags: ['api', 'userPlan'],
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
        }
    },
]