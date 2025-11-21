const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js')
const { createBlock, getBlocks } = require('../services/block.service')
const { getQuestionGroupsByBlockId } = require('../services/question.service')

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

            if (interaction.customId.startsWith('add_question_block_')) {
                const blockId = interaction.customId.replace(
                    'add_question_block_',
                    ''
                )

                const modal = new ModalBuilder()
                    .setCustomId(`add_question_modal_${blockId}`)
                    .setTitle('Add a Question')

                const questionTypeInput = new TextInputBuilder()
                    .setCustomId('questionType')
                    .setLabel('Question Type')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const mainQuestionInput = new TextInputBuilder()
                    .setCustomId('mainQuestion')
                    .setLabel('Main Question')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)

                const normalAnswerInput = new TextInputBuilder()
                    .setCustomId('normalAnswer')
                    .setLabel('Normal Answer')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)

                const imageUrlInput = new TextInputBuilder()
                    .setCustomId('imageUrl')
                    .setLabel('Image URL (optional)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                modal.addComponents(
                    new ActionRowBuilder().addComponents(questionTypeInput),
                    new ActionRowBuilder().addComponents(mainQuestionInput),
                    new ActionRowBuilder().addComponents(normalAnswerInput),
                    new ActionRowBuilder().addComponents(imageUrlInput)
                )

                await interaction.showModal(modal)
                return
            }

            if (interaction.customId.startsWith('start_block_')) {
                const blockId = interaction.customId.replace('start_block_', '')

                // Fetch questions for this block
                let questions = []
                try {
                    const data = await getQuestionGroupsByBlockId(blockId)
                    questions = data.questionGroups || []
                } catch (error) {
                    await interaction.reply({
                        content: 'Failed to fetch questions for this block.',
                        ephemeral: true,
                    })
                    return
                }

                if (!questions.length) {
                    await interaction.reply({
                        content: 'No questions found for this block.',
                        ephemeral: true,
                    })
                    return
                }

                // Store questions and current index in a custom object (could use a DB or cache for production)
                // For demo, encode as JSON in the customId
                const question = questions[0]
                const session = {
                    blockId,
                    index: 0,
                    questions,
                }

                const embed = new EmbedBuilder()
                    .setTitle(`Question 1`)
                    .setDescription(question.main_question)

                const answerButton = new ButtonBuilder()
                    .setCustomId(`answer_question_${blockId}_0`)
                    .setLabel('Answer')
                    .setStyle(ButtonStyle.Primary)

                const row = new ActionRowBuilder().addComponents(answerButton)

                await interaction.reply({
                    embeds: [embed],
                    components: [row],
                    ephemeral: true,
                })
                return
            }

            if (interaction.customId.startsWith('answer_question_')) {
                const [, , blockId, index] = interaction.customId.split('_')

                const modal = new ModalBuilder()
                    .setCustomId(`submit_answer_${blockId}_${index}`)
                    .setTitle('Submit Your Answer')

                const answerInput = new TextInputBuilder()
                    .setCustomId('userAnswer')
                    .setLabel('Your Answer')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)

                modal.addComponents(
                    new ActionRowBuilder().addComponents(answerInput)
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
                    .setCustomId(`start_block_${selectedBlock.block_id}`)
                    .setLabel('Start')
                    .setStyle(ButtonStyle.Primary)

                const addQuestionButton = new ButtonBuilder()
                    .setCustomId(`add_question_block_${selectedBlock.block_id}`)
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
        }

        if (
            interaction.isModalSubmit() &&
            interaction.customId.startsWith('submit_answer_')
        ) {
            try {
                await interaction.deferReply({ ephemeral: true })

                const [, , blockId, indexStr] = interaction.customId.split('_')
                const index = parseInt(indexStr, 10)

                let questions = []
                try {
                    const data = await getQuestionGroupsByBlockId(blockId)
                    questions = data.questionGroups || []
                } catch (error) {
                    await interaction.editReply({
                        content: 'Failed to fetch questions.',
                    })
                    return
                }

                const question = questions[index]
                if (!question) {
                    await interaction.editReply({
                        content: 'Question not found. Please try again.',
                    })
                    return
                }

                const userAnswer = interaction.fields
                    .getTextInputValue('userAnswer')
                    .trim()
                const correctAnswer = question.normal_answer.trim()

                if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                    // Correct! Go to next question or finish
                    if (index + 1 < questions.length) {
                        const nextQuestion = questions[index + 1]
                        const embed = new EmbedBuilder()
                            .setTitle(`Question ${index + 2}`)
                            .setDescription(nextQuestion.main_question)

                        const answerButton = new ButtonBuilder()
                            .setCustomId(
                                `answer_question_${blockId}_${index + 1}`
                            )
                            .setLabel('Answer')
                            .setStyle(ButtonStyle.Primary)

                        const row = new ActionRowBuilder().addComponents(
                            answerButton
                        )

                        await interaction.editReply({
                            content: `✅ Correct! Next question:`,
                            embeds: [embed],
                            components: [row],
                        })
                    } else {
                        await interaction.editReply({
                            content: `🎉 Correct! You've completed all questions for this block!`,
                            embeds: [],
                            components: [],
                        })
                    }
                } else {
                    await interaction.editReply({
                        content: `❌ Wrong answer. Try again!`,
                        embeds: [],
                        components: [],
                    })
                }
            } catch (err) {
                console.error('Modal submit error:', err)
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({
                        content:
                            'An unexpected error occurred. Please try again.',
                    })
                } else {
                    await interaction.reply({
                        content:
                            'An unexpected error occurred. Please try again.',
                        ephemeral: true,
                    })
                }
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

            if (interaction.customId.startsWith('add_question_modal_')) {
                await interaction.deferReply({ ephemeral: true })

                const blockId = interaction.customId.replace(
                    'add_question_modal_',
                    ''
                )

                const questionType =
                    interaction.fields.getTextInputValue('questionType')
                const mainQuestion =
                    interaction.fields.getTextInputValue('mainQuestion')
                const normalAnswer =
                    interaction.fields.getTextInputValue('normalAnswer')
                const imageUrl =
                    interaction.fields.getTextInputValue('imageUrl')

                const newQuestionData = {
                    block_id: Number(blockId),
                    question_type: questionType,
                    main_question: mainQuestion,
                    normal_answer: normalAnswer,
                    image_url: imageUrl,
                    created_date: new Date().toISOString(),
                }

                const {
                    createQuestionGroup,
                } = require('../services/question.service')

                try {
                    await createQuestionGroup(newQuestionData)
                    await interaction.editReply({
                        content: `✅ Question added to block successfully!`,
                    })
                } catch (error) {
                    console.error(
                        'API Error during question submission:',
                        error.message
                    )
                    let errorMessage =
                        'Failed to communicate with the API. Please try again later.'
                    if (error.response) {
                        errorMessage = `API Submission Failed (Status ${error.response.status}).`
                    }
                    await interaction.editReply({
                        content: errorMessage,
                    })
                }
                return
            }

            return
        }
    },
}
