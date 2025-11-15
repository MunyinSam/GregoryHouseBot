// src/handlers/eventHandler.js
const fs = require('fs');
const path = require('path');

/**
 * Dynamically loads all event files from the src/events directory and binds them to the client.
 * @param {Client} client - The Discord client instance.
 */
module.exports = (client) => {
    // Define the path to the events directory
    const eventsPath = path.join(__dirname, '..', 'events');

    // 1. Recursive function to read subdirectories
    function readEvents(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // Recursively call readEvents for subdirectories
                readEvents(filePath);
            } else if (file.endsWith('.js')) {
                // Load the event file
                try {
                    const event = require(filePath);

                    // 2. Ensure the event has the required properties
                    if ('name' in event && 'execute' in event) {
                        
                        // 3. Bind the event to the Discord Client
                        if (event.once) {
                            // client.once means the listener runs only once (e.g., ClientReady)
                            client.once(event.name, (...args) => event.execute(...args, client));
                        } else {
                            // client.on means the listener runs every time the event fires (e.g., interactionCreate)
                            client.on(event.name, (...args) => event.execute(...args, client));
                        }
                        console.log(`Event Loaded: ${event.name}`);
                    } else {
                        console.warn(`[WARNING] The event at ${filePath} is missing required "name" or "execute" property.`);
                    }
                } catch (error) {
                    console.error(`[ERROR] Failed to load event at ${filePath}:`, error.message);
                }
            }
        }
    }
    
    // Start the recursive reading process
    readEvents(eventsPath);
};