import { EmbedBuilder, TextChannel } from "discord.js";
import { Manager } from "../../manager.js";
import { stripIndents } from "common-tags";
import prettyMilliseconds from "pretty-ms";
import { EmbedServices } from "../../services/EmbedServices.js";

export default class {
  async execute(client: Manager) {
    client.logger.info(`Logged in ${client.user!.tag}`);

    await client.magmastream.init(String(client.user?.id));

    setInterval(() => {
      client.user!.setPresence({
        activities: [
          {
            name: `v${client.metadata.version}`,
            type: 2,
          },
        ],
        status: "idle",
      });
    }, 15000);

    const fetchChannel = await client.channels.fetch(
      client.config.bot.CHANNEL_ID
    );
    if (!fetchChannel || !fetchChannel.isTextBased()) {
      throw new Error("Channel is not avalible");
      process.exit();
    }

    new EmbedServices(client, fetchChannel as TextChannel);
  }
}
