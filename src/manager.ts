import { Client, GatewayIntentBits, ColorResolvable } from "discord.js";
import { ConfigDataService } from "./services/ConfigDataService.js";
import { LoggerService } from "./services/LoggerService.js";
import { ClusterClient } from "discord-hybrid-sharding";
import { Metadata } from "./@types/Metadata.js";
import { ManifestService } from "./services/ManifestService.js";
import { Config } from "./@types/Config.js";
import { config } from "dotenv";
import { initHandler } from "./handlers/index.js";
import utils from "node:util";
import { Rainlink, Library } from "rainlink";
const loggerService = new LoggerService().init();
const configData = new ConfigDataService().data;
config();

export class Manager extends Client {
  // Interface
  token: string;
  metadata: Metadata;
  config: Config;
  logger: any;
  color: ColorResolvable;
  shard_status: boolean;
  cluster?: ClusterClient<Client>;
  rainlink: Rainlink;

  // Main class
  constructor() {
    super({
      // shards: getInfo().SHARD_LIST, // An array of shards that will get spawned
      // shardCount: getInfo().TOTAL_SHARDS, // Total number of shards
      shards: "auto",
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
      ],
    });
    loggerService.info("Booting client...");
    this.logger = loggerService;
    this.config = configData;
    this.metadata = new ManifestService().data.metadata.bot;
    this.token = this.config.bot.TOKEN;
    this.color = (this.config.bot.EMBED_COLOR || "#2b2d31") as ColorResolvable;
    this.shard_status = false;
    this.rainlink = new Rainlink({
      nodes: this.config.bot.NODES,
      library: new Library.DiscordJS(this),
      options: {
        retryCount: Infinity,
        retryTimeout: 5000,
      },
    });

    // Sharing
    this.cluster =
      process.env.IS_SHARING == "true" ? new ClusterClient(this) : undefined;

    process.on("unhandledRejection", (error) =>
      this.logger.log({ level: "error", message: utils.inspect(error) })
    );
    process.on("uncaughtException", (error) =>
      this.logger.log({ level: "error", message: utils.inspect(error) })
    );

    new initHandler(this);
  }

  connect() {
    super.login(this.token);
  }

  configChecker() {
    if (!configData.bot.CHANNEL_ID) {
      throw new Error("app.yml must have CHANNEL_ID");
      process.exit();
    }

    if (!configData.bot.NODES || configData.bot.NODES.length == 0) {
      throw new Error("app.yml must have NODES data");
      process.exit();
    }
  }
}
