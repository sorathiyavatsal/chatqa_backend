let ObjectId = require("mongodb").ObjectId;
const moment = require("moment");
const jwt = require("jsonwebtoken");
const logger = require('winston');
const DBPayload= require('./DBPayload')
const ObjectPayload = async (req, type) => {
  let Payload = JSON.parse(JSON.stringify(req.payload));
  try {
    let authorization = req.headers.authorization.split(" ")[1];
    let user = jwt.decode(authorization);
    for (const key in Payload) {
      if (type === "patch" && (Payload[key] === null)) {
        delete Payload[key];
      }
      if (Array.isArray(Payload[key]) || typeof Payload[key] === 'object') {
        Payload[key]=await DBPayload.ObjectPayload(Payload[key])
      }
      else {
        if (
          key.toLocaleLowerCase()!=="id" && key.toLocaleLowerCase().includes("id") && Payload[key]!=""
        ) {
          Payload[key] = ObjectId(Payload[key]);
        }
      }
    }
    switch (type) {
      case "post":
        Payload["status"] = true;
        Payload["createdBy"] = ObjectId(user.userId);
        Payload["createAt"] = moment().format();
        break;
      case "patch":
        Payload["updatedBy"] = ObjectId(user.userId);
        Payload["updateAt"] = moment().format();
        break;
    }
    return Payload;
  } catch (e) {
    console.log(e);
    logger.error(e.message);
    return Payload;
  }
};

module.exports = { ObjectPayload };
