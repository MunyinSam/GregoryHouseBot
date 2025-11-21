const { Client, IntentsBitField } = require('discord.js')
const dotenv = require('dotenv')

dotenv.config()

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
    ],
})

client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online.`);
})

// Log in the bot
client.login(process.env.DISCORD_TOKEN);