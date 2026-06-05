import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div>
        <h3>🐾 PetStore</h3>
        <p>Find your perfect companion</p>
      </div>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/adopt">Adopt Me</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/become-seller">Become a Seller</Link>
      </div>
    </div>
    <p className="footer-copy">© 2024 PetStore. All rights reserved.</p>
  </footer>
);

export default Footer;
