const axios = require('axios');
const { getHostName } = require('../utils/getHostName');

const API_URL = getHostName() + '/questions';

async function createQuestionGroup(data) {
    const response = await axios.post(API_URL, data);
    return response.data;
}

async function getQuestionGroupsByBlockId(block_id) {
    const response = await axios.get(`${API_URL}/${block_id}`);
    return response.data;
}

module.exports = { createQuestionGroup, getQuestionGroupsByBlockId };