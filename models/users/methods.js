'use strict'

const ObjectID = require('mongodb').ObjectID
const Promise = require("bluebird");
const mongo = Promise.promisifyAll(require('../mongodb'))

const tablename = 'users'

const Select = async (data) => {
    const db = await mongo.get();
    return await db.collection(tablename).find(data).toArray();
}

const SelectWithSort = async (data, sortBy = {}, porject = {}, skip = 0, limit = 20) => {
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

const Insert = async (data,session) =>{
    const db = await mongo.get();
    return await db.collection(tablename).insert(data,{ session })
}

const Update = async (condition, data,session) => {
    const db = await mongo.get();
    return await db.collection(tablename).update(condition, { $set: data },{ session })
}

const CustomUpdate =async (condition, data,session) => {
    const db = await mongo.get();
    return await db.collection(tablename).update(condition,  data,{session} )
}


const UpdateById = async (_id, data) => {
    const db = await mongo.get();
    return await db.collection(tablename).update({ _id: ObjectID(_id) }, { $set: data })
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
    Aggregate,
    SelectWithSort,
    Select,
    SelectOne,
    Insert,
    Update,
    CustomUpdate,
    SelectById,
    UpdateById,
    Delete
}
