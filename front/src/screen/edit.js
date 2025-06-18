import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authFetch } from '../lockapi/fetch';
const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    age: '',
    work: '',
    address: '',
    salary: ''
  });

  useEffect(() => {
    authFetch(`http://localhost:8080/person/${id}`)
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => {
        console.error(err);
        alert('Failed to load user data');
        navigate('/'); 
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    authFetch(`http://localhost:8080/person/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
      .then(res => res.json())
      .then(() => {
        alert('User updated successfully!');
        navigate('/tabel');
      })
      .catch(err => {
        console.error(err);
        alert('Error updating user');
      });
  };

  return (
    <div className="form-container">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required />
        <input type="number" name="age" value={userData.age} onChange={handleChange} placeholder="Age" required />
        <select name="work" value={userData.work} onChange={handleChange} required>
          <option value="" disabled>Select work</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
          <option value="HR">HR</option>
          <option value="Intern">Intern</option>
          <option value="Tester">Tester</option>
        </select>
        <input type="text" name="address" value={userData.address} onChange={handleChange} placeholder="Address" />
        <input type="number" name="salary" value={userData.salary} onChange={handleChange} placeholder="Salary" />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Edit;
