//run vscode debug with this file open in view

import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/read";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "1b870f80-1bf3-4f87-926d-f40640ed7f63",
  },
} as any;

(async () => {
  const apiResponse = await handler(event as any, {} as any);

  const item = JSON.parse(apiResponse.body);

  //Put breakpoint here to see result when debugging
  console.log(item);
})();
