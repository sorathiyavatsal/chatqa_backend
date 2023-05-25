let ObjectId = require("mongodb").ObjectId;
const logger = require('winston');
const ActivityLogs = async (NewPayload, OldPayload) => {
  let description = [];
  try {
    if (Object.keys(NewPayload).length == Object.keys(OldPayload).length) {
      for (var [key, value] of Object.entries(OldPayload)) {
        if (typeof value === 'object' && Object.keys(OldPayload[key]).length>0) {
          //console.log("hello");
          const tempdescription = await ActivityLogs(NewPayload[key], OldPayload[key]);
          if (tempdescription.length > 0) {
            description.push(...tempdescription);
          }
        } else {
          // console.log(typeof NewPayload[key], "----", key)
          if (OldPayload[key].toString() != NewPayload[key]) {
            let log = {};
            if (key.includes('id')) {
              log["key"] = key,
                log["old"] = OldPayload[key].toString(),
                log["new"] = NewPayload[key]
            }
            else {
              let Ids = Object.keys(OldPayload).map(s => {
                if (s.includes('id')) {
                  return s
                }
              })
              if (Ids[0] != undefined) { log[Ids[0]] = OldPayload[Ids[0]].toString() }
              log["key"] = key,
                log["old"] = OldPayload[key].toString(),
                log["new"] = NewPayload[key]
            }
            description.push(log)
          }
        }
      }
    }
    else if (Object.keys(NewPayload).length > Object.keys(OldPayload).length) {
      for (var [key, value] of Object.entries(NewPayload)) {

        if (typeof value === 'object' && Object.keys(NewPayload[key]).length>0) {
          let tempdescription;
          // console.log(OldPayload[key], "----", key)
          if (OldPayload[key] == undefined) {
            tempdescription = await ActivityLogs(NewPayload[key], []);
          }
          else {
            tempdescription = await ActivityLogs(NewPayload[key], OldPayload[key]);
          }
          if (tempdescription.length > 0) {
            description.push(...tempdescription);
          }
        }
        else {
          if (OldPayload[key] === undefined||NewPayload[key] != OldPayload[key].toString()) {
            let log = {};
            if (key.includes('id')) {
              log["key"] = key,
                log["old"] = OldPayload[key] === undefined ?null:OldPayload[key],
                log["new"] = NewPayload[key]
            }
            else {
              let Ids = Object.keys(NewPayload).map(s => {
                if (s.includes('id')) {
                  return s

                }
              })
              if (Ids[0] != undefined) { log[Ids[0]] = NewPayload[Ids[0]] }
              log["key"] = key,
                log["old"] = OldPayload[key] === undefined ?null:OldPayload[key],
                log["new"] = NewPayload[key]
            }
            description.push(log)
          }
        }
      }
    }
    else {
      for (var [key, value] of Object.entries(OldPayload)) {

        if (typeof value === 'object' && !key.includes('id')&& Object.keys(OldPayload[key]).length>0) {
          let tempdescription;
          //console.log(OldPayload[key],"----",key)
          if (NewPayload[key] == undefined) {
            tempdescription = await ActivityLogs([], OldPayload[key]);
          }
          else {
            tempdescription = await ActivityLogs(NewPayload[key], OldPayload[key]);
          }
          if (tempdescription.length > 0) {
            description.push(...tempdescription);
          }
        }
        else {
          if (NewPayload[key] == undefined || NewPayload[key] != OldPayload[key].toString()) {
            let log = {};
            if (key.includes('id')) {
              log["key"] = key,
                log["old"] = OldPayload[key].toString(),
                log["new"] = NewPayload[key] == undefined?null:NewPayload[key]
            }
            else {
              let Ids = Object.keys(OldPayload).map(s => {
                if (s.includes('id')) {
                  return s

                }
              })
              if (Ids[0] != undefined) { log[Ids[0]] = OldPayload[Ids[0]].toString() }
              log["key"] = key,
                log["old"] = OldPayload[key].toString(),
                log["new"] = NewPayload[key] == undefined?null:NewPayload[key]
            }
            description.push(log)
          }
        }
      }
    }
    //console.log(description);
    return description;
  }
  catch (e) {
    console.log(e);
    logger.error(e.message);
    return description;
  }
};

module.exports = { ActivityLogs };
