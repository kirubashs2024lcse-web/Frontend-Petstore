import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  return (
    <div className="product-card">
      <img src={product.image || 'https://via.placeholder.com/280x200?text=No+Image'} alt={product.name} onClick={() => navigate(`/shop/${product._id}`)} style={{ cursor: 'pointer' }} />
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 onClick={() => navigate(`/shop/${product._id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
        <p className="product-price">₹{product.price.toFixed(2)}</p>
        <div className="product-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/shop/${product._id}`)}>View</button>
          <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const filtered = products
    .filter((p) => category === 'All' || p.category === category)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pet Shop</h1>
        <p>Everything your pet needs</p>
      </div>
      <div className="shop-controls">
        <input className="search-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="filter-bar">
          {categories.map((c) => (
            <button key={c} className={`filter-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </div>
      <div className="products-grid">
        {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
        {filtered.length === 0 && <p className="empty-msg">No products found.</p>}
      </div>
    </div>
  );
};

export default Shop;
