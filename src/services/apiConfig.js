import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-free.deepl.com/v2',
  headers: {
    'Authorization': process.env.REACT_APP_DEEPL_AUTH_KEY,
  },
});

export default api