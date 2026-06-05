import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    setError('');
    try {
      await API.post('/orders', {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image || '',
        })),
        total,
      });
      clearCart();
      navigate('/orders?success=1');
    } catch (err) {
      console.error('Status:', err?.response?.status);
      console.error('Data:', err?.response?.data);
      if (err?.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="page center-content">
      <div className="auth-prompt">
        <h2>Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>Go to Shop</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header"><h1>Shopping Cart</h1></div>
      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image || 'https://via.placeholder.com/80x80?text=Item'} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Qty: {item.qty} × ₹{item.price?.toFixed(2)}</p>
              </div>
              <div className="cart-item-right">
                <p className="cart-item-total">₹{(item.price * item.qty).toFixed(2)}</p>
                <button className="btn btn-danger" onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>Total: <strong>₹{total.toFixed(2)}</strong></p>
          {error && <p className="error-msg">{error}</p>}
          {!user && <p className="error-msg">Please login to checkout.</p>}
          <button className="btn btn-primary" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Placing Order...' : 'Checkout'}
          </button>
          <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
