import { Manager } from "../../manager.js";
import { RainlinkNode } from "rainlink";

export default class {
  async execute(client: Manager, node: RainlinkNode) {
    client.logger.info(
      `Lavalink [${node.options.name}] with "${node.driver.id}" driver is connected!`
    );
  }
}
