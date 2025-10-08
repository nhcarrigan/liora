/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { DiscordAnalytics } from "@nhcarrigan/discord-analytics";
import { PrismaClient } from "@prisma/client";
import {
  Client,
  Events,
  GatewayIntentBits,
} from "discord.js";
import { chatInputInteractionCreate } from "./events/interactionCreate.js";
import { messageCreate } from "./events/messageCreate.js";
import { instantiateServer } from "./server/serve.js";
import { logger } from "./utils/logger.js";
import type { Liora } from "./interfaces/liora.js";

const liora: Liora = {
  database: new PrismaClient(),
  discord:  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  }),
};

const analytics = new DiscordAnalytics(liora.discord, logger);

liora.discord.once(Events.ClientReady, () => {
  void logger.log(
    "debug",
    `Logged in as ${liora.discord.user?.username ?? "unknown"}`,
  );
  analytics.startCron();
});

liora.discord.on(Events.InteractionCreate, (interaction) => {
  void analytics.logGatewayEvent(Events.InteractionCreate, { ...interaction });
  if (interaction.isChatInputCommand()) {
    if (!interaction.inCachedGuild()) {
      void interaction.reply({
        content: "How did you get here? This command is not available in DMs.",
      });
      return;
    }
    void chatInputInteractionCreate(liora, interaction);
  }
});

liora.discord.on(Events.MessageCreate, (message) => {
  if (!message.inGuild()) {
    return;
  }
  void messageCreate(liora, message);
});

await liora.database.$connect();
await liora.discord.login(process.env.DISCORD_TOKEN);
instantiateServer();
