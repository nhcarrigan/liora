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
} from "discord.js";
import { sendUnentitledResponse } from "../modules/sendUnentitledResponse.js";
import { checkGuildEntitlement } from "../utils/checkEntitlement.js";
import { errorHandler } from "../utils/errorHandler.js";
import type { Command } from "../interfaces/command.js";

/**
 * Handles the `/remove` command interaction.
 * @param liora - Liora's Discord instance.
 * @param interaction - The command interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function -- It's mostly components.
export const remove: Command = async(liora, interaction) => {
  try {
    await interaction.deferReply({
      flags: [ MessageFlags.Ephemeral ],
    });
    const isEntitled = await checkGuildEntitlement(liora, interaction.guild);
    if (!isEntitled) {
      await sendUnentitledResponse(interaction);
    }
    const wordToRemove = interaction.options.getString("word", true);
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

    if (!record.words.includes(wordToRemove)) {
      await interaction.editReply({
        components: [
          new ContainerBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `Oh dear, it looks like you have not added the word \`${wordToRemove}\` to your highlights!`,
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
    record.words = record.words.filter((word) => {
      return word !== wordToRemove;
    });
    await liora.database.highlights.update({
      data: {
        words: record.words,
      },
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Prisma convention.
        serverId_userId: {
          serverId: interaction.guildId,
          userId:   interaction.user.id,
        },
      },
    });
    await interaction.editReply({
      components: [
        new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `Okay, I will no longer notify you in DMs when \`${wordToRemove}\` is mentioned in this server.`,
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
    await errorHandler(error, "remove command");
    await interaction.editReply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "An error occurred while processing your request. Please try again later.",
    });
  }
};
