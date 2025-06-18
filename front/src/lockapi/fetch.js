// utils/authFetch.js
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Unauthorized: No token found');
  }

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  // Handle expired token and unauthorized access
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  return response;
};
