import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("quiz_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("quiz_user"));

  useEffect(() => {
    if (user) {
      localStorage.setItem("quiz_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("quiz_user");
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("quiz_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
