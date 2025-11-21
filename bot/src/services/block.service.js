const axios = require('axios')
const { getHostName } = require('../utils/getHostName')

const API_URL = getHostName() + '/blocks'

async function createBlock(newBlockData) {
    return axios.post(API_URL, newBlockData)
}

async function getBlocks() {
    const response = await axios.get(API_URL)
    return response.data.blocks
}

module.exports = { createBlock, getBlocks }
