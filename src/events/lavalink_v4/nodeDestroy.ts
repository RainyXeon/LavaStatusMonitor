import { Manager } from "../../manager.js";
import { Node } from "magmastream";

export default class {
  async execute(client: Manager, node: Node) {
    client.logger.info(
      `[VERSION_4] Lavalink [${node.options.identifier}] is closed!`
    );
  }
}
