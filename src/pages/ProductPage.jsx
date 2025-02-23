import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Component/Header";
import Footer from "../components/Component/Footer";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import "../styles/ProductPage.css";
import WarningModal from "../components/Component/WarningModal"; // Імпортуємо WarningModal

const ProductPage = () => {
  const { user } = useContext(AuthContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false); // Стан для попереджувального вікна

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
        if (response.data.image_base64?.length > 0) {
          setSelectedImage(response.data.image_base64[0]);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const checkIfInCart = async () => {
      try {
        if (!user) return;
        const response = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
        const cartItems = response.data;
        if (cartItems.some(item => item.id === parseInt(productId))) {
          setAddedToCart(true);
        }
      } catch (err) {
        console.error("Помилка перевірки кошика:", err);
      }
    };

    fetchProduct().then(() => checkIfInCart()).finally(() => setLoading(false));
  }, [productId, user]);

  const handleAddToCart = async () => {
    if (!user) {
      setIsWarningModalOpen(true); // Відкриваємо модальне вікно, якщо користувач не авторизований
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/cart/${user.id}`, {
        product_id: product.id,
        user_id: user.id,
      });

      if (response.status === 201) {
        setAddedToCart(true);
      }
    } catch (err) {
      console.error(err);
      setError("Помилка при додаванні товару в кошик");
    }
  };

  const handleCloseWarningModal = () => {
    setIsWarningModalOpen(false);
  };

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;
  if (!product) return <div>Товар не знайдено</div>;

  const defaultPlaceholder = "https://via.placeholder.com/400";
  const mainImage = selectedImage ? `data:image/jpeg;base64,${selectedImage}` : defaultPlaceholder;

  const handleImageClick = (img) => {
    if (img !== selectedImage) setSelectedImage(img);
  };

  return (
    <div className="page">
      <Header />
      <div className="product-page-main-content">
        <div className="product-image-container-product-page">
          <img src={mainImage} alt={product.name} className="main-product-image-product-page" />
          {product.image_base64?.length > 1 && (
            <div className="thumbnail-wrapper-product-page">
              {product.image_base64.filter(img => img !== selectedImage).map((img, index) => (
                <img
                  key={index}
                  src={`data:image/jpeg;base64,${img}`}
                  alt={`Thumbnail ${index}`}
                  className="thumbnail-image-product-page"
                  onClick={() => handleImageClick(img)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="info-section-product-page">
          <h2 className="title-product-page">{product.name}</h2>
          <p className="description-product-page">{product.detailed_description}</p>
          <p className="price-product-page">Ціна: <span className="price">{product.price} грн</span></p>
          {product.stock_quantity > 0 ? (
            <p className="stock-status-product-page">В наявності: {product.stock_quantity}</p>
          ) : (
            <p className="stock-status-product-page out-of-stock">Немає в наявності</p>
          )}
          <p className="product-scale">Масштаб: {product.scale}</p>
          <p className="product-material">Матеріал: {product.material}</p>
          <p className="product-release-year">Рік випуску: {product.release_year}</p>
          <button
            className="button-order-product-page"
            onClick={handleAddToCart}
            disabled={addedToCart}
          >
            {addedToCart ? "Товар додано в кошик" : "Додати у кошик"}
          </button>
        </div>
      </div>
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={handleCloseWarningModal}
      />
      <Footer />
    </div>
  );
};

export default ProductPage;
