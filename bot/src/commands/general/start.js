const path = require('path')
const {
    SlashCommandBuilder,
    EmbedBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require('discord.js')
const {
    MainMenuRow,
} = require('../../interactions/components/mainmenuComponents')

const imagePath = path.resolve(__dirname, '../../../images/house1.jpeg')
const attachment = new AttachmentBuilder(imagePath, { name: 'house1.jpeg' })

const house_quote =
    "Life is pain! I wake up every morning and I'm in pain, I go to work in pain! Do you know how many times I wanted to just give up, how many times I thought about ending it?"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start the bot.'),

    async execute(interaction) {
        const MainMenuEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Gregory House')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setDescription(house_quote)
            .setImage('attachment://house1.jpeg')
            .setTimestamp()
            .setFooter({
                text: 'Better be learning Namcy',
            })

        await interaction.reply({
            embeds: [MainMenuEmbed],
            files: [attachment],
            components: [MainMenuRow],
        })
    },
}
