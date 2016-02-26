var MerchantBatchTime = require('../models/merchantBatchTime').model;

var getQueuedMerchants = function(queryCallback) {

    MerchantBatchTime.aggregate([
        {
            $lookup:
            {
                from: "completedbatches",
                localField: "internalID",
                foreignField: "internalID",
                as: "batches"
            }
        },
        {
            $unwind:
            {
                path: "$batches"
            }
        },
        {
            $group:
            {
                _id: {internalID: "$internalID", batchtime: "$batchtime"},
                maxDate:
                {
                    $max: '$batches.datetime'
                }
            }
        },
        {
            $project :
            {
                _id: 0,
                internalID : "$_id.internalID",
                batchtime: "$_id.batchtime",
                batchmonth:
                {
                    $month: new Date()
                },
                batchday:
                {
                    $cond:
                    {
                        if: { $lte: [ "$_id.batchtime", { $hour: new Date() } ] },
                        then:
                        {
                            $dayOfMonth: new Date()
                        },
                        else:
                        {
                            $dayOfMonth:
                            { $subtract : [new Date(), 24 * 60 * 60 * 1000] }
                        }
                    }
                },
                completemonth:
                {
                    $month: "$maxDate"
                },
                completeday:
                {
                    $dayOfMonth: "$maxDate"
                }
            }
        },
        {
            $project:
            {
                internalID: 1,
                monthCmp:
                {
                    $cmp: ["$batchmonth", "$completemonth"]
                },
                dayCmp:
                {
                    $cmp: ["$batchday", "$completeday"]
                }
            }
        },
        {
            $match:
            {$or:
                [
                    {
                        dayCmp: {$ne: 0}
                    },
                    {
                        monthCmp: {$ne: 0}
                    }
                ]
            }
        }
    ], queryCallback );


};

module.exports = getQueuedMerchants;