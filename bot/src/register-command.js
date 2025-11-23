// register-commands.js (Stays in the root folder)
require('dotenv').config()
const { REST, Routes } = require('discord.js')
import { commandsList } from './commands/commands-list';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

;(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commandsList }
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()
