  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import Navbar from './Navbar';
  import './items.css';
  import './Orders_history.css';
  import { useNavigate } from 'react-router-dom';

  const Order_history = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [gotItems, setGotItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchOrderHistory = async () => {
        try {
          const token = localStorage.getItem('token');
          const userData = localStorage.getItem('userData');
          const parsedUserData = JSON.parse(userData);
          const userId = parsedUserData._id;
          const response = await axios.get(`https://buy-sell-zwmw.onrender.com/api/users/api/orders/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // console.log("Response from Order History:", response.data);
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching order history:', error);
          setError('Failed to fetch order history. Please try again later.');
        }
      };

      
    
    
      const fetchshouldgotItems = async () => {
        try {
          const token = localStorage.getItem('token');
          const userData = localStorage.getItem('userData');
          const parsedUserData = JSON.parse(userData);
          const userId = parsedUserData._id;
          const response = await axios.get(`https://buy-sell-zwmw.onrender.com/api/users/api/delivered/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // if(response.data.length === 0){
          //   console.log("No items delivered by user");
          // }
          // else{
          //   setGotItems(response.data);
          // }
          console.log("Delivered items response:", response.data);
          setGotItems(response.data);

    setGotItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error fetching delivered items:', error);
          setError('Failed to fetch delivered items. Please try again later.');
        }
      };

      fetchOrderHistory();
      fetchshouldgotItems();
  }, []);

    if (error) {
      return <p className="error-message">{error}</p>;
    }

    // if (orders.length === 0) {
    //   return <p>No orders found.</p>;
    // }

    const orderedItems = [];
    const deliveredToUserItems = [];
    // const deliveredByUserItems = [];

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData._id;

    orders.forEach(order => {
      order.itemsordered.forEach(item => {
        console.log("Item:", item);
        const storedOtp = localStorage.getItem(`otp_${item.item._id}`);
        console.log("Stored OTP:", storedOtp);
        // console.log("OTP:", otp);
        // console.log("Data of item:", item, "userId:", userId);
        if (item.status === 'ordered') {
          orderedItems.push({ ...item, orderId: order._id, totalAmount: order.totalAmount, createdAt: order.createdAt , storedOtp});
        } else if (item.status === 'delivered' && item.Seller !== userId) {
          // console.log("Came heere!!!!");
          deliveredToUserItems.push({ ...item, orderId: order._id, totalAmount: order.totalAmount, createdAt: order.createdAt });
        } 
        // else if (item.status === 'delivered' && item.Seller === userId) {
        //   console.log("Came down!!!!");  
        //   deliveredByUserItems.push({ ...item, orderId: order._id, totalAmount: order.totalAmount, createdAt: order.createdAt });
        // }
      });
    });

    return (
      <div>
        <Navbar />
        <div className="order-history-container"> 
        <h1 className="order-history-title">Order History</h1>
        {orders.length === 0 && deliveredToUserItems.length === 0 && gotItems.length === 0? (
        <div className="no-orders-box">
          <p className="no-orders-message">No orders found.</p>
        </div>
        ) : (
        <div className="order-columns">
          
          {/* Column 1: Items Ordered (Not Yet Delivered) */}
          <div className="order-column">
            <h2 className="section-title">Items Ordered (Not Yet Delivered)</h2>
            <ul className="order-list">
              {orderedItems.length === 0 ? (
                <p className="no-items-message">No items found.</p>
              ) : (
                
                orderedItems.map(item => (
                  
                  <li
                  key={item._id}
                  className="order-card"
                 >
                  
                  <h2 className="order-id">Order ID: {item.orderId}</h2>
                    <p className="order-detail">Total Amount: {item.totalAmount}</p>
                    <p className="order-detail">Created At: {new Date(item.createdAt).toLocaleString()}</p>
                    <h3 className="item-details-title">Item Details:</h3>
                    <p className="item-detail">Item Name: {item.item.ItemName}</p>
                    <p className="item-detail">Price: {item.item.Price}</p>
                    <p className="item-detail">OTP: {item.storedOtp}</p>
                    <p className="item-detail">Status: {item.status}</p>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Column 2: Items Delivered to User */}
          <div className="order-column">
            <h2 className="section-title">Items Delivered to User</h2>
            <ul className="order-list">
              {deliveredToUserItems.length === 0 ? (
                <p className="no-items-message">No items found.</p>
              ) : (
                deliveredToUserItems.map(item => (
                  <li
                      key={item._id}
                      className="order-card"
                    >
                    <h2 className="order-id">Order ID: {item.orderId}</h2>
                    <p className="order-detail">Total Amount: {item.totalAmount}</p>
                    <p className="order-detail">Created At: {new Date(item.createdAt).toLocaleString()}</p>
                    <h3 className="item-details-title">Item Details:</h3>
                    <p className="item-detail">Item Name: {item.item.ItemName}</p>
                    <p className="item-detail">Price: {item.item.Price}</p>
                    <p className="item-detail">Status: {item.status}</p>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Column 3: Items Delivered by User */}
          <div className="order-column">
            <h2 className="section-title">Items Delivered by User</h2>
            <ul className="order-list">
              {gotItems.length === 0 ? (
                <p className="no-items-message">No items delivered by user.</p>
              ) : (
                gotItems.map(item => (
                  <li
                      key={item.itemId}
                      className="order-card"
                    >
                    <p className="item-detail">Item Name: {item.itemName}</p>
                    <p className="item-detail">Price: {item.price}</p>
                    <p className="item-detail">Status: {item.status}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        )}
      </div>
      </div>
    );
  };

  export default Order_history;

