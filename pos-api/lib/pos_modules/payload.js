//<CardType>CardType</CardType>
//<Amount>Amount</Amount>
//<Last4OfCard>Last4OfCard</Last4OfCard>
//<AuthorizationCode>AuthorizationCode</AuthorizationCode>
//<TransiactionID>TransactionID</TransactionID>
//<Tax>Tax</Tax>
//<TerminalID>TerminalID</TerminalID>
//<CashierID>CashierID</CashierID>
//<MerchantID>MerchantID</MerchantID>
//<Time>Time</Time>
//<Date>Date</Date>
//<TransactionType>TransactionType</TransactionType>
//<NETePaySN>NETePaySN</NETePaySN>



//JSON OBJECT SAMPLE PAYLOAD

var payloadJSON = {transaction: {type: 'creditCard', amount: 10.00, cardType: 'visa', last4: 1234, authCode: 'ad12313', id: '12sdd12sd23', tax: 0.20},

    terminalId: '12sdf213e', cashierId: '232sds322', merchantId: '2323sfs23we', date: 'Mon Oct 12 2015', time: '15:18:13 GMT-0600 (MDT)', netEpaySN: 'asd34wdfge45'}

//XML-RPC OBJECT SAMPLE PAYLOAD



var payloadXML = '<?xml version="1.0" encoding="UTF-8"?>' +
    '           '<'transaction'> +
                    <'type'> + "creditCard" + </'type'>
                    <'amount'>10.00</'amount'>
                    <'cardType'>+ 'visa' + </'cardType'>
                    <'last4'>1234</'last4'>
                    <'authCode'> + "ad12313" + </'authCode'>
                    <'id'> + "12sdd12sd23" + </'id'>
                    <'tax'>0.20</'tax'>
                </'transaction'>
                <'terminalId'> + "12sdf213e" + </'terminalId'>
                <'cashierId'> + "232sds322" + </'cashierId'>
                <'merchantId'> + "2323sfs23we" + </'merhcnantId'>
                <'date'> + "Mon Oct 12 2015" + </'date'>
                <'time'> + "15:18:13 GMT-0600 (MDT)" + </'time'>
                <'netEpaySN'> + "asd34wdfge45" + </'netEpaySN'>


