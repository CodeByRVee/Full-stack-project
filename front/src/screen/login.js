import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../css/loginPage.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function LoginSignup() {
  const navigate = useNavigate();

  const [formType, setFormType] = useState('login');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const API_URL = 'http://localhost:8080/auth';

  // Reset form fields when toggling forms
  const toggleFormType = (type) => {
    setFormType(type);
    setLoading(false);
    setLoginData({ username: '', password: '' });
    setSignupData({
      username: '',
      password: '',
      confirmPassword: '',
      agreed: false,
    });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const token = localStorage.getItem('token');
    if (token) {
      Swal.fire({
        icon: 'info',
        title: 'Already Logged In',
        text: 'You are already logged in!',
      });
      setLoading(false);
      navigate('/logout');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/tabel');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (signupData.password !== signupData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: "Passwords don't match",
      });
      return;
    }

    if (signupData.password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password should be at least 6 characters long',
      });
      return;
    }

    if (!signupData.agreed) {
      Swal.fire({
        icon: 'warning',
        title: 'Terms Not Accepted',
        text: 'You must agree to the terms and conditions to sign up',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupData.username,
          password: signupData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Signup failed');

      Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/tabel');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>{formType === 'login' ? 'Login' : 'Sign Up'}</h2>

      <form onSubmit={formType === 'login' ? handleLogin : handleSignup}>
        <label htmlFor="username" className="sr-only">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={formType === 'login' ? loginData.username : signupData.username}
          onChange={(e) =>
            formType === 'login'
              ? setLoginData({ ...loginData, username: e.target.value })
              : setSignupData({ ...signupData, username: e.target.value })
          }
          required
          disabled={loading}
        />

        <label htmlFor="password" className="sr-only">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          autoComplete={formType === 'login' ? 'current-password' : 'new-password'}
          value={formType === 'login' ? loginData.password : signupData.password}
          onChange={(e) =>
            formType === 'login'
              ? setLoginData({ ...loginData, password: e.target.value })
              : setSignupData({ ...signupData, password: e.target.value })
          }
          required
          disabled={loading}
        />

        {formType === 'signup' && (
          <>
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({ ...signupData, confirmPassword: e.target.value })
              }
              required
              disabled={loading}
            />

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="terms"
                checked={signupData.agreed}
                onChange={(e) =>
                  setSignupData({ ...signupData, agreed: e.target.checked })
                }
                required
                disabled={loading}
              />
              <label htmlFor="terms">I agree to the terms and conditions</label>
            </div>
          </>
        )}

        {formType === 'login' && (
          <p className="forgot-password">
            <a href="/forget">Reset your Password?</a>
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? (formType === 'login' ? 'Logging in...' : 'Signing up...') : (formType === 'login' ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <p className="toggle">
        {formType === 'login' ? (
          <>
            Don't have an account?{' '}
            <button type="button" onClick={() => toggleFormType('signup')}>
              Sign Up
            </button><br /><br />
            <GoogleLogin
              onSuccess={credentialResponse => {
                const decoded = jwtDecode(credentialResponse.credential);
                console.log("Decoded User Info:", decoded);
                console.log("Name:", decoded.name);
                console.log("Email:", decoded.email);
              }}

              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap={true}
            />
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" onClick={() => toggleFormType('login')}>
              Login
            </button>

          </>
        )}
      </p>
    </div>
  )
}

export default LoginSignup;