import axios from 'axios';

const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: ' https://3bff-100-33-108-135.ngrok.io/api',
});

export default api;
