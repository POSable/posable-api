POSable API Object Definition

This section shows the JSON or XML payload definition for posting a payment to posable-api/payments.

      *uid                - string  (accepts strings containing only numbers & letters, no whitespace)
      *transactionId      - string  (accepts strings containing only numbers & letters, no whitespace)
      *merchantId         - string  (accepts strings containing only numbers & letters, no whitespace)
      *terminalId         - string  (accepts strings containing only numbers & letters, no whitespace)
      *cashierId          - string  (accepts strings containing only numbers & letters, no whitespace)
      *dateTime           - UTC
      *type               - string  (only accepts the following strings: cash, credit)
      *amount             - float   (accepts strings containing only numbers)
      *tax                - float   (accepts strings containing only numbers)
      *creditCard         - object
          *cardType       - string  (only accepts the following strings: visa, mastercard, discover, amex)
          *last4          - integer (only accepts 4 number strings)
          *authCode       - string  (only accepts 3 number strings)
          
          
JSON 

  {
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
 

XML
    <uid>SampleID</uid> 
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


This section shows the JSON or XML transaction definition for posting a payment to posable-api/transactions.

  *transaction            - object
      *transactionId      - string  (accepts strings containing only numbers & letters, no whitespace)
      *merchantId         - string  (accepts strings containing only numbers & letters, no whitespace)
      *terminalId         - string  (accepts strings containing only numbers & letters, no whitespace)
      *cashierId          - string  (accepts strings containing only numbers & letters, no whitespace)
      *payments                 - array
            *uid                - string  (accepts strings containing only numbers & letters, no whitespace)
            *transactionId      - string  (accepts strings containing only numbers & letters, no whitespace)
            *merchantId         - string  (accepts strings containing only numbers & letters, no whitespace)
            *terminalId         - string  (accepts strings containing only numbers & letters, no whitespace)
            *cashierId          - string  (accepts strings containing only numbers & letters, no whitespace)
            *dateTime           - UTC
            *type               - string  (only accepts the following strings: cash, credit)
            *amount             - float   (accepts strings containing only numbers)
            *tax                - float   (accepts strings containing only numbers)
            *creditCard         - object
                *cardType       - string  (only accepts the following strings: visa, mastercard, discover, amex)
                *last4          - integer (only accepts 4 number strings)
                *authCode       - string  (only accepts 3 number strings)
                
       
          
          
JSON 

{ 
    "transaction": {
      "transactionId" : "SampleID",
      "merchantId" : "SampleID",
      "terminalId" : "SampleID",
      "cashierId" : "SampleID",
      "payments": [
        { "uid" : "SampleID",
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
      ]    
    }
} 

XML

<transaction>
    <transactionId>SampleID</transactionId>
    <merchantId>SampleID</merchantId>
    <terminalId>SampleID</terminalId>
    <cashierId>SampleID</cashierId>
    <payments>
        <payment> 
            <uid>SampleID</uid> 
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
    </payments>
</transaction>    
