const inert = require('@hapi/inert');
const vision = require('@hapi/vision');
const Pack = require('../package');

const swagger = {
    plugin: require('hapi-swagger'),
    'options': {
        grouping: 'tags',
        payloadType: 'form',
        schemes: ["http"]
    }
}

module.exports = { inert, vision, swagger };