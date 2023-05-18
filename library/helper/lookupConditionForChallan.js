let ObjectId = require("mongodb").ObjectId;
const logger = require('winston');
const getlookupCondition = async (type) => {
  try {
    let condition = [];
    if (type == "jobWorks") {
      condition.push(
        {
          $lookup: {
            from: "partys",
            localField: "partyId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  shortName:1
                },
              },
            ],
            as: "party",
          }
        },
        {
          $lookup: {
            from: "challanName",
            localField: "nameId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  address:1
                },
              },
            ],
            as: "cName",
          }
        },
        { $unwind: { path: "$party", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$cName", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "item",
          }
        },
        { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
            ],
            as: "createdBy",
          }
        }, { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            "createdBy": "$createdBy.name",
          }
        },
        { $unwind: { path: "$work", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "clothes",
            localField: "work.clotheId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "work.clothe",
          }
        },
        {
          $lookup: {
            from: "description",
            localField: "work.descriptionId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "work.description",
          }
        },
        {
          $lookup: {
            from: "fabricColors",
            localField: "work.fabricColorId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  colorName: 1,
                  //status: 1,
                },
              },
            ],
            as: "work.fabricColor",
          }
        },
        {
          $lookup: {
            from: "challanRemarks",
            localField: "work.remarkId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "work.remark",
          }
        },
        { $unwind: { path: "$work.clothe", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$work.fabricColor", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$work.remark", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$work.description", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            jobNo: { $first: "$jobNo", },
            cName: { $first: "$cName" },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            type: { $first: "$type", },
            work: { $push: "$work", },
            PCNo: { $first: "$PCNo", },
            card: { $first: "$card", },
            TPM: { $first: "$TPM" },
            rate: { $first: "$rate", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            totalAmount: { $first: "$totalAmount" },
            party: { $first: "$party", },
            item: { $first: "$item", },
          }
        },
        {
          $project: {
            "partyId": 0,
            "nameId":0,
            "itemId": 0,
            "works.clotheId": 0,
            "works.fabricColorId": 0,
            "works.remarkId": 0,
          }
        }
      )
    }
    else if (type == "challan") {
      condition.push(
        {
          $lookup: {
            from: "partys",
            localField: "partyId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  shortName:1
                },
              },
            ],
            as: "party",
          }
        },
        {
          $lookup: {
            from: "clothes",
            localField: "clotheId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "clothe",
          }
        },
        { $unwind: { path: "$clothe", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$party", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
            ],
            as: "createdBy",
          }
        }, { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            "createdBy": "$createdBy.name",
          }
        },
        { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "items.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "items.item",
          }
        },
        { $unwind: { path: "$items.item", preserveNullAndEmptyArrays: true } },
        {
          $sort: {
            "items.srNo": 1
          }
        },
        {
          $group: {
            _id: "$_id",
            challanNo: { $first: "$challanNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            type: { $first: "$type", },
            address: { $first: "$address", },
            name: { $first: "$name" },
            PCNo: { $first: "$PCNo", },
            cardNo: { $first: "$cardNo", },
            TPM: { $first: "$TPM" },
            items: { $push: "$items" },
            fabricColors: { $first: "$fabricColors", },
            totalRate: { $first: "$totalRate" },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            totalAmount: { $first: "$totalAmount" },
            party: { $first: "$party", },
            clothe: { $first: "$clothe", },
          }

        },
        { $unwind: { path: "$fabricColors", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "fabricColors",
            localField: "fabricColors.fabricColorId",
            foreignField: "_id",
            pipeline: [{ $project: { colorName: 1 } }],
            as: "fabricColors.fabricColor",
          }
        },
        { $unwind: { path: "$fabricColors.fabricColor", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type", },
            challanNo: { $first: "$challanNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            address: { $first: "$address", },
            name: { $first: "$name" },
            PCNo: { $first: "$PCNo", },
            cardNo: { $first: "$cardNo", },
            TPM: { $first: "$TPM" },
            items: { $first: "$items" },
            fabricColors: { $push: "$fabricColors", },
            totalRate: { $first: "$totalRate" },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            totalAmount: { $first: "$totalAmount" },
            party: { $first: "$party", },
            clothe: { $first: "$clothe", },
          }

        },
        {
          $project: {
            "fabricColors.fabricColorId": 0,
            "items.itemId": 0,
            "clotheId": 0,
            "partyId": 0
          }
        },
        // {
        //   $facet: {
        //     saree: [
        //       {
        //         $match: {
        //           "type": "saree",
        //         }
        //       },
        //       { $count: "total" }
        //     ],
        //     lump: [
        //       {
        //         $match: {
        //           "type": "lump",
        //         }
        //       },
        //       { $count: "total" }
        //     ],
        //     dress: [
        //       {
        //         $match: {
        //           "type": "dress",
        //         }
        //       },
        //       { $count: "total" }
        //     ],
        //     challan: [
        //       {
        //         $sort: {
        //           invoiceNo: -1,
        //         },
        //       },
        //       {
        //         $group: {
        //           _id: null,
        //           count: { $sum: 1 },
        //           challan: { $push: "$$ROOT" },
        //         },
        //       },
        //       {
        //         $project: {
        //           _id: 0,
        //           count: 1,
        //           challan: { $slice: ["$challan", start, limit] },
        //         },
        //       }
        //     ],
        //   }
        // },
        // { $unwind: { path: "$saree", preserveNullAndEmptyArrays: true } },
        // { $unwind: { path: "$lump", preserveNullAndEmptyArrays: true } },
        // { $unwind: { path: "$dress", preserveNullAndEmptyArrays: true } },
        // { $unwind: { path: "$challan", preserveNullAndEmptyArrays: true } },
        // {
        //   $project: {
        //     saree:"$saree.total",
        //     lump:"$lump.total",
        //     dress:"$dress.total",
        //     challan: "$challan"
        //   }
        // },
        // {
        //   $addFields: {
        //     "challan.saree":{
        //       $cond: { if: { $gte: [ "$saree", 1 ] }, then: "$saree", else: 0 }
        //     },
        //     "challan.lump":{
        //       $cond: { if: { $gte: [ "$lump", 1 ] }, then: "$lump", else: 0 }
        //     },
        //     "challan.dress":{
        //       $cond: { if: { $gte: [ "$dress", 1 ] }, then: "$dress", else: 0 }
        //     }
        //   }
        // },
        // {
        //   $project: {
        //     challan: 1
        //   }
        // }
      )
    }
    return condition;
  } catch (e) {
    console.log(e);
    logger.error(e.message);
    return type;
  }
};

module.exports = { getlookupCondition };
