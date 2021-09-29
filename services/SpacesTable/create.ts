import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  MissingFieldError,
  validateAsSpaceEntry,
} from "../Shared/InputValidator";

// no way to import just v4 without importing the whole lib, so we won't
// use it since it packs the whole lib into our compiled assets (cdk.out)
// import { v4 } from "uuid";

import { generateRandomId, getEventBody } from "../Shared/Utils";

/* this env var we defined in the GenericTable class
where we createSingleLambda */
const TABLE_NAME = process.env.TABLE_NAME;

const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from DynamoDB",
  };

  try {
    const item = getEventBody(event);

    item.spaceId = generateRandomId();

    /* will throw a meaningful error if item does not have all the fields 
    required by this method*/
    validateAsSpaceEntry(item);

    await dbClient
      .put({
        TableName: TABLE_NAME!, //we are sure table name exists at this point !
        Item: item,
      })
      .promise();
    result.body = JSON.stringify(`Created item with id: ${item.spaceId}`);
  } catch (error: any) {
    if (error instanceof MissingFieldError) {
      result.statusCode = 403;
    } else {
      result.statusCode = 500;
    }
    result.body = error.message;
  }

  return result;
}

export { handler };
