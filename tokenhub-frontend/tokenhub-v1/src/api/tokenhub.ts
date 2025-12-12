import axios from 'axios';

const api = axios.create({
  baseURL: 'https://token-hub.onrender.com/api', // adjust if your backend runs on another port
});

export default api;
