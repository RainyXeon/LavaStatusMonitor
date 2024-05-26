import { Manager } from "../manager.js";
import { loadMainEvents } from "./loadEvents.js";
import { loadNodeEvents } from "./loadNodeEvents.js";

export class initHandler {
  constructor(client: Manager) {
    new loadNodeEvents(client);
    new loadMainEvents(client);
  }
}
