/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  type Message,
} from "discord.js";
import { checkGuildEntitlement } from "../utils/checkEntitlement.js";
import type { Liora } from "../interfaces/liora.js";

/**
 * Processes a slash command.
 * @param liora - Liora's Discord instance.
 * @param message - The message payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function -- It's mostly components.
const messageCreate = async(
  liora: Liora,
  message: Message<true>,
): Promise<void> => {
  const isEntitled = await checkGuildEntitlement(liora, message.guild);
  if (!isEntitled) {
    return;
  }
  const highlights = await liora.database.highlights.findMany({
    where: {
      serverId: message.guild.id,
    },
  });

  if (highlights.length <= 0) {
    return;
  }

  await Promise.all(
    // eslint-disable-next-line max-lines-per-function -- It's mostly components.
    highlights.map(async(record) => {
      // No need to notify the user if they are the one who sent the message.
      if (record.userId === message.author.id) {
        return;
      }
      if (record.words.length <= 0) {
        return;
      }
      const foundWords = record.words.filter((word) => {
        return message.content.toLowerCase().includes(word.toLowerCase());
      });
      if (foundWords.length <= 0) {
        return;
      }
      const dm = await message.client.users.fetch(record.userId).catch(() => {
        return null;
      });
      if (!dm) {
        return;
      }
      await dm.send({
        components: [
          new ContainerBuilder().
            addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                "One of your highlights was mentioned in a message!",
              ),
            ).
            addSeparatorComponents(
              new SeparatorBuilder().
                setSpacing(SeparatorSpacingSize.Small).
                setDivider(true),
            ).
            addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `The word(s) \`${foundWords.join(
                  ", ",
                )}\` were mentioned in the server \`${
                  message.guild.name
                }\` by ${message.author.displayName}.`,
              ),
            ).
            addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `You can view the message here: ${message.url}`,
              ),
            ),
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().
              setStyle(ButtonStyle.Link).
              setLabel("Jump to Message").
              setURL(message.url),
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
      }).catch(() => {
        // If we cannot send the DM, we do not want to throw an error.
        return null;
      });
    }),
  );
};

export { messageCreate };
