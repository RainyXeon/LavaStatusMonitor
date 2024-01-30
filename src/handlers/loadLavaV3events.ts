import chillout from "chillout";
import readdirRecursive from "recursive-readdir";
import { resolve } from "path";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Manager } from "../manager.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

export class loadLavaV3events {
  client: Manager;
  constructor(client: Manager) {
    this.client = client;
    this.loader();
  }
  async loader() {
    let eventsPath = resolve(join(__dirname, "..", "events", "lavalink_v3"));
    let eventsFile = await readdirRecursive(eventsPath);
    await this.register(eventsFile);

    this.client.logger.loader("[VERSION_3] Lavalink Server Events Loaded!");
  }

  async register(eventsFile: string[]) {
    await chillout.forEach(eventsFile, async (path) => {
      const events = new (
        await import(pathToFileURL(path).toString())
      ).default();

      var splitPath = function (str: string) {
        return str.split("\\").pop()!.split("/").pop()!.split(".")[0];
      };

      const eName = splitPath(path);
      this.client.shoukaku.on(
        eName as "raw",
        events.execute.bind(null, this.client)
      );
    });
  }
}
