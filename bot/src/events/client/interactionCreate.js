const { Events, InteractionType } = require('discord.js')
const blocksButtonHandlers = require('../../interactions/buttons/blocksButtonHandler.js')
const addBlocksButtonHandlers = require('../../interactions/buttons/addBlocksButtonHandler.js')
const addBlockModalHandler = require('../../interactions/modals/addBlockModalHandler.js')

const buttonHandlers = {
    ...blocksButtonHandlers,
    ...addBlocksButtonHandlers,
    // Add other button handler modules here: ...otherButtonHandlers,
}

const selectMenuHandlers = {
    /* ... */
} // Need to import select menu handlers here when you create them
const modalHandlers = {
    ...addBlockModalHandler,
} // Need to import modal handlers here when you create them

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Only process Chat Input Commands (Slash Commands)
        if (interaction.isChatInputCommand()) {
            // Fetch the command module from the collection we built in commandHandler.js
            const command = interaction.client.commands.get(
                interaction.commandName
            )

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
                const content =
                    'There was an error while executing this command!'

                // Check if interaction has already been replied to, then use followUp
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content, ephemeral: true })
                } else {
                    await interaction.reply({ content, ephemeral: true })
                }
            }
        }
        if (interaction.isButton()) {
            const handler = buttonHandlers[interaction.customId]

            if (handler) {
                // **CRITICAL:** Handle the execution here
                try {
                    return await handler(interaction)
                } catch (error) {
                    console.error(
                        `Error executing button handler ${interaction.customId}:`,
                        error
                    )
                    // This uses followUp since the handler likely called deferUpdate()
                    if (interaction.deferred || interaction.replied) {
                        await interaction.followUp({
                            content: 'An error occurred with this button.',
                            ephemeral: true,
                        })
                    }
                }
            } else {
                // Fallback for an unhandled or old button ID
                await interaction.reply({
                    content: 'This component is outdated or broken.',
                    ephemeral: true,
                })
            }
        } else if (interaction.isStringSelectMenu()) {
            const handler = selectMenuHandlers[interaction.customId]
            if (handler) return handler(interaction)
        } else if (interaction.type === InteractionType.ModalSubmit) {
            const handler = modalHandlers[interaction.customId]
            if (handler) return handler(interaction)
        }
    },
}
