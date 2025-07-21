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
 * Handles the `/dm` command interaction.
 * @param liora - Liora's Discord instance.
 * @param interaction - The command interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function -- It's mostly components.
export const dm: Command = async(liora, interaction) => {
  try {
    await interaction.deferReply({
      flags: [ MessageFlags.Ephemeral ],
    });
    const isEntitled = await checkGuildEntitlement(liora, interaction.guild);
    if (!isEntitled) {
      await sendUnentitledResponse(interaction);
    }
    const sentDm = await interaction.user.send({
      content: "Hello! This is a test DM from Liora.",
    }).catch(() => {
      return null;
    });

    if (!sentDm) {
      await interaction.editReply({
        components: [
          new ContainerBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `Oopsie! It looks like I am unable to send you a DM. Please check your privacy settings and try again.`,
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
            `Neato! You should have received a DM from me. If you did not, please let us know in our support channels.`,
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
    await errorHandler(error, "dm command");
    await interaction.editReply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "An error occurred while processing your request. Please try again later.",
    });
  }
};
