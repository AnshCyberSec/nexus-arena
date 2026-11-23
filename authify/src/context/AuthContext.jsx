import { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. App start hote hi check karo ki user pehle se logged in hai ya nahi
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.data.success) {
            setUser(response.data.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Token invalid/expired hai, toh clear kar do
          localStorage.removeItem('accessToken');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // 2. Login Function
  const login = (authResponseData) => {
    // authResponseData mein accessToken aur user object aata hai
    if (authResponseData.accessToken) {
      localStorage.setItem('accessToken', authResponseData.accessToken);
      setUser(authResponseData.user);
      setIsAuthenticated(true);
    }
  };

  // 3. Logout Function
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed, but clearing local state.", error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};