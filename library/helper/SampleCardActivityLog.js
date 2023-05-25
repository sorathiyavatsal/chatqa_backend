let ObjectId = require("mongodb").ObjectId;
const logger = require('winston');
const ActivityLogs = require('./ActivityLog')
const SampleCardActivityLogs = async (NewPayload, OldPayload) => {
  let description = [];
  try {
    if (Object.keys(NewPayload).length == Object.keys(OldPayload).length) {
      for (let [key, value] of Object.entries(OldPayload)) {
       /*give key name from where you want to stop the inner funcation calling
           {
            field1:"Value",
            field1:"Value",
            field3:["value","value"]
            } 
            give field3 in place of number
            */
        if (typeof value === 'object' && key!= 'designCodeId' &&value?.area===undefined && value?.fabricColorId===undefined && Object.keys(OldPayload[key]).length>0) {
          
          const tempdescription = await SampleCardActivityLogs(NewPayload[key],OldPayload[key]);
          if (tempdescription.length > 0) {
            description.push(...tempdescription);
          }
        } else {
          let log = {};
          let Ids = Object.keys(OldPayload).map(s => {
            if (s=="number") {
              return s
            }
          })
          if(value?.area!=undefined)
          {
            let temp=await ActivityLogs.ActivityLogs(NewPayload[key],OldPayload[key])
            if(value?.area!=undefined && temp){
              let tempdesription=temp.map(item=>{
              let a=item;
                a["number"]=parseInt(key)+1 ;
                return a
              });
              return tempdesription;
            }
          }
          else if(typeof NewPayload[key] === 'object'&& ( key =="designCodeId"||value?.fabricColorId!=undefined)){
            let temp=await SampleCardActivityLogs(NewPayload[key],OldPayload[key]==undefined?[]:OldPayload[key])
            if(temp && (Ids[0] != undefined||value?.fabricColorId))
            {
              description.push(...temp.map(item=>{
                let a=item
                if(Ids[0]){
                  a[Ids[0]]=NewPayload[Ids[0]]==undefined? OldPayload[Ids[0]]:NewPayload[Ids[0]];
                }else{
                  a['fabricColorId']=value?.fabricColorId.toString();
                }
                return a
              }))
            }
          }
          else if (OldPayload[key].toString() != NewPayload[key]) {
            if (key.includes('id')) {
              log["key"] = key
                log["old"] = OldPayload[key]
                log["new"] = NewPayload[key]
            }
            else {
              
              if (Ids[0] != undefined) { log[Ids[0]] = NewPayload[Ids[0]]==undefined? OldPayload[Ids[0]]:NewPayload[Ids[0]]  }
              log["key"] = key
                log["old"] = OldPayload[key].toString()
                log["new"] = NewPayload[key]

            }
            description.push(log)
          }
        }
      }
    }
    else if (Object.keys(NewPayload).length > Object.keys(OldPayload).length) {
      /*give key name from where you want to stop the inner funcation calling
           {
            field1:"Value",
            field1:"Value",
            field3:["value","value"]
            } 
            give field3 in place of number
            */
      for (let [key, value] of Object.entries(NewPayload)) {
        if (typeof value === 'object' && key!= 'designCodeId' && value?.area===undefined && value?.fabricColorId===undefined&& Object.keys(NewPayload[key]).length>0) {
          let tempdescription;
          if (OldPayload[key] == undefined) {
            tempdescription = await SampleCardActivityLogs(NewPayload[key], []);
          }
          else {
            tempdescription = await SampleCardActivityLogs(NewPayload[key], OldPayload[key]);
          }
          if (tempdescription.length > 0) {
            description.push(...tempdescription);
          }
        }
        else {
          let Ids = Object.keys(NewPayload).map(s => {
            if (s=="number") {
              return s

            }
          })
          let log = {};
          if(value?.area!=undefined)
          {
            let temp=await ActivityLogs.ActivityLogs(NewPayload[key],OldPayload[key]==undefined?[]:OldPayload[key])
            if(value?.area!=undefined && temp){
              let tempdesription=temp.map(item=>{
                let a=item;
                a["number"]=parseInt(key)+1 ;
                return a
              });
              return tempdesription;
            }
          }
          else if(typeof NewPayload[key] === 'object'&& ( key =="designCodeId"||value?.fabricColorId!=undefined)){
            let temp=await SampleCardActivityLogs(NewPayload[key],OldPayload[key]==undefined?[]:OldPayload[key])
            if(temp && (Ids[0] != undefined||value?.fabricColorId))
            {
              description.push(...temp.map(item=>{
                let a=item
                if(Ids[0]){
                  a[Ids[0]]=NewPayload[Ids[0]]==undefined? OldPayload[Ids[0]]:NewPayload[Ids[0]];
                }else{
                  a['fabricColorId']=value?.fabricColorId.toString();
                }
                return a
              }))
            }
          }
          else if (OldPayload[key] === undefined||NewPayload[key] != OldPayload[key].toString()) {
           
            if (key.includes('id')) {
              log["key"] = key
                log["old"] = OldPayload[key] === undefined ?null:OldPayload[key]
                log["new"] = NewPayload[key]
            }
            else {
              
              if (Ids[0] != undefined) { log[Ids[0]] = NewPayload[Ids[0]] }
              log["key"] = key
                log["old"] = OldPayload[key] === undefined ?null:OldPayload[key]
                log["new"] = NewPayload[key]
            }
            description.push(log)
          }
        }
      }
    }
    else {
      for (let [key, value] of Object.entries(OldPayload)) {
        /*give key name from where you want to stop the inner funcation calling
           {
            field1:"Value",
            field1:"Value",
            field3:["value","value"]
            } 
            give field3 in place of number
            */
        if (typeof value === 'object' && key!= 'designCodeId' && value?.area===undefined && value?.fabricColorId===undefined && Object.keys(OldPayload[key]).length>0) {
          let tempdescription;
          if (NewPayload[key] == undefined) {
            tempdescription = await SampleCardActivityLogs([], OldPayload[key]);
          }
          else {
            tempdescription = await SampleCardActivityLogs(NewPayload[key], OldPayload[key]);
          }
          if (tempdescription.length > 0) {
            description.push(...tempdescription);
          }
        }
        else {
          let log = {};
          let Ids = Object.keys(OldPayload).map(s => {
            /*give key name for identification of the documentation Ex
           {
            field1:"Value",
            field1:"Value",
            } 
            give field1 in place of number
            */
            if (s=="number") 
            {
              return s

            }
          })
          if(value?.area!=undefined)
          {
            let temp=await ActivityLogs.ActivityLogs(NewPayload[key]==undefined?[]:NewPayload[key],OldPayload[key])
            if(value?.area!=undefined && temp){
              let tempdesription=temp.map(item=>{
                let a=item;
                a["number"]=parseInt(key)+1 ;
                return a
              });
              return tempdesription;
            }
          }
          else if(typeof OldPayload[key] === 'object'&& ( key =="designCodeId"||value?.fabricColorId!=undefined)){
            let temp=await SampleCardActivityLogs(NewPayload[key]==undefined?[]:NewPayload[key],OldPayload[key])
            if(temp && (Ids[0] != undefined||value?.fabricColorId))
            {
              description.push(...temp.map(item=>{
                let a=item
                if(Ids[0]){
                  a[Ids[0]]=NewPayload[Ids[0]]==undefined? OldPayload[Ids[0]]:NewPayload[Ids[0]];
                }else{
                  a['fabricColorId']=value?.fabricColorId.toString();
                }
                return a
              }))
            }
          }
          else if (NewPayload[key] == undefined || NewPayload[key] != OldPayload[key].toString()) {
            if (key.includes('id')) {
              log["key"] = key
                log["old"] = OldPayload[key].toString()
                log["new"] = NewPayload[key] == undefined?null:NewPayload[key]
            }
            else {
              if (Ids[0] != undefined) { log[Ids[0]] =  NewPayload[Ids[0]]==undefined? OldPayload[Ids[0]]:NewPayload[Ids[0]] }
              log["key"] = key
                log["old"] = OldPayload[key].toString()
                log["new"] = NewPayload[key] == undefined?null:NewPayload[key]
            }
            description.push(log)
          }
        }
      }
    }
    return description;
  }
  catch (e) {
    console.log(e);
    logger.error(e.message);
    return description;
  }
};
 
module.exports = { SampleCardActivityLogs };
