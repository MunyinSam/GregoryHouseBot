const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} = require('discord.js')

module.exports = {
    add_blocks_button: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('add_block_modal')
            .setTitle('Add a Block')

        const blockNameInput = new TextInputBuilder()
            .setCustomId('blockName')
            .setLabel('Block Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const blockDescriptionInput = new TextInputBuilder()
            .setCustomId('blockDescription')
            .setLabel('Block Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)

        modal.addComponents(
            new ActionRowBuilder().addComponents(blockNameInput),
            new ActionRowBuilder().addComponents(blockDescriptionInput)
        )

        await interaction.showModal(modal)
    },
}
