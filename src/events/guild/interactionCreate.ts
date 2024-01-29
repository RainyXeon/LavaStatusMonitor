import {
  ApplicationCommandOptionType,
  Attachment,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import { Manager } from "../../manager.js";
import { GlobalInteraction } from "../../@types/Interaction.js";
import { ConvertToMention } from "../../utils/ConvertToMention.js";
import { CommandHandler } from "../../structures/CommandHandler.js";

/**
 * @param {GlobalInteraction} interaction
 */

export default class {
  async execute(client: Manager, interaction: GlobalInteraction) {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.guild || interaction.user.bot) return;

    let subCommandName = "";
    try {
      subCommandName = (
        (interaction as CommandInteraction)
          .options as CommandInteractionOptionResolver
      ).getSubcommand();
    } catch {}
    let subCommandGroupName = "";
    try {
      subCommandGroupName = (
        (interaction as CommandInteraction)
          .options as CommandInteractionOptionResolver
      ).getSubcommandGroup()!;
    } catch {}

    const commandNameArray = [];

    if (interaction.commandName) commandNameArray.push(interaction.commandName);
    if (subCommandName.length !== 0 && !subCommandGroupName)
      commandNameArray.push(subCommandName);
    if (subCommandGroupName) {
      commandNameArray.push(subCommandGroupName);
      commandNameArray.push(subCommandName);
    }

    const command = client.commands.get(commandNameArray.join("-"));

    if (!command) return commandNameArray.length == 0;

    if (!command) return;

    try {
      const args = [];
      let attachments: Attachment | undefined;

      for (const data of interaction.options.data) {
        const check = new ConvertToMention().execute({
          type: data.type,
          value: String(data.value),
        });
        if (check !== "error") {
          args.push(check);
        } else if (data.type == ApplicationCommandOptionType.Attachment) {
          attachments = data.attachment;
        } else {
          if (data.value) args.push(String(data.value));
          if (data.options) {
            for (const optionData of data.options) {
              if (optionData.value) args.push(String(optionData.value));
            }
          }
        }
      }

      const handler = new CommandHandler({
        interaction: interaction as CommandInteraction,
        client: client,
        args: args,
        prefix: "/",
      });

      if (attachments) handler.addSingleAttachment(attachments);

      client.logger.info(
        `[COMMAND] ${commandNameArray.join("-")} used by ${
          interaction.user.username
        } from ${interaction.guild.name} (${interaction.guild.id})`
      );

      command.execute(client, handler);
    } catch (error) {
      client.logger.log({
        level: "error",
        message: error,
      });
    }
  }
}
