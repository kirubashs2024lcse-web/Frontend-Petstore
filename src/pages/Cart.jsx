import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const navigate = useNavigate();

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
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Qty: {item.qty} × ${item.price?.toFixed(2)}</p>
              </div>
              <div className="cart-item-right">
                <p className="cart-item-total">${(item.price * item.qty).toFixed(2)}</p>
                <button className="btn btn-danger" onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>Total: <strong>${total.toFixed(2)}</strong></p>
          <button className="btn btn-primary" onClick={() => { alert('Order placed! (Payment integration pending)'); clearCart(); }}>Checkout</button>
          <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
