import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";

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

  const item =
    typeof event.body === "object" ? event.body : JSON.parse(event.body);
  item.spaceId = v4();

  try {
    await dbClient
      .put({
        TableName: TABLE_NAME!, //we are sure table name exists at this point !
        Item: item,
      })
      .promise();
    result.body = JSON.stringify(`Created item with id: ${item.spaceId}`);
  } catch (error: any) {
    result.body = error.message;
  }

  return result;
}

export { handler };