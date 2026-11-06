import axios from 'axios';

const api = axios.create({
baseURL: 'http://localhost:5000/api',
withCredentials: true,
headers: {
'Content-Type': 'application/json',
},
});

api.interceptors.response.use(
(response) => response.data,
(error) => {
const message = error.response?.data?.message;

if (message) {
  return Promise.reject(new Error(message));
}

if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
  return Promise.reject(
    new Error('The request timed out. Try a smaller or clearer receipt image.')
  );
}

if (error.response) {
  return Promise.reject(
    new Error(`Request failed (${error.response.status}).`)
  );
}

return Promise.reject(new Error('Unable to reach Campus Coin.'));

}
);

export default api;
