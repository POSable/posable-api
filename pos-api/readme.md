POSable API Object Definition

This section shows the JSON or XML payload definition for posting a transaction to posable-api/transactions.

  *payment                - object
      *uid                - string
      *transactionId      - string
      *merchantId         - string
      *MerchantKey        - string
      *terminalId         - string
      *cashierId          - string
      *dateTime           - UTC
      *type               - string
      *amount             - float
      *tax                - float
      *creditCard         - object
          *cardType       - string
          *last4          - integer  
          *authCode       - string
          
          
JSON 
{
    "payment:" : {
        "uid" : "example string",
        "transactionId" : "example string",
         "merchantId" : "example string", 
         "terminalId" : "example string",
         "cashierId" : "example string",
         "dateTime" :  "Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)",
         "type" : "card",
         "amount" : 100.00,
         "tax" : 15.45,
         "creditCard" : {           
              "cardType" : "example visa",
              "last4" : 1234,
              "authCode" : "example string"
         }                 
    }          
}   

XML
<payment>
    <transactionId>example string</transactionId>
    <merchantId>example string</merchantId>
    <terminalId>example string</terminalId>
    <cashierId>example string</cashierId>
    <dateTime>Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)</dateTime>
    <type>card</type>
    <amount>100.00</amount>
    <tax>15.45</tax>
    <creditCard>
        <cardType>example visa</cardType>
        <last4>1234</last4>
        <authCode>example string</authCode>
    </creditCard>
</payment>

