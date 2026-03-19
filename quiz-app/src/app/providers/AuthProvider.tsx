import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { setAccessToken, setAuthContext } from "../../lib/axiosInstance";
import { API_BASE_URL } from "../../config/env";
import { User, AuthResponse } from "../../types/user.type";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  login: (userData: AuthResponse) => void;
  logout: () => void;
  updateToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update token function for axios interceptor
  const updateToken = (token: string) => {
    setAccessTokenState(token);
    setAccessToken(token);
  };

  const login = (userData: AuthResponse) => {
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
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
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
          const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
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
            const profileResponse = await fetch(`${API_BASE_URL}/api/users/profile`, {
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
