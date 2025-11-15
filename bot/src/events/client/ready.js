// src/events/client/ready.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Bot is online! Logged in as ${client.user.tag}`);
        
        // --- COMMAND REGISTRATION ---
        // Registering commands globally (slow, takes up to 1 hour)
        // const data = Array.from(client.commands.values()).map(command => command.data.toJSON());
        // await client.application.commands.set(data);
        
        // Registering commands to a specific test server (fast)
        if (process.env.GUILD_ID) {
            const testGuild = client.guilds.cache.get(process.env.GUILD_ID);
            if (testGuild) {
                const data = Array.from(client.commands.values()).map(command => command.data.toJSON());
                await testGuild.commands.set(data);
                console.log(`Successfully registered ${data.length} commands to GUILD_ID: ${process.env.GUILD_ID}`);
            }
        }
    },
};