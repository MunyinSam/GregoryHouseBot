const axios = require('axios')

const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000,
})

module.exports = {
    add_block_modal: async (interaction) => {
        const block_name = interaction.fields.getTextInputValue('blockName')
        const block_description =
            interaction.fields.getTextInputValue('blockDescription')

        try {
            await api.post('/blocks', {
                block_name,
                block_description,
                is_active: true,
                created_date: new Date().toISOString(),
            })

            await interaction.reply({
                content: `✅ Block "${block_name}" added successfully!`,
                ephemeral: true,
            })
        } catch (error) {
            await interaction.reply({
                content: '❌ Failed to add block. Please try again later.',
                ephemeral: true,
            })
        }
    },
}
