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
