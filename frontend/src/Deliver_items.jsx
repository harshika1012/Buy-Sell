import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './items.css';
import './Deliver_items.css';


const Deliver_items = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [otpInputs, setOtpInputs] = useState({});
  const [verificationResults, setVerificationResults] = useState({});
  const [allVerified, setAllVerified] = useState(false);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        const parsedUserData = JSON.parse(userData);
        const sellerId = parsedUserData._id;
        const response = await axios.get(`http://localhost:5002/api/users/api/seller/orders/${sellerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching seller orders:', error);
        setError('Failed to fetch seller orders. Please try again later.');
      }
    };

    fetchSellerOrders();
  }, []);

  const handleOtpChange = (itemId, value) => {
    setOtpInputs({
      ...otpInputs,
      [itemId]: value,
    });
  };

  const verifyOtp = async (orderId, itemId,actualID) => {
    try {
      const token = localStorage.getItem('token');
      console.log("Item ID:", actualID._id);
      const storedOtp = localStorage.getItem(`otp_${actualID._id}`);
      console.log("Stored OTP:", storedOtp);
      const response = await axios.post(`http://localhost:5002/api/users/api/verify-otp`, {
        orderId,
        itemId,
        otp: storedOtp,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log("OTP Verification Response:", response.data);
  
      setVerificationResults(prev => ({
        ...prev,
        [itemId]: response.data.message,
      }));
  
      // Update the orders state by filtering out verified items
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order => {
          if (order._id === orderId) {
            const filteredItems = order.itemsordered.filter(item => item._id !== itemId); // Remove verified item
            return { ...order, itemsordered: filteredItems };
          }
          return order;
        }).filter(order => order.itemsordered.length > 0); // Remove empty orders
  
        return updatedOrders;
      });
  
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setVerificationResults(prev => ({
        ...prev,
        [itemId]: 'OTP verification failed',
      }));
    }
  };


  const userData = JSON.parse(localStorage.getItem('userData'));
  const sellerId = userData._id;

  return (
    <div>
    <Navbar />
    <div className="deliver-items-container">
  {/* <Navbar /> */}
  <h1 className="deliver-title">Deliver Items</h1>
  {error && <p className="error-message">{error}</p>}
  {orders.length === 0 ? (
    <p className="no-orders-message">No orders found.</p>
  ) : (
    <ul className="orders-list">
      {orders.map(order => (
        <li key={order._id} className="order-card">
          <h2 className="order-id">Order ID: {order._id}</h2>
          <p className="order-detail">Total Amount: {order.totalAmount}</p>
          <p className="order-detail">Status: {order.status}</p>
          <p className="order-detail">Created At: {new Date(order.createdAt).toLocaleString()}</p>
          <br></br><hr></hr><br></br>
          <h3 className="items-title">Items:</h3>
          
          <ul className="items-list">
          {order.itemsordered
          .filter(item => item.item.Seller === sellerId && item.item.status === 'ordered')
          .map(item => (
              <li key={item._id} className="item-card">
                  {item.item.Image && (
                      <img 
                          src={item.item.Image} 
                          alt={item.item.ItemName} 
                          className="item-image" 
                      />
                  )}
                  <p className="item-detail">Item Name: {item.item.ItemName}</p>
                  <p className="item-detail">Price: {item.item.Price}</p>
                  <p className="item-detail">Status: {item.item.status}</p>
                  <input
                      type="text"
                      className="otp-input"
                      placeholder="Enter OTP"
                      value={otpInputs[item._id] || ''}
                      onChange={(e) => handleOtpChange(item._id, e.target.value)}
                  /><br></br>
                  <button className="verify-button" onClick={() => verifyOtp(order._id, item._id, item.item)}>Verify OTP</button>
                  {verificationResults[item._id] && <p className="verification-result">{verificationResults[item._id]}</p>}
              </li>
          ))}
        </ul>
        </li>
      ))}
    </ul>
  )}
  {allVerified && <p className="all-verified-message">All Items are delivered</p>}
</div>
</div>
  );
};

export default Deliver_items;
