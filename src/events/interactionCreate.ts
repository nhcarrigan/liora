/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { about } from "../commands/about.js";
import { add } from "../commands/add.js";
import { dm } from "../commands/dm.js";
import { list } from "../commands/list.js";
import { remove } from "../commands/remove.js";
import type { Command } from "../interfaces/command.js";
import type { Liora } from "../interfaces/liora.js";
import type { ChatInputCommandInteraction } from "discord.js";

const handlers: { _default: Command } & Record<string, Command> = {
  _default: async(_, interaction): Promise<void> => {
    await interaction.reply({
      content: `Unknown command: ${interaction.commandName}`,
    });
  },
  about:  about,
  add:    add,
  dm:     dm,
  list:   list,
  remove: remove,
};

/**
 * Processes a slash command.
 * @param liora - Liora's Discord instance.
 * @param interaction - The command interaction payload from Discord.
 */
const chatInputInteractionCreate = async(
  liora: Liora,
  interaction: ChatInputCommandInteraction<"cached">,
): Promise<void> => {
  const name = interaction.commandName;
  // eslint-disable-next-line no-underscore-dangle -- We use _default as a fallback handler.
  const handler = handlers[name] ?? handlers._default;
  await handler(liora, interaction);
};

export { chatInputInteractionCreate };
