//run vscode debug with this file open in view

import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/delete";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "b825fec5-5f50-4085-bdad-6cce05e6de7d",
  },
} as any;

(async () => {
  const apiResponse = await handler(event as any, {} as any);

  const item = JSON.parse(apiResponse.body);

  //Put breakpoint here to see result when debugging
  console.log(item);
})();
