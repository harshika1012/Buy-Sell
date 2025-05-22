import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './items.css';
import { useNavigate } from 'react-router-dom';
import './My_Cart.css';

function My_Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null); // Use state for userId
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        const parsedUserData = JSON.parse(userData);
        setUserId(parsedUserData._id); // Set userId state
        const response = await axios.get(`http://localhost:5002/api/users/api/cart/${parsedUserData._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []); // Add dependency array to run only once

  const handleRemoveFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5002/api/users/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          userId,
          itemId
        }
      });
      setCart(prevCart => ({
        ...prevCart,
        cart: {
          ...prevCart.cart,
          items: prevCart.cart.items.filter(item => item.item._id !== itemId)
        },
        cartCounter: prevCart.cartCounter - 1
      }));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleFinalOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random OTP
      const response = await axios.post('http://localhost:5002/api/users/api/order', {
        userId,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Order placed successfully:', response.data);

      response.data.otps.forEach(({ itemId, otp }) => {
        console.log("OTP is:",otp);
        localStorage.setItem(`otp_${itemId}`, otp);
        const storedOtp = localStorage.getItem(`otp_${itemId}`);
        console.log("Stored OTP:", storedOtp);
      });
      
      setCart({ ...cart, cart: { items: [] } }); // Clear the cart in the frontend
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again later.');
    }
  };

  const calculateTotalPrice = () => {
    return cart.cart.items.reduce((total, item) => total + item.item.Price, 0);
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!cart) {
    return <p>Loading cart...</p>;
  }

  return (
    <div>
    <Navbar />
    <div className="cart-container">
  {/* <Navbar /> */}
  <h1 className="cart-title">{cart.user.FirstName}'s Cart</h1>
  <ul className="cart-items">
    {cart.cart.items.map(item => (
        <li key={item._id} className="item-card" onClick={() => navigate(`/items/${item.item._id}`)}>
            {item.item.Image && (
                <img 
                    src={item.item.Image} 
                    alt={item.item.ItemName} 
                    className="item-imagess" 
                />
            )}
            <h2 className="item-name">{item.item.ItemName}</h2>
            <p className="item-price">Price: {item.item.Price}</p>
            <button className="remove-button" onClick={(event) => {
                event.stopPropagation();
                handleRemoveFromCart(item.item._id);
            }}>Remove from Cart</button>
        </li>
    ))}
  </ul>
  <div className="cart-summary">
    <p>Total items in cart: <span>{cart.cartCounter}</span></p>
    <p>Total Amount: <span>{calculateTotalPrice()}</span></p>
  </div>
  <div className="cart-actions">
    <button className="order-button" onClick={handleFinalOrder}>Order</button>
    <button className="select-items-button" onClick={() => navigate('/Items')}>Select Items</button>
  </div>
</div>
</div>
  );
};

export default My_Cart;
