require('dotenv').config();
const axios = require('axios');

const deepLConfig = {
  authKey: process.env.DEEPL_AUTH_KEY,
  api: axios.create({
    baseURL: 'https://api-free.deepl.com/v2',
    headers: {
      Authorization: process.env.DEEPL_AUTH_KEY,
    },
  }),
};

module.exports = deepLConfig;
