let ObjectId = require("mongodb").ObjectId;
const logger = require('winston');
const SetDescription = async (Logs) => {
  let description = "",Payload={};
  try {
    for (let [key, value] of Object.entries(Logs)) {
      if (value.key && value.old && value.new) {
        if((value.key).includes('status'))
        {
          description += value.new?" party added, ":" party removed,";
        }else{
          description += value.key + " change from " + value.old + " to " + value.new + ",";
        }
        
      }
      else if (value.key && !value.old && value.new) {
        description += value.new + " " + value.key + " added,";
      }
      else if (value.key && value.old && !value.new) {
        description += value.old + " " + value.key + " removed,";
      }
    }
    console.log(description);
    Payload["description"]=description
    Payload["type"]="SAMPLE_CARD",
    Payload["status"] = true;
    return Payload;
  }
  catch (e) {
    console.log(e);
    logger.error(e.message);
    return Payload;
  }
};

module.exports = { SetDescription };
