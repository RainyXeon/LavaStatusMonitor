import { Node } from "magmastream";
import { Manager } from "../../manager.js";

export default class {
  async execute(client: Manager, node: Node, error: Error) {
    client.logger.debug(
      `[VERSION_3] Lavalink "${node.options.identifier}" error ${error}`
    );
  }
}
