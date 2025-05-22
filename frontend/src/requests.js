import axios from 'axios';
import bcrypt from 'bcryptjs';
import { data } from 'react-router-dom';

const API_BASE_URL = 'https://buy-sell-zwmw.onrender.com'; // Replace with your base URL

export const SendPostRequest = async (endpoint, Logindata) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, Logindata, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // window.location.href = '/Dashboard'; // Redirect to the desired page
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error; // Rethrow error for the calling function to handle
  }
};


export const SendPostLoginRequest = async (Logindata) => {
 
  console.log("Data came to request from login:",Logindata);
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/api/login`, Logindata, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("response from bk in request:",response);
    const { token, user } = response.data;
    localStorage.setItem('token', token); // Store the token in localStorage
    localStorage.setItem('userData', JSON.stringify(user)); // Store the user data in localStorage
    console.log('Login successful:', user);
    // Redirect or perform other actions after successful login
    return response;
  } catch (error) {
    console.error('Error logging in:', error.response.data);
    // setError(error.response.data.message);
  }
};

export const SendGetRequest = async (endpoint) => {
  try {
    const token = localStorage.getItem('token'); // Get the token from local storage
    console.log("Token from GET requests.js:",token);
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Set the token in the header
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error; // Rethrow error for the calling function to handle
  }
}

export const CheckHashedPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
}

export const SendUpdatedProfile = async (UpdatedData) => {
  const token = localStorage.getItem('token');
  const userId = UpdatedData._id; 
  
  console.log('Sending update for User ID:', userId);
  console.log('Update Data:', UpdatedData);

  try {
      const response = await fetch(`${API_BASE_URL}/api/users/api/updateProfile/${userId}`, {
          method: 'PUT',
          headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`, 
          },
          body: JSON.stringify(UpdatedData),
      }); 

      console.log('Full response:', response);
      
      const data = await response.text(); // Try text first
      console.log('Response body:', data);

      if (response.ok) {
          const parsedData = data ? JSON.parse(data) : {};
          console.log('Profile updated successfully:', parsedData);
      } else {
          console.error('Error status:', response.status);
          console.error('Error response:', data);
      }
  } catch (error) {
      console.error("Detailed error from requests.js:", error);
  }
}
