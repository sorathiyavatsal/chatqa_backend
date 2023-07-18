
const Hapi = require('@hapi/hapi');
require('dotenv').config({ path: './.env' });
const logger = require('winston');
const config = require('./config');
const path = require("path");
const middleware = require('./middleware');
const db = require('./models/mongodb');

const Server = Hapi.Server({
    host: config.server.host,
    port: config.server.port
});
Server.realm.modifiers.route.prefix = "/v1";

const initialize = async () => {
    try {
        await Server.register([
            middleware.good,
            middleware.swagger.inert,
            middleware.swagger.vision,
            middleware.swagger.swagger,
            middleware.auth
        ]);

        Server.route({
            method: "GET",
            path: '/public/{path}',
            config: {
                auth: false,
                cors: { origin: ['*'] },
                handler: {
                    directory: {
                        path: 'public',
                        listing: true
                    }
                }
            }
        })

        Server.route(require('./routes/index'));

        const server = await Server.start();
        if (!server) {
            logger.info(`Server is listening on port - ${config.server.port}`)
        }
        await db.connect()
    } catch (e) {
        logger.error(e.message)
    }
}

initialize();