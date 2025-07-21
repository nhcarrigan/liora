/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import {
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} from "discord.js";
import { errorHandler } from "../utils/errorHandler.js";
import type { Command } from "../interfaces/command.js";

/**
 * Handles the `/about` command interaction.
 * @param _liora - Liora's Discord instance (unused).
 * @param interaction - The command interaction payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function -- It's mostly components.
export const about: Command = async(_liora, interaction) => {
  try {
    const components = [
      new ContainerBuilder().
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent("# About Liora"),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            // eslint-disable-next-line stylistic/max-len -- Big boi string.
            "Hi there~! I am Liora, a bot that can send you a DM when a message contains a word you have added to your highlights.",
          ),
        ).
        addSeparatorComponents(
          new SeparatorBuilder().
            setSpacing(SeparatorSpacingSize.Small).
            setDivider(true),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent("## What can I do?"),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            // eslint-disable-next-line stylistic/max-len -- Big boi string.
            "To get started, a member of your community will need to purchase the server subscription from my Discord store. Then you can configure your highlights with the `/add` and `/remove` commands. When a word you have added is mentioned in the server, I will send you a DM with a link to the message.\n\nMake sure you have DMs enabled so I can send you notifications!",
          ),
        ).
        addSeparatorComponents(
          new SeparatorBuilder().
            setSpacing(SeparatorSpacingSize.Small).
            setDivider(true),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent("## What if I need help?"),
        ).
        addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            // eslint-disable-next-line stylistic/max-len -- Big boi string.
            "My deepest apologies if I have made a mistake! Please reach out to us in our Discord server or on the forum, and we will do our best to assist you.",
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
    ];
    await interaction.reply({
      components: components,
      flags:      MessageFlags.IsComponentsV2,
    });
  } catch (error) {
    await errorHandler(error, "about command");
    await interaction.reply({
      content:
        // eslint-disable-next-line stylistic/max-len -- Big boi string.
        "An error occurred while processing your request. Please try again later.",
    });
  }
};
