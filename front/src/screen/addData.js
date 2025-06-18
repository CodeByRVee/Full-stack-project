import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../css/addData.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/person';

function AddData() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', age: '', work: '', address: '', salary: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to add data.',
      });
      navigate('/');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.status === 401 || res.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please login again.',
        });
        localStorage.removeItem('token');
        navigate('/');
        return;
      }

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Data added successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
        setFormData({ name: '', email: '', age: '', work: '', address: '', salary: '' });
        navigate('/tabel');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add',
          text: data.message || 'Something went wrong.',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Please try again later.',
      });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Add User Data</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <select
          name="work"
          value={formData.work}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select work</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
          <option value="HR">HR</option>
          <option value="Intern">Intern</option>
          <option value="Tester">Tester</option>
        </select>

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
        />

        <button type="submit">Add Data</button>
      </form>
    </div>
  );
}

export default AddData;
