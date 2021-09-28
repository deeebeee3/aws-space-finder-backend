import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
/* import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/lib/aws-lambda"; */
import { join } from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/lib/aws-apigateway";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/lib/aws-iam";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  /* private spacesTable = new GenericTable("SpacesTable", "spaceId", this); */

  private spacesTable = new GenericTable(this, {
    tableName: "SpacesTable",
    primaryKey: "spaceId",
    createLambdaPath: "Create",
    readLambdaPath: "Read",
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    //JS Lambda
    /* const helloLambda = new LambdaFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
      handler: "hello.main",
    }); */

    //TS Lambda
    const helloLambdaNodeJs = new NodejsFunction(this, "helloLambdaNodeJs", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });

    //Create a new policy (permissions)
    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*");

    //Give the Permissions to our Lambda
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    //Hello Api lambda integration (Lambda and APIGateway)
    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource =
      this.api.root.addResource("hello"); /* api-url/hello */
    helloLambdaResource.addMethod("GET", helloLambdaIntegration);

    //Spaces API integrations:
    const spaceResource = this.api.root.addResource("spaces");
    spaceResource.addMethod("POST", this.spacesTable.createLambdaIntegration);
    spaceResource.addMethod("GET", this.spacesTable.readLambdaIntegration);
  }
}
