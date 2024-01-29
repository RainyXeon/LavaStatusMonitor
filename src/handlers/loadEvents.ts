import chillout from "chillout";
import readdirRecursive from "recursive-readdir";
import { resolve } from "node:path";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "url";
import { Manager } from "../manager.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

export class loadMainEvents {
  client: Manager;
  constructor(client: Manager) {
    this.client = client;
    this.loader();
  }
  async loader() {
    await chillout.forEach(["client", "guild", "shard"], async (path) => {
      let eventsPath = resolve(join(__dirname, "..", "events", path));
      let eventsFile = await readdirRecursive(eventsPath);
      await this.registerPath(eventsFile);
    });
    this.client.logger.loader(`Client Events Loaded!`);
  }

  async registerPath(eventsPath: string[]) {
    await chillout.forEach(eventsPath, async (path) => {
      await this.registerEvents(path);
    });
  }

  async registerEvents(path: string) {
    const events = new (await import(pathToFileURL(path).toString())).default();

    var splitPath = function (str: string) {
      return str.split("\\").pop()!.split("/").pop()!.split(".")[0];
    };

    const eName = splitPath(path);

    this.client.on(eName!, events.execute.bind(null, this.client));
  }
}
