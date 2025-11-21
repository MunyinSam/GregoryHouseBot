// interactions/components/mainMenuComponents.js

const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

// --- Buttons ---

// Button to display the dropdown menu (Select Menu)
const BlocksButton = new ButtonBuilder()
    .setCustomId('blocks_button') // The ID you will listen for
    .setLabel('Blocks')
    .setStyle(ButtonStyle.Primary)

// Button to display the Modal
const AddBlocksButton = new ButtonBuilder()
    .setCustomId('add_blocks_button') // The ID you will listen for
    .setLabel('Add Block')
    .setStyle(ButtonStyle.Success) // Changed to Success for visual distinction

// --- Action Row ---

const MainMenuRow = new ActionRowBuilder().addComponents(
    BlocksButton,
    AddBlocksButton
)

// Export all necessary components
module.exports = {
    MainMenuRow,
    BlocksButton,
    AddBlocksButton,
}
