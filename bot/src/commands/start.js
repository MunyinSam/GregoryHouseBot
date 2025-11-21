// /commands/start.js
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
} = require('discord.js')
const path = require('path')

module.exports = {
    // This is used by the registration script (register-commands.js)
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Sends the Gregory House message with buttons.'),

    // This is the function run when the command is called
    async execute(interaction) {
        // NOTE: path.join needs to adjust for the new directory structure
        // The bot's root is still the execution context
        const imagePath = path.join(
            process.cwd(),
            'src',
            'images',
            'house1.jpeg'
        )
        const attachment = new AttachmentBuilder(imagePath, {
            name: 'house-image.png',
        })

        const house_quote =
            "Life is pain! I wake up every morning and I'm in pain, I go to work in pain! Do you know how many times I wanted to just give up, how many times I thought about ending it?"

        const embed = new EmbedBuilder()
            .setTitle('Gregory House')
            .setColor(0x0099ff)
            .setDescription(house_quote)
            .setImage('attachment://house-image.png')

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('blocks_button')
                .setLabel('Blocks')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('add_block_button')
                .setLabel('Add Block')
                .setStyle(ButtonStyle.Success)
        )

        await interaction.reply({
            embeds: [embed],
            components: [row],
            files: [attachment],
        })
    },
}
