'use strict'

const config = require('../../config');
const logger = require('winston');
const MongoClient = require('mongodb').MongoClient;

let state = { db: null, client: null }

/**
 * Method to connect to the mongodb
 * @param {*} url
 * @returns connection object
 */
exports.connect = async () => {

    if (state.db) {
        return;
    }

    try {
        const db = new MongoClient(config.mongodb.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const connection = await (await db.connect()).db(config.mongodb.db_name)
        if (connection) {
            state.db = connection;
            state.client = db;
            logger.info(`MongoDB connection successfully established to ${config.mongodb.url}`)
        } else {
            state.db = null
        }
    } catch (e) {
        logger.error(e.message);
    }
}

/** 
 * Method to get the connection object of the mongodb
 * @returns db object
 */
exports.get = async () => {
    if (state.db) {
        return await state.db;
    } else {
        try {
            const db = await new MongoClient(config.mongodb.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })

            const connection = await (await db.connect()).db(config.mongodb.db_name)

            if (connection) {
                state.db = await connection;
                return state.db;
            } else {
                state.db = null
            }
        } catch (e) {
            logger.error(e.message);
        }
    }
}

/** 
 * Method to get the connection object of the mongodb
 * @returns db object
 */
exports.getClient = async () => {
    return await state.client;
}

/** 
 * Method to get the connection object of the mongodb
 * @returns db object
 */
exports.close = async () => {
    if (state.db) {
        try {
            await state.db.close()
            state.db = null
            state.mode = null
        } catch (e) {
            logger.error(e.message);
        }
    }
}