/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  TextDisplayBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

/**
 * Responds with a default image and a button to subscribe.
 * @param interaction - The interaction object from Discord.
 */
export const sendUnentitledResponse = async(
  interaction: ChatInputCommandInteraction,
): Promise<void> => {
  const components = [
    new TextDisplayBuilder().setContent(
      // eslint-disable-next-line stylistic/max-len -- Big boi string.
      "Hmm, you do not seem to have an active subscription. If you wish for me to keep your secrets, you will need to rectify that.",
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().
        setStyle(ButtonStyle.Premium).
        setSKUId("1396962587471515769"),
    ),
  ];
  await interaction.reply({
    components: components,
    flags:      [ MessageFlags.IsComponentsV2 ],
  });
};
