import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './items.css';
import { useNavigate } from 'react-router-dom';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [error, setError] = useState('');
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5002/api/users/api/items', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setItems(response.data);
                setFilteredItems(response.data);
                
                // Extract and process categories from all items
                const allCategories = response.data.reduce((acc, item) => {
                    // Split categories by comma and trim whitespace
                    const itemCategories = item.Category
                        .split(',')
                        .map(cat => cat.trim().toLowerCase())
                        .filter(cat => cat); // Remove empty categories
                    
                    return [...acc, ...itemCategories];
                }, []);

                // Create unique categories array with proper capitalization
                const uniqueCategoriesSet = [...new Set(allCategories)];
                const formattedCategories = uniqueCategoriesSet
                    .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
                    .sort();
                    
                setUniqueCategories(formattedCategories);
            } catch (error) {
                console.error('Error fetching items:', error.response?.data);
                setError(error.response?.data?.message || 'An error occurred');
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const filtered = items.filter(item => {
            // Convert search query to lowercase for case-insensitive search
            const query = searchQuery.toLowerCase();
            const itemCategories = item.Category
                .split(',')
                .map(cat => cat.trim().toLowerCase());

            // Check if item matches search query
            // const matchesSearch = 
            //     query === '' || 
            //     item.ItemName.toLowerCase().includes(query) ||
            //     item.Description.toLowerCase().includes(query) ||
            //     itemCategories.some(cat => cat.includes(query));
            

            const matchesSearch = 
                query === '' || 
                item.ItemName.toLowerCase().includes(query);


            // Check if item matches selected categories
            const matchesCategories = 
                selectedCategories.length === 0 || 
                selectedCategories.some(selectedCat => 
                    itemCategories.includes(selectedCat.toLowerCase())
                );

            return matchesSearch && matchesCategories;
        });
        
        setFilteredItems(filtered);
    }, [searchQuery, selectedCategories, items]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prevCategories =>
            prevCategories.includes(category)
                ? prevCategories.filter(c => c !== category)
                : [...prevCategories, category]
        );
    };

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div>
            <Navbar />
            <div className="item-list-container">
                <h2 className="item-list-title">Item List</h2>
                <input 
                    type="text" 
                    placeholder="Search items..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="search-input"
                />
                <div className="category-filters">
                    {uniqueCategories.map(category => (
                        <label key={category} className="category-label">
                            <input
                                type="checkbox"
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            {category}
                        </label>
                    ))}
                </div>
                <ul className="item-list"><br></br>
                    {filteredItems.map(item => (
                        <li key={item._id} className="item-card" onClick={() => navigate(`/items/${item._id}`)}>
                            {item.Image && (
                                <img 
                                    src={item.Image} 
                                    alt={item.ItemName} 
                                    className="item-image" 
                                />
                            )}
                            <h3 className="item-title">{item.ItemName}</h3>
                            <p className="item-detail"><strong>Price:</strong> {item.Price}</p>
                            <p className="item-detail"><strong>Description:</strong> {item.Description}</p>
                            <p className="item-detail"><strong>Categories:</strong> {item.Category}</p>
                            <p className="item-detail"><strong>Seller:</strong> {item.Seller}</p>
                            <p className="item-detail"><strong>Email:</strong> {item.Email}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ItemList;


