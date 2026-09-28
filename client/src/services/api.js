import axios from 'axios';

const LOCAL_API = 'http://localhost:5000/api';
const LIVE_API = 'https://campus-coin-omega.vercel.app/api';

// Production builds must never fall back to localhost: a Netlify build that misses
// VITE_API_URL would otherwise point every visitor at their own machine (ERR_CONNECTION_REFUSED).
const baseURL = (import.meta.env.DEV ? import.meta.env.VITE_API_URL || LOCAL_API : '/api').replace(/\/+$/, '');

const api = axios.create({ baseURL, withCredentials: true, headers: { 'Content-Type': 'application/json' } });

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message;
    if (message) return Promise.reject(new Error(message));
    if (error.response) return Promise.reject(new Error(`Request failed (${error.response.status}).`));
    return Promise.reject(new Error('Unable to reach Campus Coin.'));
  }
);

export default api;
