import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './addItems.css'; // Import the CSS file

function AddItems () {
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null); // State for the image
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Set the selected image file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        console.log("Data of user from localStorage:", userData);
        console.log("Token sending from addItems:", token);
        if (!userData) {
            setError('User data not found. Please log in again.');
            return;
        }

        const parsedUserData = JSON.parse(userData);
        console.log("Parsed user data:", parsedUserData);

        try {
            // Use FormData to send the image and other fields
            const formData = new FormData();
            formData.append('ItemName', itemName);
            formData.append('Price', price);
            formData.append('Description', description);
            formData.append('Category', category);
            formData.append('Seller', sellerId);
            formData.append('Email', email);
            formData.append('TokenId', parsedUserData._id);
            if (image) {
                formData.append('image', image); // Append the image file
            }

            const response = await axios.post('https://buy-sell-zwmw.onrender.com/api/users/api/items', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Set the content type for file uploads
                },
            });

            setSuccess('Item created successfully!');
            setError('');
            console.log('Item created:', response.data);
        } catch (error) {
            console.error('Error creating item:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Error creating item');
            setSuccess('');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="create-item-container">
                <h2 className="create-item-title">Create Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Item Name:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            value={itemName} 
                            onChange={(e) => setItemName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Price:</label>
                        <input 
                            className="form-input" 
                            type="number" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Seller ID:</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            value={sellerId} 
                            onChange={(e) => setSellerId(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email:</label>
                        <input 
                            className="form-input" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Image:</label>
                        <input 
                            className="form-input" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                        />
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <button className="submit-button" type="submit">Create Item</button>
                </form>
            </div>
        </div>
    );
};

export default AddItems;

