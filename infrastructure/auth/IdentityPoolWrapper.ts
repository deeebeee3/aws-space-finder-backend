import {
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
} from "aws-cdk-lib/lib/aws-cognito";
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
} from "aws-cdk-lib/lib/aws-iam";
import { CfnOutput } from "aws-cdk-lib/lib/core";
import { Construct } from "constructs";

export class IdentityPoolWrapper {
  private scope: Construct;
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;

  private identityPool: CfnIdentityPool;
  private authenticatedRole: Role;
  private unAuthenticatedRole: Role;
  private adminRole: Role;

  constructor(
    scope: Construct,
    userPool: UserPool,
    userPoolClient: UserPoolClient
  ) {
    this.scope = scope;
    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    this.initialize();
  }

  private initialize() {
    this.initializeIdentityPool();
    this.initializeRoles();
  }

  private initializeIdentityPool() {
    this.identityPool = new CfnIdentityPool(
      this.scope,
      "SpaceFinderIdentityPool",
      {
        allowUnauthenticatedIdentities: true,
        cognitoIdentityProviders: [
          {
            clientId: this.userPoolClient.userPoolClientId,
            providerName: this.userPool.userPoolProviderName,
          },
        ],
      }
    );

    new CfnOutput(this.scope, "IdentityPoolId", {
      value: this.identityPool.ref,
    });
  }

  //In the aws console if we create an IdentityPool manually this role is
  //generated automatically
  private initializeRoles() {
    this.authenticatedRole = new Role(
      this.scope,
      "CognitoDefaultAuthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
          "cognito-identity.amazonaws.com:aud"
        ),
      }
    );

    //In the aws console if we create an IdentityPool manually this role is
    //generated automatically
    this.unAuthenticatedRole = new Role(
      this.scope,
      "CognitoDefaultunAuthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "cognito-identity.amazonaws.com:aud"
        ),
      }
    );

    this.adminRole = new Role(this.scope, "CognitoDefaultAuthenticatedRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "cognito-identity.amazonaws.com:aud"
      ),
    });

    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:ListAllMyBuckets"],
        resources: ["*"],
      })
    );
  }
}
