import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Hardcoded credentials
  const validCredentials = {
    email: 'admin@example.com',
    password: 'password123'
  };

  useEffect(() => {
    // Check if user is already authenticated via cookie
    const authCookie = document.cookie.split('; ').find(row => row.startsWith('auth='));
    if (authCookie) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email, password) => {
    if (email === validCredentials.email && password === validCredentials.password) {
      // Set auth cookie that expires in 1 day
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);
      document.cookie = `auth=true; expires=${expiryDate.toUTCString()}; path=/`;
      setIsAuthenticated(true);
      navigate('/');
      return true;
    }
    return false;
  };

  const logout = () => {
    // Remove auth cookie
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 