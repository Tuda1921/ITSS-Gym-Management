import { login as apiLogin, register as apiRegister, getCurrentUser as apiGetCurrentUser, logout as apiLogout } from "./api";

// Mock Authentication Service
const DEMO_ACCOUNTS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@gym.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    permissions: ['all']
  },
  {
    id: 2,
    username: 'staff',
    email: 'staff@gym.com',
    password: 'staff123',
    role: 'staff',
    name: 'Staff Member',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b8e5?w=150&h=150&fit=crop&crop=face',
    permissions: ['customer', 'subscription', 'feedback', 'gymroom', 'device']
  },
  {
    id: 3,
    username: 'coach',
    email: 'coach@gym.com',
    password: 'coach123',
    role: 'coach',
    name: 'Personal Trainer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    permissions: ['clients', 'schedule', 'programs', 'progress']
  },
  {
    id: 4,
    username: 'user',
    email: 'user@gym.com',
    password: 'user123',
    role: 'user',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
    permissions: ['dashboard', 'schedule', 'progress', 'profile']
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a mock JWT token
const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    id: user.id, 
    email: user.email, 
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

// Decode mock JWT token
const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null; // Token expired
    
    return payload;
  } catch (error) {
    return null;
  }
};

export const authService = {
  // Login with email/username and password
  async login(credentials) {
    console.log('authService.login called with:', credentials);
    const { emailOrUsername, password } = credentials;
    const result = await apiLogin(emailOrUsername, password);
    if (!result.success) {
      localStorage.removeItem("gym_token");
      localStorage.removeItem("gym_user");
      throw new Error(result.message || "Login failed");
    }
    localStorage.setItem("gym_token", result.token);
    localStorage.setItem("gym_user", JSON.stringify(result.user));
    return result;
  },
  
  // Logout
  async logout() {
    localStorage.removeItem("gym_token");
    localStorage.removeItem("gym_user");
    return apiLogout();
  },
  
  // Get current user from stored token
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("gym_user") || "null");
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("gym_token");
  },
  
  // Get stored token
  getToken() {
    return localStorage.getItem("gym_token");
  },
  
  // Get demo accounts (for development/testing)
  getDemoAccounts() {
    return DEMO_ACCOUNTS.map(({ password, ...account }) => account);
  },
  
  // Check user permissions
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  },
  
  // Refresh token (mock implementation)
  async refreshToken() {
    const user = this.getCurrentUser();
    if (!user) throw new Error("No user found");
    const result = await apiLogin(user.email, user.password);
    localStorage.setItem("gym_token", result.token);
    return { token: result.token };
  }
};

export default authService; 