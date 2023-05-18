let ObjectId = require("mongodb").ObjectId;
const logger = require('winston');
const getlookupCondition = async (type, start, limit) => {
  try {
    let condition = [];
    if (type === "sampleCard") {
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
                  //status: 1,
                },
              },
            ],
            as: "party",
          }
        },
        {

          $lookup: {
            from: "employee",
            localField: "puncherId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "puncher",
          }
        },
        {

          $lookup: {
            from: "employee",
            localField: "designerId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "designer",
          }
        },
        {
          $lookup: {
            from: "clothes",
            localField: "clotheId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "clothe",
          }
        },
        {
          $lookup: {
            from: "clothePartys",
            localField: "clothePartyId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "clotheParty",
          }
        },
        { $unwind: { path: "$party", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$puncher", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$designer", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$clothe", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$clotheParty", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$fabricColors", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$fabricColors.needles", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "designCodes",
            localField: "fabricColors.needles.designCodeId1",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  designCode: 1,
                  //status: 1,
                },
              },
            ],
            as: "designCode1",
          },
        },
        {
          $lookup: {
            from: "designCodes",
            localField: "fabricColors.needles.designCodeId2",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  designCode: 1,
                  //status: 1,
                },
              },
            ],
            as: "designCode2",
          },
        },
        { $unwind: { path: "$designCode1", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$designCode2", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            "fabricColors.needles.designCodeId1": "$designCode1",
            "fabricColors.needles.designCodeId2": "$designCode2",
          }
        },
        {
          $group: {
            _id: {
              id: "$_id",
              fabricColor_Id: "$fabricColors._id"
            },
            invoiceNo: { $first: "$invoiceNo", },
            cardNo: { $first: "$cardNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            challanNo: { $first: "$challanNo", },
            TPPM: { $first: "$TPPM", },
            CM: { $first: "$CM", },
            height: { $first: "$height", },
            totalProduction: { $first: "$totalProduction", },
            perDayProduction: { $first: "$perDayProduction", },
            totalDays: { $first: "$totalDays", },
            image: { $first: "$image", },
            type: { $first: "$type", },
            spacing: { $first: "$spacing" },
            srNo:{ $first: "$fabricColors.srNo", },
            PM: { $first: "$fabricColors.PM", },
            fabricColorId: {
              $first: "$fabricColors.fabricColorId"
            },
            fabricColorsNiddles: {
              $push: "$fabricColors.needles",
            },
            needlesHead: { $first: "$needlesHead" },
            clothes: { $first: "$clothes", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            party: { $first: "$party", },
            puncher: { $first: "$puncher", },
            designer: { $first: "$designer", },
            workType: { $first: "$workType" },
            clothe: { $first: "$clothe", },
            clotheParty: { $first: "$clotheParty", },
            // fabricColor: { $first: "$fabricColor" },
          }
        },
        {
          $lookup: {
            from: "fabricColors",
            localField: "fabricColorId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  colorName: 1,
                  //status: 1,
                },
              },
            ],
            as: "fabricColor",
          }
        },
        { $unwind: { path: "$fabricColor", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: "$_id.id",
            invoiceNo: 1,
            cardNo: 1,
            designNo: 1,
            date: 1,
            challanNo: 1,
            TPPM: 1,
            CM: 1,
            height: 1,
            totalProduction: 1,
            perDayProduction: 1,
            totalDays: 1,
            spacing: 1,
            image: 1,
            type: 1,
            fabricColors: {
              fabricColorId: "$fabricColor",
              PM: "$PM",
              srNo:"$srNo",
              _id: "$_id.fabricColor_Id",
              niddles: "$fabricColorsNiddles"
            },
            needlesHead: 1,
            clothes: 1,
            status: 1,
            createdBy: 1,
            createAt: 1,
            updateAt: 1,
            updatedBy: 1,
            party: 1,
            puncher: 1,
            workType: 1,
            designer: 1,
            clothe: 1,
            clotheParty: 1
          }
        },
        {
          $sort: {
            "fabricColors.srNo": 1
          }
        },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            cardNo: { $first: "$cardNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            challanNo: { $first: "$challanNo", },
            TPPM: { $first: "$TPPM", },
            CM: { $first: "$CM", },
            height: { $first: "$height", },
            totalProduction: { $first: "$totalProduction", },
            perDayProduction: { $first: "$perDayProduction", },
            totalDays: { $first: "$totalDays", },
            image: { $first: "$image", },
            type: { $first: "$type", },
            fabricColors: {
              $push: "$fabricColors",
            },
            needlesHead: { $first: "$needlesHead" },
            clothes: { $first: "$clothes", },
            spacing: { $first: "$spacing" },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            party: { $first: "$party", },
            puncher: { $first: "$puncher", },
            workType: { $first: "$workType" },
            designer: { $first: "$designer", },
            clothe: { $first: "$clothe", },
            clotheParty: { $first: "$clotheParty", },
            // fabricColor: { $first: "$fabricColor" },
          }
        },
        { $unwind: { path: "$clothes", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "clothes.itemId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "item",
          }
        },
        { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            "clothes.item": "$item",
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
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
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            cardNo: { $first: "$cardNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            challanNo: { $first: "$challanNo", },
            TPPM: { $first: "$TPPM", },
            CM: { $first: "$CM", },
            height: { $first: "$height", },
            totalProduction: { $first: "$totalProduction", },
            perDayProduction: { $first: "$perDayProduction", },
            totalDays: { $first: "$totalDays", },
            image: { $first: "$image", },
            type: { $first: "$type", },
            fabricColors: {
              $first: "$fabricColors",
            },
            needlesHead: { $first: "$needlesHead" },
            spacing: { $first: "$spacing" },
            clothes: { $push: "$clothes", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            party: { $first: "$party", },
            puncher: { $first: "$puncher", },
            workType: { $first: "$workType" },
            designer: { $first: "$designer", },
            clothe: { $first: "$clothe", },
            clotheParty: { $first: "$clotheParty", }
            // fabricColor: { $first: "$fabricColor" },
          }
        },


        {
          $facet: {
            saree: [
              {
                $match: {
                  "type": "saree",
                }
              },
              { $count: "total" }
            ],
            lump: [
              {
                $match: {
                  "type": "lump",
                }
              },
              { $count: "total" }
            ],
            dress: [
              {
                $match: {
                  "type": "dress",
                }
              },
              { $count: "total" }
            ],
            sampleCard: [
              {
                $sort: {
                  invoiceNo: -1,
                },
              },
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                  sampleCard: { $push: "$$ROOT" },
                },
              },
              {
                $project: {
                  _id: 0,
                  count: 1,
                  sampleCard: { $slice: ["$sampleCard", start, limit] },
                },
              }
            ]
          }
        },
        { $unwind: { path: "$saree", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$lump", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$dress", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$sampleCard", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            saree: "$saree.total",
            lump: "$lump.total",
            dress: "$dress.total",
            sampleCard: "$sampleCard"
          }
        },
        {
          $addFields: {
            "sampleCard.saree": {
              $cond: { if: { $gte: ["$saree", 1] }, then: "$saree", else: 0 }
            },
            "sampleCard.lump": {
              $cond: { if: { $gte: ["$lump", 1] }, then: "$lump", else: 0 }
            },
            "sampleCard.dress": {
              $cond: { if: { $gte: ["$dress", 1] }, then: "$dress", else: 0 }
            }
          }
        },
        {
          $project: {
            sampleCard: 1
          }
        }
      )
    }
    else {
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
                  //status: 1,
                },
              },
            ],
            as: "party",
          }
        },
        {

          $lookup: {
            from: "foilColors",
            localField: "work.foilId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "work.foilColor",
          }
        },
        {
          $lookup: {
            from: "clothes",
            localField: "clotheId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "clothe",
          }
        },
        {
          $lookup: {
            from: "clothePartys",
            localField: "clothePartyId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "clotheParty",
          }
        },
        { $unwind: { path: "$party", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$clothe", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$work.foilColor", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$clotheParty", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$fabricColors", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$fabricColors.needles", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "designCodes",
            localField: "fabricColors.needles.designCodeId1",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  designCode: 1,
                  //status: 1,
                },
              },
            ],
            as: "designCode1",
          },
        },
        {
          $lookup: {
            from: "designCodes",
            localField: "fabricColors.needles.designCodeId2",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  designCode: 1,
                  //status: 1,
                },
              },
            ],
            as: "designCode2",
          },
        },
        { $unwind: { path: "$designCode1", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$designCode2", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            "fabricColors.needles.designCodeId1": "$designCode1",
            "fabricColors.needles.designCodeId2": "$designCode2",
          }
        },
        {
          $group: {
            _id: {
              id: "$_id",
              fabricColor_Id: "$fabricColors._id"
            },
            invoiceNo: { $first: "$invoiceNo", },
            cardNo: { $first: "$cardNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            challanNo: { $first: "$challanNo", },
            TPPM: { $first: "$TPPM", },
            CM: { $first: "$CM", },
            height: { $first: "$height", },
            totalProduction: { $first: "$totalProduction", },
            perDayProduction: { $first: "$perDayProduction", },
            totalDays: { $first: "$totalDays", },
            image: { $first: "$image", },
            type: { $first: "$type", },
            spacing: { $first: "$spacing" },
            srNo:{ $first: "$fabricColors.srNo", },
            PM: { $first: "$fabricColors.PM", },
            head: { $first: "$fabricColors.head", },
            frame: { $first: "$fabricColors.frame", },
            fabricColorId: {
              $first: "$fabricColors.fabricColorId"
            },
            fabricColorsNiddles: {
              $push: "$fabricColors.needles",
            },
            needlesHead: { $first: "$needlesHead" },
            clothes: { $first: "$clothes", },
            work: { $first: "$work", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            party: { $first: "$party", },
            clothe: { $first: "$clothe", },
            clotheParty: { $first: "$clotheParty", },
            // fabricColor: { $first: "$fabricColor" },
          }
        },
        {
          $lookup: {
            from: "fabricColors",
            localField: "fabricColorId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  colorName: 1,
                  //status: 1,
                },
              },
            ],
            as: "fabricColor",
          }
        },
        { $unwind: { path: "$fabricColor", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: "$_id.id",
            invoiceNo: 1,
            cardNo: 1,
            designNo: 1,
            date: 1,
            challanNo: 1,
            TPPM: 1,
            CM: 1,
            height: 1,
            totalProduction: 1,
            perDayProduction: 1,
            totalDays: 1,
            spacing: 1,
            image: 1,
            type: 1,
            fabricColors: {
              srNo:"$srNo",
              fabricColorId: "$fabricColor",
              PM: "$PM",
              head: "$head",
              frame: "$frame",
              _id: "$_id.fabricColor_Id",
              niddles: "$fabricColorsNiddles"
            },
            needlesHead: 1,
            clothes: 1,
            work:{
              handWork:1,
              extra:1,
              billNo:1,
              foilColor:"$work.foilColor"
            },
            status: 1,
            createdBy: 1,
            createAt: 1,
            updateAt: 1,
            updatedBy: 1,
            party: 1,
            clothe: 1,
            clotheParty: 1
          }
        },
        {
          $sort: {
            "fabricColors.srNo": 1
          }
        },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            cardNo: { $first: "$cardNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            challanNo: { $first: "$challanNo", },
            TPPM: { $first: "$TPPM", },
            CM: { $first: "$CM", },
            height: { $first: "$height", },
            totalProduction: { $first: "$totalProduction", },
            perDayProduction: { $first: "$perDayProduction", },
            totalDays: { $first: "$totalDays", },
            image: { $first: "$image", },
            type: { $first: "$type", },
            fabricColors: {
              $push: "$fabricColors",
            },
            needlesHead: { $first: "$needlesHead" },
            clothes: { $first: "$clothes", },
            spacing: { $first: "$spacing" },
            work: { $first: "$work", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            party: { $first: "$party", },
            clothe: { $first: "$clothe", },
            clotheParty: { $first: "$clotheParty", },
            // fabricColor: { $first: "$fabricColor" },
          }
        },
        { $unwind: { path: "$clothes", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "clothes.itemId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "item",
          }
        },
        { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            "clothes.item": "$item",
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
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
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            cardNo: { $first: "$cardNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            challanNo: { $first: "$challanNo", },
            TPPM: { $first: "$TPPM", },
            CM: { $first: "$CM", },
            height: { $first: "$height", },
            totalProduction: { $first: "$totalProduction", },
            perDayProduction: { $first: "$perDayProduction", },
            totalDays: { $first: "$totalDays", },
            image: { $first: "$image", },
            type: { $first: "$type", },
            fabricColors: {
              $first: "$fabricColors",
            },
            needlesHead: { $first: "$needlesHead" },
            spacing: { $first: "$spacing" },
            work: { $first: "$work" },
            clothes: { $push: "$clothes", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            party: { $first: "$party", },
            clothe: { $first: "$clothe", },
            clotheParty: { $first: "$clotheParty", },
            // fabricColor: { $first: "$fabricColor" },
          }
        },
        
        {
          $facet: {
            saree: [
              {
                $match: {
                  "type": "saree",
                }
              },
              { $count: "total" }
            ],
            lump: [
              {
                $match: {
                  "type": "lump",
                }
              },
              { $count: "total" }
            ],
            dress: [
              {
                $match: {
                  "type": "dress",
                }
              },
              { $count: "total" }
            ],
            matchingCard: [
              {
                $sort: {
                  invoiceNo: -1,
                },
              },
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                  matchingCard: { $push: "$$ROOT" },
                },
              },
              {
                $project: {
                  _id: 0,
                  count: 1,
                  matchingCard: { $slice: ["$matchingCard", start, limit] },
                },
              }
            ],
            TTPPM:[  {
              $group: {
                _id: null,
                totalPcs:{$sum:"$TPPM"}
              }
            },]
          }
        },
        { $unwind: { path: "$saree", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$lump", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$dress", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$matchingCard", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            saree:"$saree.total",
            lump:"$lump.total",
            dress:"$dress.total",
            TTPPM:"$TTPPM.totalPcs",
            matchingCard: "$matchingCard"
          }
        },
        {
          $addFields: {
            "matchingCard.saree":{
              $cond: { if: { $gte: [ "$saree", 1 ] }, then: "$saree", else: 0 }
            },
            "matchingCard.lump":{
              $cond: { if: { $gte: [ "$lump", 1 ] }, then: "$lump", else: 0 }
            },
            "matchingCard.dress":{
              $cond: { if: { $gte: [ "$dress", 1 ] }, then: "$dress", else: 0 }
            },
            "matchingCard.TTPPM":{$first:"$TTPPM"}
          }
        },
        {
          $project: {
            matchingCard: 1
          }
        }
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
