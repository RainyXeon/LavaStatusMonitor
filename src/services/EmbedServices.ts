import { EmbedBuilder, TextChannel } from "discord.js";
import { Manager } from "../manager.js";
import { stripIndents } from "common-tags";
import prettyMilliseconds from "pretty-ms";
import { URL } from "url";
import { Node as ShoukakuNode } from "shoukaku";
import { Node as MagmastreamNode } from "magmastream";

export class EmbedServices {
  constructor(client: Manager, fetchChannel: TextChannel) {
    this.magmaStream(client, fetchChannel);
    this.shoukaku(client, fetchChannel);
  }

  async magmaStream(client: Manager, fetchChannel: TextChannel) {
    client.magmastream.nodes.map(async (data) => {
      // Send msg
      const msg = await fetchChannel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${data.options.identifier} (v4.0.0)` })
            .setDescription(this.magmaStreamStatusGen(data))
            .setTimestamp(),
        ],
      });

      // Update msg
      setInterval(() => {
        msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: `${data.options.identifier} (v4.0.0)` })
              .setDescription(this.magmaStreamStatusGen(data))
              .setTimestamp(),
          ],
        });
      }, 5000);
    });
  }

  shoukaku(client: Manager, fetchChannel: TextChannel) {
    client.shoukaku.nodes.forEach(async (data) => {
      // Send msg
      const msg = await fetchChannel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${data.name} (v3.0.0)` })
            .setDescription(this.shoukakuStatusGen(data))
            .setTimestamp(),
        ],
      });

      // Update msg
      setInterval(() => {
        msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: `${data.name} (v3.0.0)` })
              .setDescription(this.shoukakuStatusGen(data))
              .setTimestamp(),
          ],
        });
      }, 5000);
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

  shoukakuStatusGen(data: ShoukakuNode): string {
    const parsedCredentials = new URL(data["url"]);
    const lavaMem = this.parseMemory(data.stats?.memory);

    return stripIndents`
      **📊 Status**
      \`\`\`
        Current
        ├── Status          | ${data.state == 1 ? "🟢 Online" : "🔴 Offline"}
        └── Uptime          | ${data.stats?.uptime ? prettyMilliseconds(data.stats.uptime) : "Not avalible"}

        CPU
        ├── Core            | ${data.stats?.cpu.cores}
        ├── System load     | ${data.stats?.cpu.systemLoad.toFixed(2)}%
        └── Lavalink load   | ${data.stats?.cpu.lavalinkLoad.toFixed(2)}%

        Player count
        ├── Total players   | ${data.stats?.players}
        └── Playing players | ${data.stats?.playingPlayers}

        Memory usage
        ├── Used            | ${lavaMem.used} (MB)
        ├── Free            | ${lavaMem.free} (MB)
        ├── Reservable      | ${lavaMem.reservable} (MB)
        └── Allocated       | ${lavaMem.allocated} (MB)
      \`\`\`
      **📜 Credentials**
      \`\`\`
        Host     | ${parsedCredentials.hostname}
        Port     | ${parsedCredentials.port}
        Password | ${data["auth"]}
        Secure   | ${parsedCredentials.protocol == "ws:" ? false : true}
      \`\`\`
    `;
  }

  magmaStreamStatusGen(data: MagmastreamNode): string {
    const lavaMem = this.parseMemory(data.stats?.memory);

    return stripIndents`
      **📊 Status**
      \`\`\`
        Current
        ├── Status          | ${data.connected ? "🟢 Online" : "🔴 Offline"}
        └── Uptime          | ${data.stats?.uptime ? prettyMilliseconds(data.stats.uptime) : "Not avalible"}

        CPU
        ├── Core            | ${data.stats?.cpu.cores}
        ├── System load     | ${data.stats?.cpu.systemLoad.toFixed(2)}%
        └── Lavalink load   | ${data.stats?.cpu.lavalinkLoad.toFixed(2)}%

        Player count
        ├── Total players   | ${data.stats?.players}
        └── Playing players | ${data.stats?.playingPlayers}

        Memory usage
        ├── Used            | ${lavaMem.used} (MB)
        ├── Free            | ${lavaMem.free} (MB)
        ├── Reservable      | ${lavaMem.reservable} (MB)
        └── Allocated       | ${lavaMem.allocated} (MB)
      \`\`\`
      **📜 Credentials**
      \`\`\`
        Host     | ${data.options.host}
        Port     | ${data.options.port}
        Password | ${data.options.password}
        Secure   | ${data.options.secure}
      \`\`\`
    `;
  }
}
