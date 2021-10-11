import {
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
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
  private photoBucketArn: string;

  private identityPool: CfnIdentityPool;
  private authenticatedRole: Role;
  private unAuthenticatedRole: Role;
  public adminRole: Role;

  constructor(
    scope: Construct,
    userPool: UserPool,
    userPoolClient: UserPoolClient,
    photoBucketArn: string
  ) {
    this.scope = scope;
    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    this.photoBucketArn = photoBucketArn;
    this.initialize();
  }

  private initialize() {
    this.initializeIdentityPool();
    this.initializeRoles();
    this.attachRoles();
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
          "sts:AssumeRoleWithWebIdentity"
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
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );

    this.adminRole = new Role(this.scope, "CognitoAdminRole", {
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
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject", "s3:PutObjectAcl"],
        resources: [this.photoBucketArn],
      })
    );
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this.scope, "RolesAttachment", {
      identityPoolId: this.identityPool.ref,
      //basic implementation of authenticated and unauthenticated roles
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unAuthenticatedRole.roleArn,
      },
      roleMappings: {
        //get role from token if it has role information otherwise just use the authenticated role
        adminsMapping: {
          type: "Token",
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
        },
      },
    });
  }
}
