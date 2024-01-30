import { Manager } from "../manager.js";
import { loadMainEvents } from "./loadEvents.js";
import { loadLavaV3events } from "./loadLavaV3events.js";
import { loadLavaV4events } from "./loadLavaV4events.js";

export class initHandler {
  constructor(client: Manager) {
    new loadLavaV3events(client);
    new loadLavaV4events(client);
    new loadMainEvents(client);
  }
}
