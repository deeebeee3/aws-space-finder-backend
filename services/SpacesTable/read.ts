import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

/* this env var we defined in the GenericTable class
where we createSingleLambda */
const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

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
    if (event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        const keyValue /* the value of spaceId query string param */ =
          event.queryStringParameters[PRIMARY_KEY!];

        const queryResponse = await dbClient
          .query({
            TableName: TABLE_NAME!,
            KeyConditionExpression: "#zz = :zzzz",
            ExpressionAttributeNames: {
              "#zz": PRIMARY_KEY!, //column
            },
            ExpressionAttributeValues: {
              ":zzzz": keyValue!, //value
            },
          })
          .promise();
        result.body = JSON.stringify(queryResponse);
      }
    } else {
      const queryResponse = await dbClient
        .scan({
          TableName: TABLE_NAME!, //we are sure table name exists at this point !
        })
        .promise();
      result.body = JSON.stringify(queryResponse);
    }
  } catch (error: any) {
    result.body = error.message;
  }

  return result;
}

export { handler };
