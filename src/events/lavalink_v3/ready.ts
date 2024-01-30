import { Manager } from "../../manager.js";

export default class {
  execute(client: Manager, name: string) {
    client.logger.info(`[VERSION_3] Lavalink [${name}] is connected!`);
  }
}
