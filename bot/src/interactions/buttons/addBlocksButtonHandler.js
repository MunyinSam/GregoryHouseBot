// interactions/buttons/addBlocksButtonHandler.js

const {
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle,
} = require('discord.js')

module.exports = {
    add_blocks_button: async (interaction) => {
        // 1. Define the Modal
        const modal = new ModalBuilder()
            .setCustomId('add_block_modal') // A NEW unique ID for the modal
            .setTitle('Add a New Block')

        // 2. Define the Text Input field
        const blockNameInput = new TextInputBuilder()
            .setCustomId('blockName')
            .setLabel('What is the name of the new block?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const blockDescriptionInput = new TextInputBuilder()
            .setCustomId('blockDescription')
            .setLabel('Describe the new block.')
            .setStyle(TextInputStyle.Paragraph)

        // 3. Add inputs to Action Rows
        const firstActionRow = new ActionRowBuilder().addComponents(
            blockNameInput
        )
        const secondActionRow = new ActionRowBuilder().addComponents(
            blockDescriptionInput
        )

        // 4. Add rows to the Modal
        modal.addComponents(firstActionRow, secondActionRow)

        // 5. Show the Modal to the user
        await interaction.showModal(modal)
    },
}
