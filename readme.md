POSable Documentation of App Tools

Introduction
This document provides the technical details about the POSable app. It should be used to support continuing app development.  
The POSable app uses many tools to support development and functionality.
Development Tools include GitHub, Sprintly, Webstorm, Slack, Postman, RabbitMQ management dashboard, Loader IO, Circle CI, and New Relic. Tools used to support the functionality of the app include Node.js, Express, Amazon Web Services (AWS), RabbitMQ, and Mongo DB. Some of these functional tools are Node Package Manager (npm) items, however, not all the POSable npm items will be listed or discussed here. Also shown here will be app configuration details

App Configuration Details

Env Json File
    "mongoose_connection", persist http request data 
    "mongoose_config_connection", persist user configuration data
    "logging_type", Bunyan setting 
    "logging_level", Bunyan setting
    "logging_path", path for log files (needs to exist outside the app directory - will crash app if missing)
    "logging_period", Bunyan setting (one day).
    "redis_connection", connection string for redis database
    "wascally_connection_parameters" : {
      "user", user name
      "pass", password
      "server", amazon box
      "replyQueue",
      "port",
      "vhost",
      "level1_retries", see documentation on retry functionality 
      "level2_retries",, see documentation on retry functionality 
	pos-api/.ebextensions
Two scripts are stored in this directory, 1. Install github key config and 2. Setup a logger directory outside of the app directory.

Config Records
This shows and describes the fields saved in the config database for Merchants.
name:, name of merchant
posapiToken, token provided by POSable to identify user 
posUsername, point of sale username provided by agregator
posPassword, point of sale password provided by agregator
activeStatus,
timezone, provided by agregator
posVendorID, provided by agregator
internalID, posable unique id for a user
responseType, Alt will send an e-mail as well as regular response for http post related error messages. 
merchantID, provided by agregator
accountingIsReady, boolean toggle that allows account data to be issued to accounting software, e.g , quickbooks 
invoiceConfig: 
 visaID, provided by merchant
 mastercardID, provided by merchant
 amexID, provided by merchant
 discoverID, provided by merchant
 cashID, provided by merchant
 checkID, provided by merchant
 creditAccountID, provided by merchant
 cashAccountID, provided by merchant
 checkAccountID, provided by merchant
 accountingCustomerID, provided by merchant
 batchHour, provided by merchant
 batchMin, provided by merchant
 accountingClient, e.g., quickbooks
 cloudElemAPIKey, provided by cloud elements
 Organization,
 Element,
 salesLineItemID,
 taxLineItemID,
 giftLineItemID,
 discountLineItemID,
 batchType

GitHub
The account name is POSable. In this account the primary (important) repositories are posable-api, posable-validationPlugin, posable-customerConfigPlugin, posable-wascally-wrapper, and posable-logPlugin
All the plugins listed above including the wascally wrapper are available to each service as a custom npm item. Plugins are loaded during service deployment and must maintain a version. 

Sprintly
The account name is POSable. Current practice is to complete sprints every two weeks starting on Wednesday. 

WebStorm
The POSable team uses the code editor Webstorm developed by JetBrains. Licensing is provided by POSable

Slack
Slack is used for internal development communications. The account name is POSabe.io. Channel names and use are obvious. 

Amazon Web Services (aws)
Account# 788743476555
It is planned that all production services will be hosted on AWS. 
Bastion server setup:
Stage environment setup: stage-bastion-c
Uses ssh agent to connect to bastion and from there to instances
security groups all open ssh traffic only to bastion server
https://blogs.aws.amazon.com/security/post/Tx3N8GFK85UN1G6/Securely-connect-to-Linuxinstances-running-in-a-private-Amazon-VPC
IP of computer accessing the bastion server must be approved and configured in aws. 
To log into the boxes the public key provided with a pem file must be copied into the authorized_keys file. This link gives direction to find the public key. http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#retrieving-the-public-key 
VPC:
Default
Only RabbitMQ server for testing environment
Stage
3 public segments (avail zones a, b, c)
3 private segments (avail zones a, b, c)
Route table stage-route-public routes out to internet gateway igw-c5aed8a0
Elastic Beanstalk:
5 applications
Each load balanced, health determined by health check
Backend servers need health to be determined by messaging
Do this with custom counter showing time messages in queues
VPC for each app across all three availability zones
Auto scaling
Going forward, need to create AMI images for speed starting up
Need: Alarms configured
Need: email addresses subscribed to events
Code has scripts for Beanstalk to run
Sets up directories
Creates SSH key for pulling plugins from private repositories
Mongo DB Server:
stage-mongodb-c
All db’s on one server
Need: clustering in production
connection string is private DNS
RabbitMQ Servers:
rabbitMQ (dev instance)
stage-rabbitmq-a, -b, -c are stage instances, clustered. See RMQ doc for ports
Load Balancers:
Two custom LBs for stage rabbit box and the dev rabbit box
All others elastic beanstalk LBs
S3:
posable-awe-deploy-keys - ssh key for posable repositories
All others automatically created - beanstalk
ElastiCache cluster
stage-cache-cluster
Redis engine
Connection in config plugin
Route53
CNAME record added to posableapi.io
stage.posableapi.io -> pos-api LB DNS
SNS
Topic ‘TestStage’ set up for notification service
All others Elastic Beanstalk notifications. 

Postman
These three links provide the http requests used to test the POSable endpoints for fullTransactions, transactions and getToken. They include “happy paths” and “error paths” for xml and json payloads. 
https://www.getpostman.com/collections/3d5211285e816d92f8b5
https://www.getpostman.com/collections/a635c1260460794cc4ef
https://www.getpostman.com/collections/48b49bdf56e6bf2e5e65

RabbitMQ
Physical Deployment:
AWS hosted dev RabbitMQ server (RabbitMQ) - single instance, connected via Public DNS
3 Stage servers clustered (stage-rabbitmq-a, -b, -c)
Load balancer for messaging TCP traffic (stage-rabbit-int) port 5672 -> 5672
Load balancer for management site (stage-rabbitmq-test) port 80 -> 15672
Security group opens ports 25672 for cluster operation
Config connection is load balancer DNS
General Setup:
All exchanges marked as durable
All messages sent as durable
All queues marked as ‘ha’ which mirror messages to other servers in cluster
‘Commands’ = many logical requestors, one logical servicer.
Command message type naming is: [targetService].command.[commandName]
‘Events’ = one logical publisher, many logical subscribers.
Event message type naming is: [originatingService].event.[eventName]
 Pre-Fetch limit (throttle) set for consuming services.
Exchanges:
all-commands:
direct exchange
route to queue using routing key (key matches queue names, listed below)
used for ‘commands’ (many services commanding one logical service)
all commands thru this one exchange
event.deadletter:
direct exchange
routes to dead letter queue
internal.delayExchange:
fanout exchange
only subscriber now is delayQ queue
All other ‘event’ exchanges:
All fanout (pub-sub)
One exchange per ‘event’ (one service raising event to many logical services, pub-sub)
Allows granular event subscription
Events all flow to subscribed queues
Queues:
internal.delayQ:
used for 2nd level retries (see below workflow)
no handlers in code
service.deadLetter
used as ‘poison message’ parking
no handlers in code
All other service queues:
Named service.[serviceName]
All commands keyed to this queue deposit here
All events subscribed to by this service deposit here
Internal retry procedure:
Code will not just ‘nack’ a message, returning bad messages over & over to queue.
If error is in message format, and not system error send immediately to dead letter
If error is system error:
First X (configurable) times:
messages have property defining ‘1st level retry’ counter
WascallyWrapper created new dupe message, increment counter
return message to RabbitMQ queues
Next X (configurable) times:
messages have property defining ‘2nd level retry’ counter
W.W. creates dupe message, incrementing counter
Sets routing key to be queue for consuming service
Sends message to ‘delay’ exchange, parks it into delayQ queue
delayQ set with ‘TTL’ policy
at end of this time, message follows ‘deadLetter’ policy, moves to dead letter exchange
because of routing key, dead letter queue sends to proper queue for redelivery
Next:
when out of retries, WW moves message to dead letter exchange with dead letter key
Policies:
ha_&_deadLetter:
applies to all queues except the delayQ
ha-mode: ‘all’ - queue durability to clustered servers
dead-letter-exchange & dead-letter-routing-key: the definition of where to move messages
when dead lettered, and the routing key - generally unused here due to code managed
retries
level2Delay:
only delayQ
ha-mode: same as above
message-ttl: the amount of time message spends in queue before dead-lettering
dead-letter-exchange: specifies ‘all-commands’ exchange, and since there is not change in
the routing key from original, moves message back to handling queue

Loader.io
Account - steve@posable.io
Password: posable
Pos-api will be the only service hit with http requests. A token had been placed in the app directory to verify the use of the test on the app endpoints. The directions below explain this. 
http://support.loader.io/article/20-verifying-an-app
Past test results are accessible. App performance when load tested increased dramatically by changing nginx settings, specifically “worker_processes” and “worker_connections”. 

Circle.CI
Account name Posable

New Relic
Account name: POSable, LLC
Username : steve@posable.io
Password: Posable1215

Redis

Wascally
** Keep alive settings between Rabbit and AWS are important to ensure connections are not dropped. 
Memory leak identified when connections are constantly re-established - connection object not garbage collected. This is a poor side effect of Wascally. 
Bunyan

NGINX

Quik Books
josh@posable.io
Pos@able12


