import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const handleUserActivity = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Встановлюємо новий таймер на 1 годину
      const newTimeoutId = setTimeout(logout, 3600000); // 1 година
      setTimeoutId(newTimeoutId);
    };

    // Додаємо обробники подій для активності користувача
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);

    // Повертаємо функцію для очищення обробників подій
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
    // Очищуємо таймер
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
