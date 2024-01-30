import { EmbedBuilder, TextChannel } from "discord.js";
import { Manager } from "../manager.js";
import { stripIndents } from "common-tags";
import prettyMilliseconds from "pretty-ms";

export class EmbedServices {
  constructor(client: Manager, fetchChannel: TextChannel) {
    this.magmaStream(client, fetchChannel);
    this.shoukaku(client, fetchChannel);
  }

  async magmaStream(client: Manager, fetchChannel: TextChannel) {
    client.magmastream.nodes.map(async (data) => {
      const msg = await fetchChannel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${data.options.identifier} (v4.0.0)` })
            .setDescription(
              stripIndents`
        **📊 | Status**
        \`\`\`
          Status          | ${data.connected ? "Connected" : "Disconnected"}
          Total players   | ${data.stats.players}
          Playing players | ${data.stats.playingPlayers}
          System load     | ${data.stats.cpu.systemLoad.toFixed(2)}%
          Lavalink load   | ${data.stats.cpu.lavalinkLoad.toFixed(2)}%
          Uptime          | ${prettyMilliseconds(data.stats.uptime)}
        \`\`\`
        **📜 | Credentials**
        \`\`\`
          Host     | ${data.options.host}
          Port     | ${data.options.port}
          Password | ${data.options.password}
          Secure   | ${data.options.secure}
        \`\`\`
        `
            )
            .setTimestamp(),
        ],
      });
      setInterval(() => {
        msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: `${data.options.identifier} (v4.0.0)` })
              .setDescription(
                stripIndents`
          **📊 | Status**
          \`\`\`
            Status          | ${data.connected ? "Connected" : "Disconnected"}
            Total players   | ${data.stats.players}
            Playing players | ${data.stats.playingPlayers}
            System load     | ${data.stats.cpu.systemLoad.toFixed(2)}%
            Lavalink load   | ${data.stats.cpu.lavalinkLoad.toFixed(2)}%
            Uptime          | ${prettyMilliseconds(data.stats.uptime)}
          \`\`\`
          **📜 | Credentials**
          \`\`\`
            Host     | ${data.options.host}
            Port     | ${data.options.port}
            Password | ${data.options.password}
            Secure   | ${data.options.secure}
          \`\`\`
          `
              )
              .setTimestamp(),
          ],
        });
      }, 5000);
    });
  }

  shoukaku(client: Manager, fetchChannel: TextChannel) {
    client.magmastream.nodes.map(async (data) => {
      const msg = await fetchChannel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${data.options.identifier} (v3.0.0)` })
            .setDescription(
              stripIndents`
        **📊 | Status**
        \`\`\`
          Status          | ${data.connected ? "Connected" : "Disconnected"}
          Total players   | ${data.stats.players}
          Playing players | ${data.stats.playingPlayers}
          System load     | ${data.stats.cpu.systemLoad.toFixed(2)}%
          Lavalink load   | ${data.stats.cpu.lavalinkLoad.toFixed(2)}%
          Uptime          | ${prettyMilliseconds(data.stats.uptime)}
        \`\`\`
        **📜 | Credentials**
        \`\`\`
          Host     | ${data.options.host}
          Port     | ${data.options.port}
          Password | ${data.options.password}
          Secure   | ${data.options.secure}
        \`\`\`
        `
            )
            .setTimestamp(),
        ],
      });
      setInterval(() => {
        msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: `${data.options.identifier} (v4.0.0)` })
              .setDescription(
                stripIndents`
          **📊 | Status**
          \`\`\`
            Status          | ${data.connected ? "Connected" : "Disconnected"}
            Total players   | ${data.stats.players}
            Playing players | ${data.stats.playingPlayers}
            System load     | ${data.stats.cpu.systemLoad.toFixed(2)}%
            Lavalink load   | ${data.stats.cpu.lavalinkLoad.toFixed(2)}%
            Uptime          | ${prettyMilliseconds(data.stats.uptime)}
          \`\`\`
          **📜 | Credentials**
          \`\`\`
            Host     | ${data.options.host}
            Port     | ${data.options.port}
            Password | ${data.options.password}
            Secure   | ${data.options.secure}
          \`\`\`
          `
              )
              .setTimestamp(),
          ],
        });
      }, 5000);
    });
  }
}
