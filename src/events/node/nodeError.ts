import { RainlinkNode } from "rainlink";
import { Manager } from "../../manager.js";

export default class {
  async execute(client: Manager, node: RainlinkNode, error: Error) {
    client.logger.debug(
      `Lavalink [${node.options.name}] with "${node.driver.id}" driver error ${error}`
    );
  }
}
