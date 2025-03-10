// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api' // Asegúrate de actualizar esta URL con la de tu API
});

export default api;
