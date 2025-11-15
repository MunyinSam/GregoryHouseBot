const { SlashCommandBuilder } = require('discord.js')
const { EmbedBuilder } = require('discord.js');

const house_quote = "Life is pain! I wake up every morning and I'm in pain, I go to work in pain! Do you know how many times I wanted to just give up, how many times I thought about ending it?" 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start the bot.'),

    async execute(interaction) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099ff) // Blue color
            .setTitle('Gregory House')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            // .setAuthor({
            //     name: 'Some Name',
            //     iconURL: 'https://i.imgur.com/AfFp7pu.png',
            //     url: 'https://discord.js.org',
            // })
            .setDescription(house_quote)
            .setThumbnail('../../../images/house1.jpeg')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                }
            )
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({
                text: 'Some footer text here',
                iconURL: 'https://i.imgur.com/AfFp7pu.png',
            })

        interaction.reply({ embeds: [exampleEmbed] })
    },
}
