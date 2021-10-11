import { CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
/* import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/lib/aws-lambda"; */
/* import { join } from "path"; */
import {
  AuthorizationType,
  /*   LambdaIntegration, */
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/lib/aws-apigateway";
import { GenericTable } from "./GenericTable";
/* import { NodejsFunction } from "aws-cdk-lib/lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/lib/aws-iam"; */
import { AuthorizerWrapper } from "./auth/AuthorizerWrapper";
import { Bucket, HttpMethods } from "aws-cdk-lib/lib/aws-s3";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  private authorizer: AuthorizerWrapper;
  private suffix: string;
  private spacesPhotosBucket: Bucket;
  /* private spacesTable = new GenericTable("SpacesTable", "spaceId", this); */

  private spacesTable = new GenericTable(this, {
    tableName: "SpacesTable",
    primaryKey: "spaceId",
    secondaryIndexes: ["location"],
    createLambdaPath: "create",
    readLambdaPath: "read",
    updateLambdaPath: "update",
    deleteLambdaPath: "delete",
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.initializeSuffix();
    this.initializeSpacesPhotosBucket();
    this.authorizer = new AuthorizerWrapper(
      this,
      this.api,
      this.spacesPhotosBucket.bucketArn + "/*"
    );

    //JS Lambda
    /* const helloLambda = new LambdaFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
      handler: "hello.main",
    }); */

    //TS Lambda
    /*     const helloLambdaNodeJs = new NodejsFunction(this, "helloLambdaNodeJs", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    }); */

    //Create a new policy (permissions) for the Lambda
    /*     const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*"); */

    //Give the Permissions to our Lambda
    /*   helloLambdaNodeJs.addToRolePolicy(s3ListPolicy); */

    //Configure authorizor to attach to Lambda Integration
    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId,
      },
    };

    //Hello Api lambda integration (Lambda and APIGateway)
    /*     const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource =
      this.api.root.addResource("hello"); */ /* api-url/hello */
    /*     helloLambdaResource.addMethod(
      "GET",
      helloLambdaIntegration,
      optionsWithAuthorizer // attach authorizor to this api method
    ); */

    //Spaces API integrations:
    const spaceResource = this.api.root.addResource("spaces");
    spaceResource.addMethod("POST", this.spacesTable.createLambdaIntegration);
    spaceResource.addMethod("GET", this.spacesTable.readLambdaIntegration);
    spaceResource.addMethod("PUT", this.spacesTable.updateLambdaIntegration);
    spaceResource.addMethod("DELETE", this.spacesTable.deleteLambdaIntegration);
  }

  private initializeSuffix() {
    const shortStackId = Fn.select(2, Fn.split("/", this.stackId));
    const theSuffix = Fn.select(4, Fn.split("-", shortStackId));
    this.suffix = theSuffix;
  }

  private initializeSpacesPhotosBucket() {
    this.spacesPhotosBucket = new Bucket(this, "spaces-photos", {
      bucketName: `spaces-photos-${this.suffix}`,
      cors: [
        {
          allowedMethods: [HttpMethods.HEAD, HttpMethods.GET, HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    new CfnOutput(this, "spaces-photos-bucket-name", {
      value: this.spacesPhotosBucket.bucketName,
    });
  }
}
