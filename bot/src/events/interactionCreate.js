const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js')
const { getHostName } = require('../utils/getHostName')
const { createBlock, getBlocks } = require('../services/block.service')

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        // --- 1. Handle Slash Commands (/) ---
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName)

            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                )
                return
            }

            try {
                // Execute the command logic found in /commands/<commandName>.js
                await command.execute(interaction)
            } catch (error) {
                console.error(
                    `Error executing command ${interaction.commandName}:`,
                    error
                )
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content:
                            'There was an error while executing this command!',
                        ephemeral: true,
                    })
                } else {
                    await interaction.reply({
                        content:
                            'There was an error while executing this command!',
                        ephemeral: true,
                    })
                }
            }
            return
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'blocks_button') {
                // Fetch blocks from API
                let blocks = []
                try {
                    blocks = await getBlocks()
                } catch (error) {
                    await interaction.reply({
                        content: 'Failed to fetch blocks from the server.',
                        ephemeral: true,
                    })
                    return
                }

                // Map blocks to select menu options
                const selectOptions = blocks.map((block) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(block.block_name)
                        .setDescription(block.block_description)
                        .setValue(block.id?.toString() || block.block_name)
                )

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('block_select_menu')
                    .setPlaceholder('Choose a medical block to query...')
                    .addOptions(selectOptions)

                const row = new ActionRowBuilder().addComponents(selectMenu)

                await interaction.reply({
                    content: 'Which medical block interests you, genius?',
                    components: [row],
                    ephemeral: true,
                })
            }
            if (interaction.customId === 'add_block_button') {
                const modal = new ModalBuilder()
                    .setCustomId('add_block_modal')
                    .setTitle('Add a Block')

                const blockNameInput = new TextInputBuilder()
                    .setCustomId('blockName')
                    .setLabel('Block Name')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const blockDescriptionInput = new TextInputBuilder()
                    .setCustomId('blockDescription')
                    .setLabel('Block Description')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)

                modal.addComponents(
                    new ActionRowBuilder().addComponents(blockNameInput),
                    new ActionRowBuilder().addComponents(blockDescriptionInput)
                )

                await interaction.showModal(modal)
                return
            }
            return // Stop processing after handling a button
        }

        // --- 3. Handle Select Menu Interactions (Dropdown) ---
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'block_select_menu') {
                const selectedValue = interaction.values[0]

                // Find the selected block from your blocks API
                let blocks = []
                try {
                    blocks = await getBlocks()
                } catch (error) {
                    await interaction.reply({
                        content: 'Failed to fetch blocks from the server.',
                        ephemeral: true,
                    })
                    return
                }
                const selectedBlock = blocks.find(
                    (block) =>
                        (block.id?.toString() || block.block_name) ===
                        selectedValue
                )

                if (!selectedBlock) {
                    await interaction.update({
                        content: "Couldn't find the selected block.",
                        components: [],
                        ephemeral: true,
                    })
                    return
                }

                // Create the embed
                const {
                    EmbedBuilder,
                    ButtonBuilder,
                    ButtonStyle,
                    ActionRowBuilder,
                } = require('discord.js')
                const embed = new EmbedBuilder()
                    .setTitle(selectedBlock.block_name)
                    .setDescription(
                        selectedBlock.block_description ||
                            'No description provided.'
                    )

                // Create the buttons
                const startButton = new ButtonBuilder()
                    .setCustomId(`start_block_${selectedBlock.id}`)
                    .setLabel('Start')
                    .setStyle(ButtonStyle.Primary)

                const addQuestionButton = new ButtonBuilder()
                    .setCustomId(`add_question_block_${selectedBlock.id}`)
                    .setLabel('Add Question')
                    .setStyle(ButtonStyle.Secondary)

                const buttonRow = new ActionRowBuilder().addComponents(
                    startButton,
                    addQuestionButton
                )

                await interaction.update({
                    embeds: [embed],
                    components: [buttonRow],
                    ephemeral: true,
                })
            }
            return
        }

        // --- 4. Handle Modal Submissions ---
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'add_block_modal') {
                await interaction.deferReply({ ephemeral: true })

                const name = interaction.fields.getTextInputValue('blockName')
                const description =
                    interaction.fields.getTextInputValue('blockDescription')

                const newBlockData = {
                    block_name: name,
                    block_description: description,
                    is_active: true,
                    created_by: interaction.user.tag || '',
                }

                try {
                    // Use the utility function
                    const response = await createBlock(newBlockData)

                    await interaction.editReply({
                        content: `**Dr. House has grudgingly reviewed your submission.**\nSuccessfully proposed new block: **${name}**.\n\nStatus: \`HTTP ${response.status} OK\``,
                    })
                } catch (error) {
                    console.error(
                        'API Error during block submission:',
                        error.message
                    )

                    let errorMessage =
                        'Failed to communicate with the Diagnostic Server (API). Check the bot logs.'
                    if (error.response) {
                        errorMessage = `API Submission Failed (Status ${error.response.status}). Dr. House says, "You made a mistake."`
                    }

                    await interaction.editReply({
                        content: errorMessage,
                    })
                }
            }

            return
        }
    },
}
