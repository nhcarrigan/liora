/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { entitledGuilds } from "../config/entitlements.js";
import type { Liora } from "../interfaces/liora.js";
import type { Guild } from "discord.js";

/**
 * Checks if a guild has subscribed.
 * @param liora - Liora's Discord instance.
 * @param guild - The guild to check.
 * @returns A boolean indicating whether the guild has an active subscription.
 */
const checkGuildEntitlement = async(
  liora: Liora,
  guild: Guild,
): Promise<boolean> => {
  if (entitledGuilds.includes(guild.id)) {
    return true;
  }
  const entitlements = await liora.discord.application?.entitlements.fetch({
    excludeDeleted: true,
    excludeEnded:   true,
    guild:          guild,
  });
  return Boolean(entitlements && entitlements.size > 0);
};

export { checkGuildEntitlement };
