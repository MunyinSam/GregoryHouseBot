const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
const axios = require('axios')

// Create an Axios instance for your backend API
const api = axios.create({
    baseURL: 'http://localhost:8000', // Change if your backend runs elsewhere
    timeout: 5000,
})

module.exports = {
    blocks_button: async (interaction) => {
        await interaction.deferUpdate()

        // Fetch blocks from your backend API
        let blocks = []
        try {
            const response = await api.get('/blocks')
            blocks = response.data.blocks || []
        } catch (error) {
            return interaction.editReply({
                content: 'Failed to fetch blocks from the server.',
                components: [],
            })
        }

        // Map blocks to select menu options
        const options = blocks.map((block) => ({
            label: block.block_name,
            description: block.block_description,
            value: block.id.toString(),
        }))

        // If no blocks, show a message
        if (options.length === 0) {
            return interaction.editReply({
                content: 'No blocks available.',
                components: [],
            })
        }

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('blocks_select_menu')
            .setPlaceholder('Choose a block type...')
            .addOptions(options)

        const selectRow = new ActionRowBuilder().addComponents(selectMenu)

        await interaction.editReply({
            content: 'Please select a block from the menu below:',
            components: [selectRow],
        })
    },
}
