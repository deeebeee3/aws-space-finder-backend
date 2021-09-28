//run vscode debug with this file open in view

import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/read";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    location: "London",
  },
} as any;

(async () => {
  const apiResponse = await handler(event as any, {} as any);

  const items = JSON.parse(apiResponse.body);

  //Put breakpoint here to see result when debugging
  console.log(items);
})();
