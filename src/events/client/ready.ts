import { EmbedBuilder, TextChannel } from "discord.js";
import { Manager } from "../../manager.js";
import { stripIndents } from "common-tags";
import prettyMilliseconds from "pretty-ms";
import { EmbedService } from "../../services/EmbedService.js";

export default class {
  async execute(client: Manager) {
    client.logger.info(`Logged in ${client.user!.tag}`);

    setInterval(() => {
      client.user!.setPresence({
        activities: [
          {
            name: `Lavalink Status`,
            type: 3,
          },
        ],
        status: "online",
      });
    }, 15000);

    const fetchChannel = await client.channels.fetch(
      client.config.bot.CHANNEL_ID
    );
    if (!fetchChannel || !fetchChannel.isTextBased()) {
      throw new Error("Channel is not avalible");
      process.exit();
    }

    new EmbedService(client, fetchChannel as TextChannel);
  }
}
