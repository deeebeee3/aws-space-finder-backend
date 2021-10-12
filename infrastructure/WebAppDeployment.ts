import { Stack } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/lib/aws-s3";

export class WebAppDeployment {
  private stack: Stack;
  private bucketSuffix: string;
  private deploymentBucket: Bucket;

  constructor(stack: Stack, bucketSuffix: string) {
    this.stack = stack;
    this.bucketSuffix = bucketSuffix;
    this.initialize();
  }

  private initialize() {
    const bucketName = `space-app-web-${this.bucketSuffix}`;

    this.deploymentBucket = new Bucket(this.stack, "space-app-web-id", {
      bucketName: bucketName,
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
    });
  }
}
