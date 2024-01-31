import { EmbedBuilder, TextChannel } from "discord.js";
import { Manager } from "../manager.js";
import { stripIndents } from "common-tags";
import prettyMilliseconds from "pretty-ms";
import { URL } from "url";
import { Node as ShoukakuNode } from "shoukaku";
import { Node as MagmastreamNode } from "magmastream";
import cron from "node-cron";

export class EmbedService {
  constructor(client: Manager, fetchChannel: TextChannel) {
    this.magmaStream(client, fetchChannel);
    this.shoukaku(client, fetchChannel);
  }

  async magmaStream(client: Manager, fetchChannel: TextChannel) {
    client.magmastream.nodes.map(async (data) => {
      // Send msg
      const msg = await fetchChannel.send({
        embeds: [this.magmaStreamStatusGen(client, data)],
      });

      // Update msg

      cron.schedule("0 */1 * * * *", async () => {
        msg.edit({
          embeds: [this.magmaStreamStatusGen(client, data)],
        });
      });
    });
  }

  shoukaku(client: Manager, fetchChannel: TextChannel) {
    client.shoukaku.nodes.forEach(async (data) => {
      // Send msg
      const msg = await fetchChannel.send({
        embeds: [this.shoukakuStatusGen(client, data)],
      });

      // Update msg
      cron.schedule("0 */1 * * * *", async () => {
        msg.edit({
          embeds: [this.shoukakuStatusGen(client, data)],
        });
      });
    });
  }

  parseMemory(
    data:
      | {
          free: number;
          used: number;
          allocated: number;
          reservable: number;
        }
      | undefined
  ) {
    return {
      free: (Number(data?.free) / 1024 / 1024).toFixed(2),
      used: (Number(data?.used) / 1024 / 1024).toFixed(2),
      allocated: (Number(data?.allocated) / 1024 / 1024).toFixed(2),
      reservable: (Number(data?.reservable) / 1024 / 1024).toFixed(2),
    };
  }

  shoukakuStatusGen(client: Manager, data: ShoukakuNode): EmbedBuilder {
    const parsedCredentials = new URL(data["url"]);
    const lavaMem = this.parseMemory(data.stats?.memory);

    return new EmbedBuilder()
      .setAuthor({ name: `${data.name} [v3]` })
      .setDescription(
        stripIndents`
        **📊 Status**
        \`\`\`
          Current
          ├── Status          | ${data.state == 1 ? "🟢 Online" : "🔴 Offline"}
          └── Uptime          | ${data.stats?.uptime ? prettyMilliseconds(data.stats.uptime) : "Not avalible"}
  
          CPU
          ├── Core            | ${data.stats?.cpu.cores}
          ├── System Load     | ${data.stats?.cpu.systemLoad.toFixed(2)}%
          └── Lavalink Load   | ${data.stats?.cpu.lavalinkLoad.toFixed(2)}%
  
          Player Count
          ├── Total Players   | ${data.stats?.players}
          └── Used Players    | ${data.stats?.playingPlayers}
  
          Memory Usage
          ├── Used            | ${lavaMem.used} (MB)
          ├── Free            | ${lavaMem.free} (MB)
          ├── Reservable      | ${lavaMem.reservable} (MB)
          └── Allocated       | ${lavaMem.allocated} (MB)
        \`\`\`
        **🔑 Credentials**
        \`\`\`
          Host     | ${parsedCredentials.hostname}
          Port     | ${parsedCredentials.port}
          Password | ${data["auth"]}
          Secure   | ${parsedCredentials.protocol == "ws:" ? false : true}
        \`\`\`
      `
      )
      .setColor(client.color)
      .setTimestamp();
  }

  magmaStreamStatusGen(client: Manager, data: MagmastreamNode): EmbedBuilder {
    const lavaMem = this.parseMemory(data.stats?.memory);

    return new EmbedBuilder()
      .setAuthor({ name: `${data.options.identifier} [v4]` })
      .setDescription(
        stripIndents`
        **📊 Status**
        \`\`\`
          Current
          ├── Status          | ${data.connected ? "🟢 Online" : "🔴 Offline"}
          └── Uptime          | ${data.stats?.uptime ? prettyMilliseconds(data.stats.uptime) : "Not avalible"}

          CPU
          ├── Core            | ${data.stats?.cpu.cores}
          ├── System Load     | ${data.stats?.cpu.systemLoad.toFixed(2)}%
          └── Lavalink Load   | ${data.stats?.cpu.lavalinkLoad.toFixed(2)}%

          Player Count
          ├── Total Players   | ${data.stats?.players}
          └── Used Players    | ${data.stats?.playingPlayers}

          Memory Usage
          ├── Used            | ${lavaMem.used} (MB)
          ├── Free            | ${lavaMem.free} (MB)
          ├── Reservable      | ${lavaMem.reservable} (MB)
          └── Allocated       | ${lavaMem.allocated} (MB)
        \`\`\`
        **🔑 Credentials**
        \`\`\`
          Host     | ${data.options.host}
          Port     | ${data.options.port}
          Password | ${data.options.password}
          Secure   | ${data.options.secure}
        \`\`\`
      `
      )
      .setColor(client.color)
      .setTimestamp();
  }
}
