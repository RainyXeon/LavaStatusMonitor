import { Manager } from "../manager.js";
import { loadCommands } from "./loadCommands.js";
import { loadMainEvents } from "./loadEvents.js";

export class initHandler {
  constructor(client: Manager) {
    new loadMainEvents(client);
    new loadCommands(client);
  }
}
