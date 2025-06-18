import React, { useEffect, useState } from 'react';
import '../css/profile.css';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    fetch('http://localhost:8080/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch profile data');
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data.user);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  if (!userData) return <div className="loading-message">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{userData.username}'s Profile</h2>
      </div>
      <div className="profile-details">
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Age:</strong> {userData.age}</p>
        <p><strong>Work:</strong> {userData.work}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>Salary:</strong> {userData.salary}</p>
      </div>
      <div className="profile-footer">

        <button className='btn' onClick={() => window.location.href = '/tabel'}>Back to Table</button>
        <button  className='btn'onClick={() => window.location.href = '/edit/' + userData._id}>Edit Profile</button>

      </div>
     
    </div>
  
  );
}

export default Profile;
