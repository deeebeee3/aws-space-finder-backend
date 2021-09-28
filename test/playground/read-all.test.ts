//run vscode debug with this file open in view

import { handler } from "../../services/SpacesTable/read";

(async () => {
  const apiResponse = await handler({} as any, {} as any);

  const items = JSON.parse(apiResponse.body);

  //Put breakpoint here to see result when debugging
  console.log(items);
})();
