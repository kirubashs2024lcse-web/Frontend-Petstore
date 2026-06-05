import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <button className="btn btn-outline back-btn" onClick={() => navigate('/shop')}>← Back to Shop</button>
      <div className="product-detail">
        <img src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={product.name} />
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-price large">${product.price?.toFixed(2)}</p>
          <p>{product.description}</p>
          <div className="qty-row">
            <label>Qty:</label>
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="qty-input" />
          </div>
          <div className="product-actions">
            <button className="btn btn-outline" onClick={() => addToCart({ ...product, qty })}>Add to Cart</button>
            <button className="btn btn-primary" onClick={() => { addToCart({ ...product, qty }); navigate('/cart'); }}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
