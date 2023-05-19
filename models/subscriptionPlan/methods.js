
'use strict'

const ObjectID = require('mongodb').ObjectID
const Promise = require("bluebird");
const mongo = Promise.promisifyAll(require('../mongodb'))

const tablename = 'subscriptionPlan'

const Select = async (data, sortBy = {}, porject = {}, skip = 0, limit = 20) => {
    const db = await mongo.get();
    return await db.collection(tablename)
        .find(data)
        .sort(sortBy)
        .project(porject)
        .skip(skip)
        .limit(limit)
        .toArray();
}

const SelectOne = async (data) => {
    const db = await mongo.get();
    return await db.collection(tablename).findOne(data)
};

const SelectById = async (condition, requiredFeild) => {
    const db = await mongo.get();
    condition._id = await ObjectID(condition._id)
    return await db.collection(tablename).findOne(condition, requiredFeild);
}

const Insert = async (data,session) => {
    const db = await mongo.get();
    return await db.collection(tablename).insert(data,{session})
}

const UpdateById = async (_id, data,session) => {
    const db = await mongo.get();
    return await db.collection(tablename).updateOne({ _id: ObjectID(_id) }, { $set: data },{session})
}
const Update = async (condition, data,session) => {
    const db = await mongo.get();
    return await db.collection(tablename).update(condition, { $set: data },{ session })
}

const Aggregate = async (condition) => {
    const db = await mongo.get();
    return await db.collection(tablename).aggregate(condition).toArray();
}

module.exports = {
    Select,
    SelectOne,
    Insert,
    SelectById,
    UpdateById,
    Update,
    Aggregate
}
