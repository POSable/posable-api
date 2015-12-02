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

<<<<<<< HEAD
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



=======
*transaction            - object
  *transactionID        - string  (accepts strings containing only numbers & letters, no whitespace)
  *merchantID           - string  (accepts strings containing only numbers & letters, no whitespace)
  *terminalID           - string  (accepts strings containing only numbers & letters, no whitespace)
  *cashierID            - string  (accepts strings containing only numbers & letters, no whitespace)
  *transactionDateTime  - string  (accepts strings containing only numbers & letters, no whitespace)
    *customer           - string  (accepts strings containing only numbers & letters, no whitespace) 
       *firstName       - string  (accepts strings containing only numbers & letters, no whitespace)
       *lastName        - string  (accepts strings containing only numbers & letters, no whitespace) 
       *title           - string  (accepts strings containing only numbers & letters, no whitespace)
       *gender          - string  (accepts strings containing only numbers & letters, no whitespace)
       *address         - string  (accepts strings containing only numbers & letters, no whitespace)
       *addressType     - string  (accepts strings containing only numbers & letters, no whitespace)
       *street1         - string  (accepts strings containing only numbers & letters, no whitespace)
       *street2         - string  (accepts strings containing only numbers & letters, no whitespace)
       *city            - string  (accepts strings containing only numbers & letters, no whitespace)
       *stateProvinceRegion - string  (accepts strings containing only numbers & letters, no whitespace)
       *postalCode      - integer (only accepts 5 number strings)
       *country         - string  (accepts strings containing only numbers & letters, no whitespace)
    *phone              - object
      *phoneType        - string  (accepts strings containing only numbers & letters, no whitespace)
      *phoneNumber      - integer (only accepts 10 number strings)
    *emailAddress       - object
       *emailType       - integer (only accepts 10 number strings)
       *emailAddress    - integer (only accepts 10 number strings)
    *customField        - object 
       *fieldName       - string  (accepts strings containing only numbers & letters, no whitespace)       
       *fieldValue      - string  (accepts strings containing only numbers & letters, no whitespace)
  *inventory           - object
   *itemName          - string  (accepts strings containing only numbers & letters, no whitespace)
   *itemDescription   - string  (accepts strings containing only numbers & letters, no whitespace)
   *itemNumber        - string  (accepts strings containing only numbers & letters, no whitespace)
   *quantity          - integer (accepts any number)
   *vendor            - string  (accepts strings containing only numbers & letters, no whitespace)
   *size              - string  (accepts strings containing only numbers & letters, no whitespace)
   *attribute         - string  (accepts strings containing only numbers & letters, no whitespace)
   *taxAmount         - float   (accepts strings containing only numbers)         
   *UPC               - string  (accepts strings containing only numbers & letters, no whitespace)
   *unitOfMeasure     - string  (accepts strings containing only numbers & letters, no whitespace)
   *manufacturer      - string  (accepts strings containing only numbers & letters, no whitespace)
   *unitCost          - float   (accepts strings containing only numbers)   
   *serialNumber      - string  (accepts strings containing only numbers & letters, no whitespace)
   *shippingWeight    - string  (accepts strings containing only numbers & letters, no whitespace)
   *shippingHeight    - string  (accepts strings containing only numbers & letters, no whitespace)
   *shippingLength    - string  (accepts strings containing only numbers & letters, no whitespace)
   *shippingWidth     - string  (accepts strings containing only numbers & letters, no whitespace)
   *comments          - string  (accepts strings containing only numbers & letters, no whitespace)
   *trackingNumber    - string  (accepts strings containing only numbers & letters, no whitespace)
   *shippingCarrier   - string  (accepts strings containing only numbers & letters, no whitespace)
   *orderDate         - string  (accepts strings containing only numbers & letters, no whitespace)
   *receivedDate      - string  (accepts strings containing only numbers & letters, no whitespace)
   *customField       - object
     *fieldName       - string  (accepts strings containing only numbers & letters, no whitespace)
     *fieldValue      - string  (accepts strings containing only numbers & letters, no whitespace)
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
                   <authCode>123456</authCode>
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
                   <authCode>234567</authCode>
               </creditCard>
           </payment>
       </payments>
</transaction> 

#####JSON - We expect all JSON values to be in String format

{
    "transaction": {
    "transactionID" : "SampleID",
    "merchantID" : "SampleID",
    "terminalID" : "SampleID",
    "cashierID" : "SampleID",
    "transactionDateTime": "",
    "customer": {
      "firstName": "",
      "lastName": "",
      "title": "",
      "gender": ""
    },
    "address": {
      "addressType": "",
      "street1": "",
      "street2": "",
      "city": "",
      "stateProvinceRegion": "",
      "postalCode": "",
      "country": ""
    },
    "phone": {
      "phoneType": "",
      "phoneNumber": ""
    },
    "emailAddress" : {
      "emailType": "",
      "emailAddress" : ""
    },
    "customField" : {
      "fieldName": "",
      "fieldValue": ""
    },
    "inventory": {
      "itemName": "",
      "itemDescription": "",
      "itemNumber": "",
      "quantity": "",
      "vendor": "",
      "size": "",
      "attribute": "",
      "taxAmount": "",
      "UPC": "",
      "unitOfMeasure": "",
      "manufacturer": "",
      "unitCost": "",
      "serialNumber": "",
      "shippingWeight": "",
      "shippingHeight": "",
      "shippingLength": "",
      "shippingWidth": "",
      "comments": "",
      "trackingNumber": "",
      "shippingCarrier": "",
      "orderDate": "",
      "receivedDate": "",
      "customField": {
        "fieldName": "",
        "fieldValue": ""
      }
    },
    "payments": [
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
          "authCode" : "123456"
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
          "authCode" : "234567"
        }
      }
    ]

  }
}
 
>>>>>>> 7d465a9a4fb81233a6fbc89dae2fa0630c563ff3
#####Postman Testing Info:

We use a Chrome extension called Postman to test. It can be downloaded here:
https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en

You can use this link to  import our collection of test posts into Postman here:
https://www.getpostman.com/collections/25c0e1b7f777a1117c55



