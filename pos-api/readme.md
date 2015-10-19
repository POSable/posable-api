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
    "payment": {
      "uid" : "SampleID",
      "transactionId" : "SampleID",
       "merchantId" : "SampleID",
       "terminalId" : "SampleID",
       "cashierId" : "SampleID",
       "dateTime" :  "Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)",
       "type" : "credit",
       "amount" : 100.00,
       "tax" : 15.45,
       "creditCard": {           
            "cardType" : "visa",
            "last4" : 1234,
            "authCode" : 123
       }                 
    }          
  }  

XML
<payment>
    <uid>example string</uid>
    <transactionId>example string</transactionId>
    <merchantId>example string</merchantId>
    <terminalId>example string</terminalId>
    <cashierId>example string</cashierId>
    <transactionId>SampleID</transactionId>
    <merchantId>SampleID</merchantId>
    <terminalId>SampleID</terminalId>
    <cashierId>SampleID</cashierId>
    <dateTime>Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)</dateTime>
    <type>credit</type>
    <amount>100.00</amount>
    <tax>15.45</tax>
    <creditCard>
        <cardType>visa</cardType>
        <last4>1234</last4>
        <authCode>123</authCode>
    </creditCard>
</payment>

