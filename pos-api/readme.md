##POSable API Documentation

#####This section shows the JSON and XML payload definition for posting a payment to posableapi/payments.

http://test.posableapi.io/payments

Available Methods - GET, POST

*uid              - string  (accepts strings containing only numbers & letters, no whitespace)
*transactionID    - string  (accepts strings containing only numbers & letters, no whitespace)
*merchantID       - string  (accepts strings containing only numbers & letters, no whitespace)
*terminalID       - string  (accepts strings containing only numbers & letters, no whitespace)
*cashierID        - string  (accepts strings containing only numbers & letters, no whitespace)
*dateTime         - UTC
*paymentType      - string  (only accepts the following strings: cash, credit)
*amount           - float   (accepts strings containing only numbers)
*tax              - float   (accepts strings containing only numbers)
*creditCard       - object
 *cardType      - string  (only accepts following strings: visa, mastercard, discover, amex)
 *last4         - integer (only accepts 4 number strings)
 *authCode      - string  (only accepts 6 number strings)
        
        
#####JSON - We expect all JSON values to be in String format

{
  "uid" : "SampleID",
  "transactionID" : "SampleID",
   "merchantID" : "SampleID",
   "terminalID" : "SampleID",
   "cashierID" : "SampleID",
   "dateTime" :  "Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)",
   "paymentType" : "credit",
   "amount" : "100.00",
   "tax" : "15.45",
   "creditCard": {           
        "cardType" : "visa",
        "last4" : "1234",
        "authCode" : "ABC123"
    }
} 
        
#####XML

<payment>
    <uid>SampleID</uid>
    <transactionID>SampleID</transactionID>
    <merchantID>SampleID</merchantID>
    <terminalID>SampleID</terminalID>
    <cashierID>SampleID</cashierID>
    <dateTime>Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)</dateTime>
    <paymentType>credit</paymentType>
    <amount>100.00</amount>
    <tax>15.45</tax>
    <creditCard>
        <cardType>visa</cardType>
        <last4>1234</last4>
        <authCode>ABC123</authCode>
    </creditCard>
</payment>


#####This section shows the JSON or XML transaction definition for posting a payment to posableapi/transactions.

http://test.posableapi.io/transactions

Available Methods - GET, POST

*transaction         - object
*transactionID       - string  (accepts strings containing only numbers & letters, no whitespace)
*merchantID          - string  (accepts strings containing only numbers & letters, no whitespace)
*terminalID          - string  (accepts strings containing only numbers & letters, no whitespace)
*cashierID           - string  (accepts strings containing only numbers & letters, no whitespace)
*payments            - array
*uid                 - string  (accepts strings containing only numbers & letters, no whitespace)
*transactionID       - string  (accepts strings containing only numbers & letters, no whitespace)
*merchantID          - string  (accepts strings containing only numbers & letters, no whitespace)
*terminalID          - string  (accepts strings containing only numbers & letters, no whitespace)
*cashierID           - string  (accepts strings containing only numbers & letters, no whitespace)
*dateTime            - UTC
*paymentType         - string  (only accepts the following strings: cash, credit)
*amount              - float   (accepts strings containing only numbers)
*tax                 - float   (accepts strings containing only numbers)
*creditCard          - object
   *cardType         - string  (accepts only following strings: visa, mastercard, discover, amex)
   *last4            - integer (only accepts 4 number strings)
   *authCode         - string  (only accepts 6 number strings)
   
   
#####JSON - We expect all JSON values to be in String format
 
{ 
    "transaction": {
          "transactionID" : "SampleID",
          "merchantID" : "SampleID",
          "terminalID" : "SampleID",
          "cashierID" : "SampleID",
          "payments": [{
              "uid" : "SampleID",
              "transactionID" : "SampleID",
               "merchantID" : "SampleID",
               "terminalID" : "SampleID",
               "cashierID" : "SampleID",
               "dateTime" :  "Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)",
               "paymentType" : "credit",
               "amount" : "100.00",
               "tax" : "15.45",
               "creditCard": {           
                    "cardType" : "visa",
                    "last4" : "1234",
                    "authCode" : "ABC123"
               }      
          },
          {
              "uid" : "SampleID",
              "transactionID" : "SampleID",
               "merchantID" : "SampleID",
               "terminalID" : "SampleID",
               "cashierID" : "SampleID",
               "dateTime" :  "Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)",
               "paymentType" : "credit",
               "amount" : "100.00",
               "tax" : "15.45",
               "creditCard": {           
                    "cardType" : "visa",
                    "last4" : "1234",
                    "authCode" : "ABC123"
               }
          }] 
    }
}

#####XML

<transaction>
    <transactionID>SampleID</transactionID>
    <merchantID>SampleID</merchantID>
    <terminalID>SampleID</terminalID>
    <cashierID>SampleID</cashierID>
        <payments>
            <payment> 
                <uid>SampleID</uid> 
                <transactionID>SampleID</transactionID>
                <merchantID>SampleID</merchantID>
                <terminalID>SampleID</terminalID>
                <cashierID>SampleID</cashierID>
                <dateTime>Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)</dateTime>
                <paymentType>credit</paymentType>
                <amount>100.00</amount>
                <tax>15.45</tax>
                <creditCard>
                    <cardType>visa</cardType>
                    <last4>1234</last4>
                    <authCode>ABC123</authCode>
                </creditCard>
            </payment>
            <payment> 
                <uid>SampleID2</uid> 
                <transactionID>SampleID2</transactionID>
                <merchantID>SampleID2</merchantID>
                <terminalID>SampleID2</terminalID>
                <cashierID>SampleID</cashierID>
                <dateTime>Wed Oct 15 2015 11:30:50 GMT-0600 (MDT)</dateTime>
                <paymentType>credit</paymentType>
                <amount>200.00</amount>
                <tax>25.45</tax>
                <creditCard>
                    <cardType>mastercard</cardType>
                    <last4>2345</last4>
                    <authCode>ABC123</authCode>
                </creditCard>
            </payment>
        </payments>
</transaction> 

#####This section shows the JSON or XML transaction definition for posting a payment to posableapi/collections.

http://test.posableapi.io/collections

Available Methods - GET, POST

*transaction         - object
*transactionID       - string  (accepts strings containing only numbers & letters, no whitespace)
*merchantID          - string  (accepts strings containing only numbers & letters, no whitespace)
*terminalID          - string  (accepts strings containing only numbers & letters, no whitespace)
*cashierID           - string  (accepts strings containing only numbers & letters, no whitespace)
*payments            - array
*uid                 - string  (accepts strings containing only numbers & letters, no whitespace)
*transactionID       - string  (accepts strings containing only numbers & letters, no whitespace)
*merchantID          - string  (accepts strings containing only numbers & letters, no whitespace)
*terminalID          - string  (accepts strings containing only numbers & letters, no whitespace)
*cashierID           - string  (accepts strings containing only numbers & letters, no whitespace)
*dateTime            - UTC
*paymentType         - string  (only accepts the following strings: cash, credit)
*amount              - float   (accepts strings containing only numbers)
*tax                 - float   (accepts strings containing only numbers)
*creditCard          - object
   *cardType         - string  (accepts only following strings: visa, mastercard, discover, amex)
   *last4            - integer (only accepts 4 number strings)
   *authCode         - string  (only accepts 6 number strings)











#####Postman Testing Info:

We use a Chrome extension called Postman to test. It can be downloaded here:
https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en

You can use this link to  import our collection of test posts into Postman here:
https://www.getpostman.com/collections/fc4f11314de1c9744e63



