import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

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
    const queryResponse = await dbClient
      .scan({
        TableName: TABLE_NAME!, //we are sure table name exists at this point !
      })
      .promise();
    result.body = JSON.stringify(queryResponse);
  } catch (error: any) {
    result.body = error.message;
  }

  return result;
}

export { handler };
