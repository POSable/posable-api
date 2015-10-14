POSable API Object Definition

This section will show the JSON or XML payload definition for posting a transaction to posable-api/transactions.

  *transaction            - object
      *transactionId      - string
      *merchantId         - string
      *terminalId         - string
      *cashierId          - string
      *dateTime           - UTC
      *payment            - object
          *type           - string
          *amount         - float
          *tax            - float
          *cardType       - string
          *last4          - integer  
          *authCode       - string
          
          
JSON 
{
    "transaction:" : {
        "transactionId" : "example string",
         "merchantId" : "example string", 
         "terminalId" : "example string",
         "cashierId" : "example string",
         "dateTime" :  Wed Oct 14 2015 11:30:50 GMT-0600 (MDT),
         "payment" : {
              "type" : "card",
              "amount" : 100.00,
              "tax" : 15.45,
              "cardType" : "example visa",
              "last4" : 1234,
              "authCode" : "example string"
         }                 
    }          
}   

XML
<transaction>
    <transactionId>example_string</transactionId>
    <merchantId>example string</merchantId>
    <terminalId>example string<terminalId>
    <cashierId>example string</cashierId>
    <dateTime>Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)</dateTime>
    <payment>
        <type>card</type>
        <amount>100.00</amount>
        <tax>15.45</tax>
        <cardType>example visa</cardType>
        <last4>1234</last4>
        <authCode>example string<authCode>
     </payment>
</transaction>

