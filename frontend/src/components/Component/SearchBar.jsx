import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = async (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim() !== '') {
      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${newQuery}`);
        onSearch(response.data);
      } catch (error) {
        console.error('Помилка пошуку:', error);
      }
    } else {

      try {
        const response = await axios.get('http://localhost:5000/api/products');
        onSearch(response.data);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      }
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Пошук товарів..."
        className="search-input"
      />
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
