import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../styles/Categories.css';

const Categories = ({ selectedCategoryId, onCategoryClick }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Помилка завантаження категорій:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories-container">
      <h2>Категорії товарів</h2>
      <ul className="categories-list">
        <li key="all" className={selectedCategoryId === '' ? 'active' : ''}>
          <button onClick={() => onCategoryClick('')}>Усі</button>
        </li>
        {categories.map(category => (
          <li key={category.id} className={selectedCategoryId === category.id ? 'active' : ''}>
            <button onClick={() => onCategoryClick(category.id)}>{category.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

Categories.propTypes = {
  selectedCategoryId: PropTypes.string.isRequired,
  onCategoryClick: PropTypes.func.isRequired,
};

export default Categories;
