import { EmbedBuilder, TextChannel } from "discord.js";
import { Manager } from "../manager.js";
import { stripIndents } from "common-tags";
import prettyMilliseconds from "pretty-ms";
import { URL } from "url";

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
          Memory usage    | ${(data.stats?.memory.used / 1024 / 1024).toFixed(2)} / ${(data.stats?.memory.allocated / 1024 / 1024).toFixed(2)} (MB)
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
            Memory usage    | ${(data.stats?.memory.used / 1024 / 1024).toFixed(2)} / ${(data.stats?.memory.allocated / 1024 / 1024).toFixed(2)} (MB)
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
    client.shoukaku.nodes.forEach(async (data) => {
      const parsedCredentials = new URL(data["url"]);
      const msg = await fetchChannel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${data.name} (v3.0.0)` })
            .setDescription(
              stripIndents`
        **📊 | Status**
        \`\`\`
          Status          | ${data.state == 1 ? "Connected" : "Disconnected"}
          Total players   | ${data.stats?.players}
          Playing players | ${data.stats?.playingPlayers}
          System load     | ${data.stats?.cpu.systemLoad.toFixed(2)}%
          Lavalink load   | ${data.stats?.cpu.lavalinkLoad.toFixed(2)}%
          Memory usage    | ${(Number(data.stats?.memory.used) / 1024 / 1024).toFixed(2)} / ${(Number(data.stats?.memory.allocated) / 1024 / 1024).toFixed(2)} (MB)
          Uptime          | ${data.stats?.uptime ? prettyMilliseconds(data.stats.uptime) : "Not avalible"}
        \`\`\`
        **📜 | Credentials**
        \`\`\`
          Host     | ${parsedCredentials.hostname}
          Port     | ${parsedCredentials.port}
          Password | ${data["auth"]}
          Secure   | ${parsedCredentials.protocol == "ws:" ? false : true}
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
              .setAuthor({ name: `${data.name} (v3.0.0)` })
              .setDescription(
                stripIndents`
          **📊 | Status**
          \`\`\`
            Status          | ${data.state == 1 ? "Connected" : "Disconnected"}
            Total players   | ${data.stats?.players}
            Playing players | ${data.stats?.playingPlayers}
            System load     | ${data.stats?.cpu.systemLoad.toFixed(2)}%
            Lavalink load   | ${data.stats?.cpu.lavalinkLoad.toFixed(2)}%
            Memory usage    | ${(Number(data.stats?.memory.used) / 1024 / 1024).toFixed(2)} / ${(Number(data.stats?.memory.allocated) / 1024 / 1024).toFixed(2)} (MB)
            Uptime          | ${data.stats?.uptime ? prettyMilliseconds(data.stats.uptime) : "Not avalible"}
          \`\`\`
          **📜 | Credentials**
          \`\`\`
            Host     | ${parsedCredentials.hostname}
            Port     | ${parsedCredentials.port}
            Password | ${data["auth"]}
            Secure   | ${parsedCredentials.protocol == "ws:" ? false : true}
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
