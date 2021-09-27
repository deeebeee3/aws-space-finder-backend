import { handler } from "../../services/SpacesTable/create";

const event = {
  body: {
    location: "Paris",
  },
};

handler(event as any, {} as any);
