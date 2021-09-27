# aws-space-finder-backend

# AWS Backend

npm init -y
npm i -D aws-cdk aws-cdk-lib constructs ts-node typescript

create folder structure...

add cdk.json file:

{
"app": "npx ts-node infrastructure/Launcher.ts"
}

tsc --init
Change target to ES2018 in ts.config

then run: cdk synth...

Best thing to do is to copy ts.config from a cdk generated project and use it in here - to make sure we have correct ts config...

---

# Basic AWS Lambda

Install @types/node..

write Lambda service (hello.js and import into SpaceStack (stack))

cdk bootstrap

cdk synth (just to check that we imported the right asset - error if not correct)

in cdk.out folder we should now have an asset folder with out lambda (asset.xxx)

cdk deploy

---

# API Gateway and Lambda Integration...

cdk deploy

accept IAM policy changes

Once finished publishing will give us an endpoint where we can access our service:

✅ Space-Finder (SpaceFinder)

Outputs:
Space-Finder.SpaceApiEndpointDA7E4050 = https://92p6m8c7ph.execute-api.us-west-2.amazonaws.com/prod/

Stack ARN:
arn:aws:cloudformation:us-west-2:841848180286:stack/SpaceFinder/b7bfc830-1ef6-11ec-8165-0ae04a84ad2d

Going here will give error because we haven't accessed the right method:

https://92p6m8c7ph.execute-api.us-west-2.amazonaws.com/prod/

our method:

https://92p6m8c7ph.execute-api.us-west-2.amazonaws.com/prod/hello

We will get the response data :-) from our method...

---

# Install REST client vscode package...

---

# DynamoDB with CDK

user -> APIGateway -> Lambda -> DynamoDB -> APIGateway -> user

After creating GenericTable class and initializing it in our stack run cdk synth
to compile and make sure no errors

then if no errors run cdk deploy to deploy our stack (and the dynamodb table too)...

---

# Lambda bundling problem:

- Deploy implementation and dependencies
- Transform TS into JS

What we will do:

https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-nodejs-readme.html

install the esbuild package:

npm install --save-dev esbuild@0

then build a simple lambda with TS...

use the following package to generate random ids which we can use..

npm install uuid @types/uuid

after creating service in TS and creating TS lambda function in stack

do cdk synth to make sure no errors...

cdk deploy

---

# CloudWatch (Logging)

add some console logs to the lambda

cdk deploy

fire off request from requests.http file

check logs in CloudWatch under Logs -> Log groups

Every time a Lambda is executed it is logged under log groups

click on it and look at the most recent log stream

---
