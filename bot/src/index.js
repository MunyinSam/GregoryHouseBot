// index.js (Simplified Loader)
require('dotenv').config()
const { Client, IntentsBitField, Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
    ],
})

// Create a Collection to hold your commands for easy lookup
client.commands = new Collection()

// --- Command Handler ---
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
    } else {
        console.warn(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        )
    }
}

// --- Event Handler ---
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args))
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args))
    }
}

client.login(process.env.DISCORD_TOKEN)
