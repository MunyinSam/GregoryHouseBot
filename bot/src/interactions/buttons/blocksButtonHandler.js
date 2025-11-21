// interactions/buttons/blocksButtonHandler.js

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

// This object maps the customId to the executor function
module.exports = {
    blocks_button: async (interaction) => {
        // Acknowledge the click without sending a message yet
        await interaction.deferUpdate()

        // 1. Define the Select Menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('blocks_select_menu') // A NEW unique ID for the menu
            .setPlaceholder('Choose a block type...')
            .addOptions([
                {
                    label: 'Block A',
                    description: 'The first type of block.',
                    value: 'block_a_value',
                },
                {
                    label: 'Block B',
                    description: 'The second type of block.',
                    value: 'block_b_value',
                },
            ])

        // 2. Wrap the Select Menu in an Action Row
        const selectRow = new ActionRowBuilder().addComponents(selectMenu)

        // 3. Edit the original message to include the Select Menu
        await interaction.editReply({
            content: 'Please select a block from the menu below:',
            components: [selectRow], // Replace the original buttons with the new select menu
        })
    },
}
