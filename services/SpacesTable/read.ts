import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
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
        result.body = await queryWithPrimaryPartition(
          event.queryStringParameters
        );
      } else {
        result.body = await queryWithSecondaryPartition(
          event.queryStringParameters
        );
      }
    } else {
      result.body = await scanTable();
    }
  } catch (error: any) {
    result.body = error.message;
  }

  return result;
}

async function queryWithSecondaryPartition(
  queryStringParameters: APIGatewayProxyEventQueryStringParameters
) {
  const queryKey = Object.keys(queryStringParameters)[0];
  const queryValue = queryStringParameters[queryKey];

  const queryResponse = await dbClient
    .query({
      TableName: TABLE_NAME!,
      IndexName: queryKey,
      KeyConditionExpression: "#zz = :zzzz",
      ExpressionAttributeNames: {
        "#zz": queryKey, //column
      },
      ExpressionAttributeValues: {
        ":zzzz": queryValue, //value
      },
    })
    .promise();
  return JSON.stringify(queryResponse.Items);
}

async function queryWithPrimaryPartition(
  queryStringParameters: APIGatewayProxyEventQueryStringParameters
) {
  const keyValue /* the value of spaceId query string param */ =
    queryStringParameters[PRIMARY_KEY!];

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
  return JSON.stringify(queryResponse.Items);
}

async function scanTable() {
  const queryResponse = await dbClient
    .scan({
      TableName: TABLE_NAME!, //we are sure table name exists at this point !
    })
    .promise();
  return JSON.stringify(queryResponse.Items);
}

export { handler };
