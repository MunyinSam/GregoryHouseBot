const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gay')
        .setDescription("Replies with a random member's name."),

    async execute(interaction) {
        await interaction.deferReply()

        try {
            // Fetch all members in the guild
            const members = await interaction.guild.members.fetch()

            // Get a random member
            const randomMember = members.random()

            if (randomMember) {
                await interaction.editReply(
                    `${randomMember.user.username} is gay!`
                )
            } else {
                await interaction.editReply(
                    'Could not find any members to choose from.'
                )
            }
        } catch (error) {
            console.error('Error fetching members:', error)
            await interaction.editReply(
                'An error occurred while trying to fetch members.'
            )
        }
    },
}
