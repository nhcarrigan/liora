/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import type { Liora } from "./liora.js";
import type { ChatInputCommandInteraction } from "discord.js";

export type Command = (
  liora: Liora,
  interaction: ChatInputCommandInteraction<"cached">
)=> Promise<void>;
