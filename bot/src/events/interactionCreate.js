const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js')
const axios = require('axios')
const { getHostName } = require('../utils/getHostName')

const API_URL = getHostName() + '/blocks'

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
                const selectOptions = [
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Hepatology')
                        .setDescription('Questions about the Liver.')
                        .setValue('block_hep'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Renal System')
                        .setDescription('Questions about the Kidneys.')
                        .setValue('block_renal'),

                    new StringSelectMenuOptionBuilder()
                        .setLabel('Endocrinology')
                        .setDescription('Questions about Hormones and Glands.')
                        .setValue('block_endo'),
                ]

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
            } else if (interaction.customId === 'add_block_button') {
                // Logic for showing the Modal
                const modal = new ModalBuilder()
                    .setCustomId('add_block_modal')
                    .setTitle('Propose a New Medical Block')

                const blockNameInput = new TextInputBuilder()
                    .setCustomId('blockName')
                    .setLabel('Block Name (e.g., Cardiology)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMinLength(3)

                const blockDescriptionInput = new TextInputBuilder()
                    .setCustomId('blockDescription')
                    .setLabel('Block Description (e.g., Heart & Circulation)')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMinLength(10)

                const firstRow = new ActionRowBuilder().addComponents(
                    blockNameInput
                )
                const secondRow = new ActionRowBuilder().addComponents(
                    blockDescriptionInput
                )

                modal.addComponents(firstRow, secondRow)

                // Show the modal to the user immediately
                await interaction.showModal(modal)
            }
            return // Stop processing after handling a button
        }

        // --- 3. Handle Select Menu Interactions (Dropdown) ---
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'block_select_menu') {
                const selectedValue = interaction.values[0]

                let responseText = ''
                switch (selectedValue) {
                    case 'block_hep':
                        responseText =
                            'Ah, Hepatology. We can start with cirrhosis or drug metabolism, unless you prefer to just suffer.'
                        break
                    case 'block_renal':
                        responseText =
                            "The kidneys. Let's talk electrolytes. It's never lupus."
                        break
                    case 'block_endo':
                        responseText =
                            'Hormones, the cause of all drama. Ready for some insulin resistance?'
                        break
                    default:
                        responseText =
                            "You selected something I can't diagnose."
                }

                await interaction.update({
                    content: responseText,
                    components: [],
                    ephemeral: true,
                })
            }
            return
        }

        // --- 4. Handle Modal Submissions ---
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'add_block_modal') {
                // Defer the reply to give time for the API call (up to 15 minutes)
                console.log('Creating A New Block')
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
                    // Send data to the external API
                    const response = await axios.post(API_URL, newBlockData)

                    // Follow up with success message
                    await interaction.editReply({
                        content: `**Dr. House has grudgingly reviewed your submission.**\nSuccessfully proposed new block: **${name}**.\n\nStatus: \`HTTP ${response.status} OK\``,
                    })
                } catch (error) {
                    // Handle API errors
                    console.error(
                        'API Error during block submission:',
                        error.message
                    )

                    let errorMessage =
                        'Failed to communicate with the Diagnostic Server (API). Check the bot logs.'
                    if (error.response) {
                        errorMessage = `API Submission Failed (Status ${error.response.status}). Dr. House says, "You made a mistake."`
                    }

                    // Edit the deferred reply with the error message
                    await interaction.editReply({
                        content: errorMessage,
                    })
                }
            }
            return
        }
    },
}
