let ObjectId = require("mongodb").ObjectId;
const logger = require('winston');
const ObjectPayload = async (payload) => {
  try {
    let Payload = payload;
    for (const key in Payload) {
      if (Array.isArray(Payload[key]) || typeof Payload[key] === 'object') {
        Payload[key]= await ObjectPayload(Payload[key])
      }
      else {
        if (
          (["id", "transactionId"].indexOf(key) <= -1 && key.toLocaleLowerCase().includes("id")&&Payload[key]!="") || Number.isInteger(parseInt(key))
        ) {
          Payload[key] = ObjectId(Payload[key]);
        }
      }
    }
    return Payload;
  } catch (e) {
    console.log(e);
    logger.error(e.message);
    return payload;
  }
};

module.exports = { ObjectPayload };
