let ObjectId = require("mongodb").ObjectId;
const logger = require('winston');
const getlookupCondition = async (type) => {
  try {
    let condition = [];
    if (type == "dressCard") {
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
        { $unwind: { path: "$party", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$works", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "works.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "works.item",
          }
        },
        { $unwind: { path: "$works.item", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            works: { $push: "$works", },
            measurements: { $first: "$measurements", },
            costing: { $first: "$costing", },
            shortNet: { $first: "$shortNet" },
            stitching: { $first: "$stitching", },
            foil:{$first:"$foil"},
            hand:{$first:"$hand"},
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            finalCosting: { $first: "$finalCosting" },
            party: { $first: "$party", },
          }

        },
        { $unwind: { path: "$measurements", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "measurements.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "measurements.item",
          }
        },
        {
          $lookup: {
            from: "clothes",
            localField: "measurements.clotheId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "measurements.clothe",
          }
        },
        {
          $lookup: {
            from: "fabricColors",
            localField: "measurements.fabricColorId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  colorName: 1,
                  //status: 1,
                },
              },
            ],
            as: "measurements.fabricColor",
          }
        },
        { $unwind: { path: "$measurements.fabricColor", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$measurements.item", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$measurements.clothe", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            works: { $first: "$works", },
            measurements: { $push: "$measurements", },
            shortNet: { $first: "$shortNet" },
            costing: { $first: "$costing", },
            stitching: { $first: "$stitching", },
            foil:{$first:"$foil"},
            hand:{$first:"$hand"},
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            finalCosting: { $first: "$finalCosting" },
            party: { $first: "$party", },
          }
        },
        { $unwind: { path: "$costing", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "costing.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "costing.item",
          }
        },
        {
          $lookup: {
            from: "clothes",
            localField: "costing.clotheId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  //status: 1,
                },
              },
            ],
            as: "costing.clothe",
          }
        },
        { $unwind: { path: "$costing.item", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$costing.clothe", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            works: { $first: "$works", },
            shortNet: { $first: "$shortNet" },
            measurements: { $first: "$measurements", },
            costing: { $push: "$costing", },
            stitching: { $first: "$stitching", },
            foil:{$first:"$foil"},
            hand:{$first:"$hand"},
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            finalCosting: { $first: "$finalCosting" },
            party: { $first: "$party", },
          }

        },

        { $unwind: { path: "$stitching", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "stitching.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "stitching.item",
          }
        },
        {
          $lookup: {
            from: "materials",
            localField: "stitching.materialId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "stitching.materials",
          }
        },
        { $unwind: { path: "$stitching.item", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$stitching.materials", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            works: { $first: "$works", },
            shortNet: { $first: "$shortNet" },
            measurements: { $first: "$measurements", },
            costing: { $first: "$costing" },
            stitching: { $push: "$stitching" },
            foil:{$first:"$foil"},
            hand:{$first:"$hand"},
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            finalCosting: { $first: "$finalCosting" },
            party: { $first: "$party", },
          }

        },
        { $unwind: { path: "$foil", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "foil.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "foil.item",
          }
        },
        {
          $lookup: {
            from: "foilColors",
            localField: "foil.colorId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "foil.color",
          }
        },
        {
          $lookup: {
            from: "remarks",
            localField: "foil.remarkId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "foil.remark",
          }
        },
        { $unwind: { path: "$foil.item", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$foil.color", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$foil.remark", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            works: { $first: "$works", },
            shortNet: { $first: "$shortNet" },
            measurements: { $first: "$measurements", },
            costing: { $first: "$costing" },
            stitching: { $first: "$stitching" },
            foil:{$push:"$foil"},
            hand:{$first:"$hand"},
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            finalCosting: { $first: "$finalCosting" },
            party: { $first: "$party", },
          }

        },
        { $unwind: { path: "$hand", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "hand.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "hand.item",
          }
        },
        {
          $lookup: {
            from: "diamonds",
            localField: "hand.diamondId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "hand.diamond",
          }
        },
        {
          $lookup: {
            from: "remarks",
            localField: "hand.remarkId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "hand.remark",
          }
        },
        { $unwind: { path: "$hand.item", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$hand.diamond", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$hand.remark", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            works: { $first: "$works", },
            shortNet: { $first: "$shortNet" },
            measurements: { $first: "$measurements", },
            costing: { $first: "$costing" },
            stitching: { $first: "$stitching" },
            foil:{$first:"$foil"},
            hand:{$push:"$hand"},
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            finalCosting: { $first: "$finalCosting" },
            party: { $first: "$party", },
          }
        },
        {
          $project: {
            "works.itemId": 0,
            "measurements.itemId": 0,
            "measurements.clotheId": 0,
            "costing.itemId": 0,
            "costing.clotheId": 0,
            "stitching.itemId": 0,
            "stitching.materialId": 0,
            "foil.itemId": 0,
            "foil.colorId": 0,
            "foil.remarkId": 0,
            "hand.itemId": 0,
            "hand.diamondId": 0,
            "hand.remarkId": 0
          }
        }
      )
    }
    else if (["sareeCard", "lumpCard"].indexOf(type) > -1) {
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
            from: "title",
            localField: "mId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1
                },
              },
            ],
            as: "mainTitle",
          }
        },
        {
          $lookup: {
            from: "title",
            localField: "jId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1
                },
              },
            ],
            as: "jobTitle",
          }
        },
        {
          $lookup: {
            from: "remarks",
            localField: "remarkId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "remark",
          }
        },
        { $unwind: { path: "$party", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$mainTitle", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$jobTitle", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$remark", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "job.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "job.item",
          }
        },
        { $unwind: { path: "$job.item", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            job: { $push: "$job", },
            foil: { $first: "$foil", },
            fabrics: { $first: "$fabrics", },
            stitching: { $first: "$stitching", },
            hand: { $first: "$hand", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            jobNotes: { $first: "$jobNotes" },
            foilNotes: { $first: "$foilNotes" },
            stitchingNotes: { $first: "$stitchingNotes" },
            fabricsNotes: { $first: "$fabricsNotes" },
            finalNotes: { $first: "$finalNotes" },
            handNotes: { $first: "$handNotes" },
            height: { $first: "$height" },
            title:{$first:"$title"},
            finalCosting: { $first: "$finalCosting" },
            party: { $first: "$party", },
            mainTitle: { $first: "$mainTitle", },
            jobTitle: { $first: "$jobTitle", },
            remark:{$first:"$remark"}
          }

        },
        { $unwind: { path: "$foil", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "foil.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "foil.item",
          }
        },
        {
          $lookup: {
            from: "foilColors",
            localField: "foil.colorId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "foil.color",
          }
        },
        {
          $lookup: {
            from: "remarks",
            localField: "foil.remarkId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "foil.remark",
          }
        },
        { $unwind: { path: "$foil.item", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$foil.color", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$foil.remark", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            job: { $first: "$job", },
            foil: { $push: "$foil", },
            fabrics: { $first: "$fabrics", },
            stitching: { $first: "$stitching", },
            hand: { $first: "$hand", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            jobNotes: { $first: "$jobNotes" },
            foilNotes: { $first: "$foilNotes" },
            stitchingNotes: { $first: "$stitchingNotes" },
            fabricsNotes: { $first: "$fabricsNotes" },
            handNotes: { $first: "$handNotes" },
            finalNotes: { $first: "$finalNotes" },
            height: { $first: "$height" },
            title:{$first:"$title"},
            finalCosting: { $first: "$finalCosting" },
            party: { $first: "$party", },
            mainTitle: { $first: "$mainTitle", },
            jobTitle: { $first: "$jobTitle", },
            remark:{$first:"$remark"}
          }

        },


        { $unwind: { path: "$fabrics", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "fabrics.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "fabrics.item",
          }
        },
        {
          $lookup: {
            from: "clothes",
            localField: "fabrics.clotheId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "fabrics.clothe",
          }
        },
        {
          $lookup: {
            from: "clothePartys",
            localField: "fabrics.clothePartyId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "fabrics.clotheParty",
          }
        },
        {
          $lookup: {
            from: "fabricColors",
            localField: "fabrics.fabricColorId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  colorName: 1,
                  //status: 1,
                },
              },
            ],
            as: "fabrics.fabricColor",
          }
        },
        { $unwind: { path: "$fabrics.fabricColor", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$fabrics.item", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$fabrics.clothe", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$fabrics.clotheParty", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            job: { $first: "$job", },
            foil: { $first: "$foil", },
            fabrics: { $push: "$fabrics", },
            stitching: { $first: "$stitching", },
            hand: { $first: "$hand", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            jobNotes: { $first: "$jobNotes" },
            foilNotes: { $first: "$foilNotes" },
            stitchingNotes: { $first: "$stitchingNotes" },
            fabricsNotes: { $first: "$fabricsNotes" },
            finalNotes: { $first: "$finalNotes" },
            handNotes: { $first: "$handNotes" },
            finalCosting: { $first: "$finalCosting" },
            height: { $first: "$height" },
            title:{$first:"$title"},
            party: { $first: "$party", },
            mainTitle: { $first: "$mainTitle", },
            jobTitle: { $first: "$jobTitle", },
            remark:{$first:"$remark"}
          }

        },

        { $unwind: { path: "$stitching", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "stitching.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "stitching.item",
          }
        },
        {
          $lookup: {
            from: "materials",
            localField: "stitching.materialId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "stitching.materials",
          }
        },
        { $unwind: { path: "$stitching.item", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$stitching.materials", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            job: { $first: "$job", },
            foil: { $first: "$foil", },
            fabrics: { $first: "$fabrics", },
            stitching: { $push: "$stitching", },
            hand: { $first: "$hand", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            jobNotes: { $first: "$jobNotes" },
            foilNotes: { $first: "$foilNotes" },
            stitchingNotes: { $first: "$stitchingNotes" },
            fabricsNotes: { $first: "$fabricsNotes" },
            finalNotes: { $first: "$finalNotes" },
            handNotes: { $first: "$handNotes" },
            finalCosting: { $first: "$finalCosting" },
            height: { $first: "$height" },
            title:{$first:"$title"},
            party: { $first: "$party", },
            mainTitle: { $first: "$mainTitle", },
            jobTitle: { $first: "$jobTitle", },
            remark:{$first:"$remark"}
          }

        },

        { $unwind: { path: "$hand", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "items",
            localField: "hand.itemId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "hand.item",
          }
        },
        {
          $lookup: {
            from: "diamonds",
            localField: "hand.diamondId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "hand.diamond",
          }
        },
        {
          $lookup: {
            from: "remarks",
            localField: "hand.remarkId",
            foreignField: "_id",
            pipeline: [{ $project: { name: 1 } }],
            as: "hand.remark",
          }
        },
        { $unwind: { path: "$hand.item", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$hand.diamond", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$hand.remark", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            invoiceNo: { $first: "$invoiceNo", },
            designNo: { $first: "$designNo", },
            date: { $first: "$date", },
            image: { $first: "$image", },
            job: { $first: "$job", },
            foil:{$first:"$foil"},
            fabrics: { $first: "$fabrics", },
            stitching: { $first: "$stitching", },
            hand: { $push: "$hand", },
            status: { $first: "$status", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
            jobNotes: { $first: "$jobNotes" },
            foilNotes: { $first: "$foilNotes" },
            stitchingNotes: { $first: "$stitchingNotes" },
            fabricsNotes: { $first: "$fabricsNotes" },
            finalNotes: { $first: "$finalNotes" },
            handNotes: { $first: "$handNotes" },
            finalCosting: { $first: "$finalCosting" },
            height: { $first: "$height" },
            title:{$first:"$title"},
            party: { $first: "$party", },
            mainTitle: { $first: "$mainTitle", },
            jobTitle: { $first: "$jobTitle", },
            remark:{$first:"$remark"} 
          }

        },
        {
          $project: {
            "job.itemId": 0,
            "foil.itemId": 0,
            "foil.colorId": 0,
            "foil.remarkId": 0,
            "fabrics.itemId": 0,
            "fabrics.clotheId": 0,
            "fabrics.clothePartyId": 0,
            "stitching.itemId": 0,
            "stitching.materialId": 0,
            "hand.itemId": 0,
            "hand.diamondId": 0,
            "hand.remarkId": 0

          }
        }
      )
    }
    else if (type == "report") {
      condition.push(
        { $unwind: { path: "$work", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "partys",
            localField: "work.partyId",
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
            as: "clothe",
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
                },
              },
            ],
            as: "createdBy",
          }
        }, { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$party", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$clothe", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            "createdBy": "$createdBy.name",
            "work.party":"$party",
            "work.clothe":"$clothe",
          }
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name", },
            date: { $first: "$date", },
            work: { $push: "$work", },
            type: { $first: "$type", },
            totalRate: { $first: "$totalRate", },
            createdBy: { $first: "$createdBy", },
            createAt: { $first: "$createAt", },
            updateAt: { $first: "$updateAt", },
            updatedBy: { $first: "$updatedBy", },
          }

        },
        {
          $project: {
            "work.partyId":0,
            "work.clotheId": 0
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
