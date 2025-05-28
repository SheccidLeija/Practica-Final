const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class AuthService {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    
    return data;
  }

  async register(username, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    
    return data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  getCurrentUser() {
    return {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
    };
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default new AuthService(); 