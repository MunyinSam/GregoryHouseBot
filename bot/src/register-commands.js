// register-commands.js (Stays in the root folder)
require('dotenv').config()
const { REST, Routes } = require('discord.js')

const commands = [
    {
        name: 'ping',
        description: 'Replies with pong!',
    },
    {
        name: 'start',
        description: 'Sends the Gregory House message with buttons.',
    },
]

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

;(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        // NOTE: Make sure CLIENT_ID is in your .env file!
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()
