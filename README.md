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

# Using the aws-sdk

npm i aws-sdk

In this example we use the aws-sdk to list the s3 buckets and show them as string as response in our lambda...

First time we try the request (after cdk deploy first) we will get an error

We can get error details in CloudWatch logs

Because we need to give our lambda the right permissions to list s3 buckets...

Add policy to lambda

cdk deploy

then try request again - and we should see list of buckets in response body...

---

# Run Lambda Locally in Debug mode (easier than above section)

Go to vscode debug and create a configuration (.vscode/launch.json) for nodejs:

{
"version": "0.2.0",
"configurations": [
{
"type": "node",
"request": "launch",
"name": "Debug local file",
"runtimeArgs": ["-r", "ts-node/register"],
"args": ["${relativeFile}"],
"env": {
"AWS_REGION": "us-west-2"
}
}
]
}

add a breakpoint in the hello.ts file

open the Hello.test.ts and click vscode debugger and hit play.

we should hit our breakpoint and be able to inspect the variables...

like see our s3 buckets etc...

this uses the permissions from our local aws config (we gave administrator access to it) rather than what we assigned to the lambda

---

# AWS Cognito - User pools

Create a user pool in Cognito - accept standard defaults and get the pool id...

Example:
User Pool Id: us-west-2_o05UTS9MJ

Click on App Integration in sidebar and add a domain and save changes...

https://[domain].auth.us-west-2.amazoncognito.com
https://deeebeee3.auth.us-west-2.amazoncognito.com

Click on App clients in sidebar under General settings and add a app client...

my-app-client

untick Generate client secret

tick everything under Auth Flows Configuration

Click create app client

Now we have a app client id:

User Pool (App) client id: sc8n81dpbn2v57th8vuvr23io

Now we have the user pool and app client ids - which is everything we need to
use this user pool inside the UI of our app...

Then create an initial user... under general settings - users and groups...

---

user1 Enabled FORCE_CHANGE_PASSWORD user@email.com true - Sep 29, 2021 10:17:32 AM Sep 29, 2021 10:17:32 AM

---

Remove FORCE_CHANGE_PASSWORD for this user:

aws cognito-idp admin-set-user-password --user-pool-id us-west-2_o05UTS9MJ --username user1 --password "P@ssw0rd" --permanent

---

user1 Enabled CONFIRMED user@email.com true - Sep 29, 2021 10:22:49 AM Sep 29, 2021 10:17:32 AM

---

## Restrict acess to API

Go to API Gateway in AWS Management console...

Click on spaceAPI - will see request methods etc

First create an authorizer...

name it

click Cognito radio button and select user pool ...

Type "Authorization" header for token source..

Apply this authorization to an api endpoint - save and redeploy api (all from aws management console)

https://jwt.io/

---

aws cognito-idp admin-set-user-password --user-pool-id us-west-2_BnY9d8GcQ --username user2 --password "P@ssw0rd" --permanent

---
