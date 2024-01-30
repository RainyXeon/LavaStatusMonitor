import { Manager } from "../../manager.js";

export default class {
  execute(client: Manager, name: string) {
    client.logger.debug(`[VERSION_3] Lavalink [${name}] is disconnected!`);
  }
}
