import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './singleItem.css'; // Separate CSS file
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://buy-sell-zwmw.onrender.com/api/users/api/items/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item:', error);
        setError('Failed to fetch item. Please try again later.');
      }
    };
    fetchItem();
  }, [id]);


  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;
      if(userId == item.Seller){
        console.log("Came!!");
        setMessage("Seller and Buyer are same, can't add!!!");
      }
      else{
      const response = await axios.post('https://buy-sell-zwmw.onrender.com/api/users/api/cart', {
        userId,
        itemId: item._id
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      setMessage("Item added!!!");
    }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError('Failed to add item to cart. Please try again later.');
      
      
    }
  };

  const containerStyle = {
    backgroundColor: '#1a1a1a',
    color: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
  };

  const headingStyle = {
    borderBottom: '2px solid #444',
    paddingBottom: '10px',
    color: '#e0e0e0'
  };

  const labelStyle = {
    color: '#888',
    fontWeight: 'bold',
    marginRight: '10px'
  };

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!item) {
    return <p style={{ color: '#888', textAlign: 'center' }}>Loading...</p>;
  }

  return (
      <div>
  <Navbar />
  <div className="item-detail-container">
    <div className="item-detail-box">
      {item.Image && (
        <img 
          src={item.Image} 
          alt={item.ItemName} 
          className="item-image" 
        />
      )}
      <h2 className="item-detail-heading">{item.ItemName}</h2>
      <p><span className="item-detail-label">Price:</span> {item.Price}</p>
      <p><span className="item-detail-label">Description:</span> {item.Description}</p>
      <p><span className="item-detail-label">Category:</span> {item.Category}</p>
      <p><span className="item-detail-label">Seller:</span> {item.Seller}</p>
      <p><span className="item-detail-label">Email:</span> {item.Email}</p>
    </div>
    {/* Buttons Container */}
    <div className="item-detail-buttons">
      <button 
        className="add-to-cart-button"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
      <button 
        className="go-to-cart-button"
        onClick={() => navigate('/My_cart')}
      >
        Go to Cart
      </button>
    </div>
    {message && <p className="item-detail-message">{message}</p>}
  </div>
</div>
  );
};

export default ItemDetail;

