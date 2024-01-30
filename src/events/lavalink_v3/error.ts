import { Manager } from "../../manager.js";

export default class {
  async execute(client: Manager, name: string, error: Error) {
    client.logger.debug(`[VERSION_3] Lavalink [${name}] is errored! ${error}`);
  }
}
