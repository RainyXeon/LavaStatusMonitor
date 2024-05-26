import { RainlinkNode } from "rainlink";
import { EmbedBuilder, TextChannel } from "discord.js";
import { Manager } from "../manager.js";
import { stripIndents } from "common-tags";
import prettyMilliseconds from "pretty-ms";
import { URL } from "url";
import { Cron } from "croner";

export class EmbedService {
  constructor(client: Manager, fetchChannel: TextChannel) {
    client.rainlink.nodes.full.map(async (data) => {
      // Send msg
      const msg = await fetchChannel.send({
        embeds: [this.statusGen(client, data[1])],
      });

      // Update msg

      Cron("0 */1 * * * *", async () => {
        msg.edit({
          embeds: [this.statusGen(client, data[1])],
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

  statusGen(client: Manager, data: RainlinkNode): EmbedBuilder {
    const lavaMem = this.parseMemory(data.stats?.memory);
    const driverIdRegex = /(.*)\/v(.*)\/(.*)/;
    const asn = driverIdRegex.exec(data.driver.id)![1];
    const version = driverIdRegex.exec(data.driver.id)![2];
    const codename = driverIdRegex.exec(data.driver.id)![3];

    return new EmbedBuilder()
      .setAuthor({ name: `${data.options.name} [v${version}]` })
      .setDescription(
        stripIndents`
        **📊 Status**
        \`\`\`
          Current
          ├── Status        | ${data.state == 0 ? "🟢 Online" : "🔴 Offline"}
          └── Uptime        | ${data.stats?.uptime ? prettyMilliseconds(data.stats.uptime) : "Not avalible"}

          Player
          ├── Total         | ${data.stats?.players}
          └── Used          | ${data.stats?.playingPlayers}

          CPU
          ├── Core          | ${data.stats?.cpu.cores}
          ├── System Load   | ${data.stats?.cpu.systemLoad.toFixed(2)}%
          └── Lavalink Load | ${data.stats?.cpu.lavalinkLoad.toFixed(2)}%

          Memory
          ├── Used          | ${lavaMem.used} (MB)
          ├── Free          | ${lavaMem.free} (MB)
          ├── Reservable    | ${lavaMem.reservable} (MB)
          └── Allocated     | ${lavaMem.allocated} (MB)

          Driver
          ├── Codename      | ${codename}
          ├── Version       | v${version}
          └── Type          | ${asn}
        \`\`\`
        **🔒 Credentials**
        \`\`\`
          Host              | ${data.options.host}
          Port              | ${data.options.secure ? 443 : data.options.port}
          Password          | ${data.options.auth}
          Secure            | ${data.options.secure}
        \`\`\`
      `
      )
      .setColor(client.color)
      .setTimestamp(Date.now());
  }
}
