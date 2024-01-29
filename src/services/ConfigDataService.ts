import { load } from "js-yaml";
import { YAMLParseService } from "./YAMLParseService.js";
import { config } from "dotenv";
import { Config } from "../@types/Config.js";
config();

export class ConfigDataService {
  get data() {
    const yaml_files = new YAMLParseService("./app.yml").execute();

    let doc;

    const res = load(yaml_files);
    doc = res as Config;

    return doc;
  }
}
