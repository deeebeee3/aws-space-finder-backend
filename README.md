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
