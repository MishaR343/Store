import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Header from "../components/Component/Header";
import Footer from "../components/Component/Footer";
import Categories from "../components/Categories";
import "../styles/ProductCard.css";
import "../styles/HomePage.css";

export default function HomePage() {
  const [banner, setBanner] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get("http://localhost:5000/api/products");
        setProducts(productResponse.data);
        setFilteredProducts(productResponse.data);

        const bannerResponse = await axios.get("http://localhost:5000/api/banner");
        setBanner(bannerResponse.data.imageUrl);

        setLoading(false);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (category_id) => {
    setSelectedCategoryId(category_id);
    filterProducts(category_id);
  };

  const filterProducts = (category_id) => {
    if (category_id) {
      const filtered = products.filter(product => product.category_id === category_id);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSearchResults = (searchResults) => {
    setSelectedCategoryId();
    setFilteredProducts(searchResults);
  };

  return (
    <div className="page">
       <Header onSearch={handleSearchResults} />
      <div className="home-page-main-content">
          <div className="mt-4">
            {banner && (
              <img src={banner} alt="Banner" className="rounded-lg shadow-lg" /> 
            )}
          </div>
          <div className="content-wrapper">
            <Categories
              selectedCategoryId={selectedCategoryId}
              onCategoryClick={handleCategoryClick}
            /> 
              </div>
            <div className="products-list">
              {loading ? (
                <p className="text-center">Завантаження...</p>
              ) : (
                <div className="product-items">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <ProductCard key={product.id} id={product.id} /> 
                    ))
                  ) : (
                    <p>Товари не знайдено</p>
                  )}
                </div>
              )}
            </div>
        </div>
      <Footer /> 
    </div>
  );
}
