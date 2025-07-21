import { ApplicationIntegrationType, ChannelType, InteractionContextType, SlashCommandBuilder } from "discord.js";

const about = new SlashCommandBuilder()
  .setName("about")
  .setDescription("Get information about this application.")
  .setContexts([InteractionContextType.Guild])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]);

const add = new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a word to your highlights.")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .addStringOption((option) =>
        option
            .setName("word")
            .setDescription("The word to add to your highlights.")
            .setRequired(true)
            .setMaxLength(100),
    )

const remove = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a word from your highlights.")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .addStringOption((option) =>
        option
            .setName("word")
            .setDescription("The word to remove from your highlights.")
            .setRequired(true)
            .setMaxLength(100),
    )
const list = new SlashCommandBuilder()
    .setName("list")
    .setDescription("List your highlights.")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])

const dm = new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Confirm that Liora can DM you.")
    .setContexts([InteractionContextType.Guild])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])

console.log(JSON.stringify([
    about.toJSON(),
    add.toJSON(),
    remove.toJSON(),
    list.toJSON(),
    dm.toJSON()
]));