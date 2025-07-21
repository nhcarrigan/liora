/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import {
  TextDisplayBuilder,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
} from "discord.js";
import { sendUnentitledResponse } from "../modules/sendUnentitledResponse.js";
import { checkGuildEntitlement } from "../utils/checkEntitlement.js";
import { errorHandler } from "../utils/errorHandler.js";
import type { Command } from "../interfaces/command.js";

/**
 * Handles the `/add` command interaction.
 * @param liora - Liora's Discord instance.
 * @param interaction - The command interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function -- It's mostly components.
export const list: Command = async(liora, interaction) => {
  try {
    await interaction.deferReply({
      flags: [ MessageFlags.Ephemeral ],
    });
    const isEntitled = await checkGuildEntitlement(liora, interaction.guild);
    if (!isEntitled) {
      await sendUnentitledResponse(interaction);
    }
    const record = await liora.database.highlights.upsert({
      create: {
        serverId: interaction.guildId,
        userId:   interaction.user.id,
        words:    [],
      },
      update: {},
      where:  {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Prisma convention.
        serverId_userId: {
          serverId: interaction.guildId,
          userId:   interaction.user.id,
        },
      },
    });

    if (record.words.length <= 0) {
      await interaction.editReply({
        components: [
          new ContainerBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `Huh. It does not look like you have added any highlights for this server yet. You can do that with the \`/add\` command!`,
            ),
          ),
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().
              setStyle(ButtonStyle.Link).
              setLabel("Discord Server").
              setURL("https://chat.nhcarrigan.com"),
            new ButtonBuilder().
              setStyle(ButtonStyle.Link).
              setLabel("Forum").
              setURL("https://forum.nhcarrigan.com"),
          ),
        ],
        flags: [ MessageFlags.IsComponentsV2 ],
      });
      return;
    }

    await interaction.editReply({
      components: [
        new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `You have configured the following words to be highlighted in this server:`,
          ),
        ).
          addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).
              setSpacing(SeparatorSpacingSize.Small),
          ).
          addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `\`${record.words.join("`, `")}\``,
            ),
          ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().
            setStyle(ButtonStyle.Link).
            setLabel("Discord Server").
            setURL("https://chat.nhcarrigan.com"),
          new ButtonBuilder().
            setStyle(ButtonStyle.Link).
            setLabel("Forum").
            setURL("https://forum.nhcarrigan.com"),
        ),
      ],
      flags: [ MessageFlags.IsComponentsV2 ],
    });
  } catch (error) {
    await errorHandler(error, "list command");
    await interaction.editReply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "An error occurred while processing your request. Please try again later.",
    });
  }
};
