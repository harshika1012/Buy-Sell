import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/'; // Replace with your base URL

export const SendPostRequest = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error; // Rethrow error for the calling function to handle
  }
};
