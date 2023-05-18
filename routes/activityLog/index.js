const headerValidator = require('../../middleware/validator')
const locals = require('../../locales')
const GetAPI = require('./Get')

module.exports = [
    {
        method: 'get',
        path: '/activityLog',
        handler: GetAPI.handler,
        config: {
            cors: true,
            description: locals["activityLog"].Get.ApiDescription,
            tags: ['api', 'activityLog'],
            auth: {
                strategies: ['basic' , 'admin','user']
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
    }
]