import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { getEventBody } from "../Shared/Utils";

/* this env var we defined in the GenericTable class
where we createSingleLambda */
const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;

const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from DynamoDB",
  };

  const requestBody = getEventBody(event);

  const spaceId = event.queryStringParameters?.[PRIMARY_KEY];

  if (requestBody && spaceId) {
    const requestBodyKey = Object.keys(requestBody)[0];
    const requestBodyvalue = requestBody[requestBodyKey];

    const updateResult = await dbClient
      .update({
        TableName: TABLE_NAME,
        Key: {
          [PRIMARY_KEY]: spaceId, //row
        },
        UpdateExpression: "set #zzzNew = :new",
        ExpressionAttributeNames: {
          "#zzzNew": requestBodyKey, //column
        },
        ExpressionAttributeValues: {
          ":new": requestBodyvalue, //value
        },
        ReturnValues: "UPDATED_NEW",
      })
      .promise();

    result.body = JSON.stringify(updateResult);
  }

  return result;
}

export { handler };
