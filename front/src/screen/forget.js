import React, { useState } from 'react';
import axios from 'axios';
import '../css/forget.css';


function Forget() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setMessage('plesse login first');
//       setTimeout(() => {
//         window.location.href = '/';
//       }, 2000);
//     }
//   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8080/auth/forgot-password', { username });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="forget-container">
        <p>Forgot your account’s password? Enter your email address and we ’ll send you a recovery link.</p>
      <h2 className="forget-title">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forget-form">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          className="forget-input"
        />
        <button type="submit" className="forget-button"> Reset Link</button>
      </form>
      {message && <p className="forget-message">{message}</p>}
    </div>
  );
}

export default Forget;
