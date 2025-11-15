const { Events, InteractionType } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Only process Chat Input Commands (Slash Commands)
        if (!interaction.isChatInputCommand()) return

        // Fetch the command module from the collection we built in commandHandler.js
        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`
            )
            return
        }

        try {
            // Execute the command's logic
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            const content = 'There was an error while executing this command!'

            // Check if interaction has already been replied to, then use followUp
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content, ephemeral: true })
            } else {
                await interaction.reply({ content, ephemeral: true })
            }
        }
    },
}
