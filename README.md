# aws-space-finder-backend

AWS Backend

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

Basic AWS Lambda

Install @types/node..

write Lambda service (hello.js and import into SpaceStack (stack))

cdk bootstrap

cdk synth (just to check that we imported the right asset - error if not correct)

in cdk.out folder we should now have an asset folder with out lambda (asset.xxx)

cdk deploy

---

API Gateway and Lambda Integration...

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

Install REST client vscode package...
