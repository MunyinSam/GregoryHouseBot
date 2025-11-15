const { Client, GatewayIntentBits, Collection } = require('discord.js')
const dotenv = require('dotenv')

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})

client.commands = new Collection();

// Load Handlers
require('./handlers/commandHandler')(client);
require('./handlers/eventHandler')(client);

// Log in the bot
client.login(process.env.DISCORD_TOKEN);