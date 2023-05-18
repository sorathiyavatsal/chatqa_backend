'use strict'

const Promise = require("bluebird");
const mongo = Promise.promisifyAll(require('../mongodb'))

const tablename = 'activitylogs'

const SelectOne = async (data) => {
    const db = await mongo.get();
    return await db.collection(tablename).findOne(data)
};

const Select = async (data) => {
    const db = await mongo.get();
    return await db.collection(tablename).find(data).toArray();
}

const Insert = async (data, session) => {
    const db = await mongo.get();
    return await db.collection(tablename).insert(data, { session })
}

const Update = async (condition, data, session) => {
    const db = await mongo.get();
    return await db.collection(tablename).update(condition, { $set: data }, { session })
}
const Delete = async (condition) => {
    const db = await mongo.get();
    return await db.collection(tablename).remove(condition);
}

const Aggregate = async (condition) => {
    const db = await mongo.get();
    return await db.collection(tablename).aggregate(condition).toArray();
}

module.exports = {
    Select,
    SelectOne,
    Insert,
    Update,
    Delete,
    Aggregate
}