import {
  Client,
  GatewayIntentBits,
  Collection,
  ColorResolvable,
} from "discord.js";
import { ConfigDataService } from "./services/ConfigDataService.js";
import { LoggerService } from "./services/LoggerService.js";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { Metadata } from "./@types/Metadata.js";
import { ManifestService } from "./services/ManifestService.js";
import { Config } from "./@types/Config.js";
import { config } from "dotenv";
import { initHandler } from "./handlers/index.js";
import utils from "node:util";
import { DeployService } from "./services/DeployService.js";
import { Command } from "./structures/Command.js";
config();

const loggerService = new LoggerService().init();
const configData = new ConfigDataService().data;

loggerService.info("Booting client...");

export class Manager extends Client {
  // Interface
  token: string;
  metadata: Metadata;
  config: Config;
  logger: any;
  owner: string;
  color: ColorResolvable;
  prefix: string;
  shard_status: boolean;
  commands: Collection<string, Command>;
  aliases: Collection<string, string>;
  cluster?: ClusterClient<Client>;

  // Main class
  constructor() {
    super({
      // shards: getInfo().SHARD_LIST, // An array of shards that will get spawned
      // shardCount: getInfo().TOTAL_SHARDS, // Total number of shards
      shards: process.env.IS_SHARING == "true" ? getInfo().SHARD_LIST : "auto",
      shardCount: process.env.IS_SHARING == "true" ? getInfo().TOTAL_SHARDS : 1,
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
      },
      intents: configData.features.MESSAGE_CONTENT.enable
        ? [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
          ]
        : [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
          ],
    });
    this.logger = loggerService;
    this.config = configData;
    this.metadata = new ManifestService().data.metadata.bot;
    this.token = this.config.bot.TOKEN;
    this.owner = this.config.bot.OWNER_ID;
    this.color = (this.config.bot.EMBED_COLOR || "#2b2d31") as ColorResolvable;
    this.prefix = this.config.features.MESSAGE_CONTENT.commands.prefix || "d!";
    this.shard_status = false;

    // Collections
    this.commands = new Collection();
    this.aliases = new Collection();

    // Sharing
    this.cluster =
      process.env.IS_SHARING == "true" ? new ClusterClient(this) : undefined;

    process.on("unhandledRejection", (error) =>
      this.logger.log({ level: "error", message: utils.inspect(error) })
    );
    process.on("uncaughtException", (error) =>
      this.logger.log({ level: "error", message: utils.inspect(error) })
    );

    new DeployService(this);
    new initHandler(this);
  }

  connect() {
    super.login(this.token);
  }
}
