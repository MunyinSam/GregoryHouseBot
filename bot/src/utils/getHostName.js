require('dotenv').config();

function getHostName() {
    return process.env.BACKEND_URL;
}

module.exports = { getHostName };