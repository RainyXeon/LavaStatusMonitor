import { RainlinkNode } from "rainlink";
import { Manager } from "../../manager.js";

export default class {
  async execute(client: Manager, node: RainlinkNode, reason: string) {
    client.logger.info(
      `Lavalink [${node.options.name}] with "${node.driver.id}" driver is disconnected! Reason: ${reason}`
    );
  }
}
