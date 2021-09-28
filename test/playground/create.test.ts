//run vscode debug with this file open in view

import { handler } from "../../services/SpacesTable/create";

const event = {
  body: {
    location: "Paris",
  },
};

(async () => {
  const apiResponse = await handler(event as any, {} as any);

  const responseBody = JSON.parse(apiResponse.body);

  //Put breakpoint here to see result when debugging
  console.log(responseBody);
})();
