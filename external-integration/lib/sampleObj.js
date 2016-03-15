//
//var sampleData = [
//     {
//        transactionID: "123456",
//        salesAmount: 100.99,
//        taxAmount: 3.45,
//        discountAmount: 0,
//        giftCardAmount: 0
//     },
//    {
//        transactionID: "78910",
//        salesAmount: 100.99,
//        taxAmount: 3.45,
//        discountAmount: 0,
//        giftCardAmount: 7
//    },
//    {
//        transactionID: "987654",
//        salesAmount: 100.99,
//        taxAmount: 3.45,
//        discountAmount: 33,
//        giftCardAmount: 0
//    }
//];
//
//module.exports = sampleData;
//
//
//
//sampleData.forEach(function(transaction){
//
//
//    if(transaction.salesAmount > 0) {
//        subTransactionArray.push({
//            valueID: "31", //needed from config to map to Sale
//            description: transaction.transactionID,
//            amount: transaction.salesAmount
//        })
//    } if (transaction.taxAmount > 0) {
//        subTransactionArray.push({
//            valueID: "31", //needed from config to map to Tax,
//            description: transaction.transactionID,
//            amount: transaction.taxAmount
//        })
//    } if (transaction.discountAmount > 0) {
//        subTransactionArray.push({
//            valueID: "31", //needed from config to map to Discount,
//            description: transaction.transactionID,
//            amount: transaction.discountAmount
//        })
//    } if (transaction.giftCardAmount > 0) {
//        subTransactionArray.push({
//            valueID: "31", //needed from config to map to Gift,
//            description: transaction.transactionID,
//            amount: transaction.giftCardAmount
//        })
//    }
//});