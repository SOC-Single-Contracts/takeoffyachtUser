import { signOut } from 'next-auth/react';
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

async function handleError(response) {
  const error = await handleResponse(response);
  if (response.status === 401) {
    await signOut({ redirect: true, callbackUrl: '/login' });
  }
  throw new Error(error.message || error || `HTTP error! status: ${response.status}`);
}

export const authAPI = {
  login: (credentials) => API('Auth/Login/', {
    method: 'POST',
    body: credentials
  }),
  
  register: (userData) => API('Auth/Register/', {
    method: 'POST',
    body: userData
  }),

  googleSignInRedirect: () => API('Auth/GoogleSignInRedirectView/', {
    method: 'GET'
  }),

  googleSignInCallback: (code) => API('Auth/GoogleSignInCallbackView/', {
    method: 'GET',
    params: { code }
  }),

  logout: () => API('Auth/logout/', {
    method: 'POST'
  })
};

// User endpoints
export const userAPI = {
  getProfile: () => API('User/Profile/', {
    method: 'GET'
  }),
  
  updateProfile: (data) => API('User/Profile/', {
    method: 'PUT',
    body: data
  })
};

export default API;