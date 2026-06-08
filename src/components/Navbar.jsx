import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🐾Mr-PetStore</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/adopt">Adopt Me</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/become-seller">Become a Seller</Link>
        {user && <Link to="/orders">My Orders</Link>}
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {user ? (
          <>
            <span className="nav-user">Hi, {user.firstname}</span>
            <button onClick={handleLogout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
        <Link to="/cart" className="cart-icon">
          🛒 {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
