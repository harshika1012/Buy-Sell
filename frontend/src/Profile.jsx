import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SendUpdatedProfile } from './requests';
import Navbar from './Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setProfileData(JSON.parse(storedUserData));
      }
      try {
        const response = await axios.get('http://localhost:5002/api/users/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.response ? error.response.data.message : 'An unexpected error occurred');
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!profileData) {
    return <p>Loading...</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await SendUpdatedProfile(profileData);
      console.log("Updated Data from Profile after saving:", profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/Login');
  };

  return (
    <div>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // padding: '10px',
        color: 'white',
        // marginTop: '2px',
      }}>
        <div style={{
          maxWidth: '700px',
          width: '100%',
          backgroundColor: 'rgba(43, 41, 41, 0.5)', // More transparent black background
          borderRadius: '8px',
          padding: '30px',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '600' }}>Profile Information</h1>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '15px'
          }}>
            {/* First Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                First Name
              </label>
              <input
                name="FirstName"
                value={profileData.FirstName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  width: '60%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'black' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Last Name
              </label>
              <input
                name="LastName"
                value={profileData.LastName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  width: '60%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'black' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>

            {/* Email Field - Read Only */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Email
              </label>
              <input
                type="email"
                value={profileData.Email}
                readOnly
                style={{
                  width: '60%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>

            {/* Age */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Age
              </label>
              <input
                name="Age"
                value={profileData.Age}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  width: '60%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'black' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>

            {/* Contact */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Contact
              </label>
              <input
                name="Contact"
                value={profileData.Contact}
                onChange={handleInputChange}
                readOnly={!isEditing}
                style={{
                  width: '60%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'black' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>

            
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            gap: '10px'
          }}>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

