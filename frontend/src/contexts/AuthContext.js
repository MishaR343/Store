import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [timeoutId, setTimeoutId] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState(''); // Додайте стан для повідомлення

  useEffect(() => {
    const handleUserActivity = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(logout, 3600000);
      setTimeoutId(newTimeoutId);
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
    };
  }, [timeoutId]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("sessionStart", Date.now());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("sessionStart");

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, redirectMessage, setRedirectMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
