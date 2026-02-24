import React, { createContext, useContext, useState, useEffect } from "react";
import { setAccessToken, setAuthContext } from "../lib/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update token function for axios interceptor
  const updateToken = (token) => {
    setAccessTokenState(token);
    setAccessToken(token);
  };

  const login = (userData) => {
    setUser(userData.user);
    setAccessTokenState(userData.accessToken);
    setAccessToken(userData.accessToken);
    
    // Store refresh token in localStorage
    if (userData.refreshToken) {
      localStorage.setItem('quiz_refresh_token', userData.refreshToken);
    }
    
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate refresh token
      const refreshToken = localStorage.getItem('quiz_refresh_token');
      if (refreshToken) {
        await fetch('http://localhost:8082/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth state
      setUser(null);
      setAccessTokenState(null);
      setAccessToken(null);
      setIsLoggedIn(false);
      localStorage.removeItem('quiz_refresh_token');
      localStorage.removeItem('quiz_user');
    }
  };

  // Session restoration on app load
  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = localStorage.getItem('quiz_refresh_token');
      
      if (refreshToken && !accessToken) {
        try {
          const response = await fetch('http://localhost:8082/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();
            setAccessTokenState(data.accessToken);
            setAccessToken(data.accessToken);
            
            // Store new refresh token
            if (data.refreshToken) {
              localStorage.setItem('quiz_refresh_token', data.refreshToken);
            }
            
            // Fetch user profile
            const profileResponse = await fetch('http://localhost:8082/api/users/profile', {
              headers: {
                'Authorization': `Bearer ${data.accessToken}`,
              },
            });
            
            if (profileResponse.ok) {
              const userData = await profileResponse.json();
              setUser(userData);
              setIsLoggedIn(true);
            }
          } else {
            // Refresh token invalid, clear it
            localStorage.removeItem('quiz_refresh_token');
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('quiz_refresh_token');
        }
      }
    };

    restoreSession();
  }, []);

  // Set auth context functions for axios interceptor
  useEffect(() => {
    setAuthContext({ updateToken, logout });
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoggedIn, login, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
