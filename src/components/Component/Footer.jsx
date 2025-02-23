
// перевірити інформацію

import React from "react";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h2 className="logo">Магазин</h2>
          <p className="description">Найкращі товари</p>
        </div>

        <div>
          <h3 className="title">Навігация</h3>
          <ul className="nav-links">
            <li><a href="/shop" className="nav-link">Каталог</a></li>
            <li><a href="/contact" className="nav-link">Контакти</a></li>
          </ul>
        </div>

        <div>
          <h3 className="title">Звязок</h3>
          <p className="contact-info">Email: supportStore@example.com</p>
          <p className="contact-info">Телефон: +066 255 6282</p>
        </div>
      </div>
      <div className="copyright">© 2025 Магазин. Всі права захищені.</div>
    </footer>
  );
};

export default Footer;
