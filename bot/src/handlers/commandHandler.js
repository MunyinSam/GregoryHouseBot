// src/handlers/commandHandler.js
const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

/**
 * Dynamically loads all command files from the src/commands directory.
 * @param {Client} client - The Discord client instance.
 */
module.exports = (client) => {
    // 1. Initialize commands Collection if it doesn't exist
    if (!client.commands) {
        client.commands = new Collection();
    }

    // Define the path to the commands directory
    const commandsPath = path.join(__dirname, '..', 'commands');

    // 2. Recursive function to read subdirectories
    function readCommands(dir) {
        // Read all files and subdirectories in the current directory
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // If it's a directory, recursively call readCommands
                readCommands(filePath);
            } else if (file.endsWith('.js')) {
                try {
                    const command = require(filePath);

                    // Ensure the command has both 'data' and 'execute' properties
                    if ('data' in command && 'execute' in command) {
                        // 3. Store the command using its name as the key
                        client.commands.set(command.data.name, command);
                        console.log(`Command Loaded: ${command.data.name}`);
                    } else {
                        console.warn(`[WARNING] The command at ${filePath} is missing required "data" or "execute" property.`);
                    }
                } catch (error) {
                    console.error(`[ERROR] Failed to load command at ${filePath}:`, error.message);
                }
            }
        }
    }
    
    // Start the recursive reading process
    readCommands(commandsPath);
};