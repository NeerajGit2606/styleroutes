// src/config.js
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_PROD_API_URL || '/api'
  : process.env.REACT_APP_DEV_API_URL || 'http://localhost:8000';

console.log(`API running in ${process.env.NODE_ENV} mode: ${API_BASE_URL}`);