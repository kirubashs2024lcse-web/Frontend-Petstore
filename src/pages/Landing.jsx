import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="landing">
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to PetStore 🐾</h1>
        <p>Find your perfect furry companion. Adopt, shop, and give pets the loving home they deserve.</p>
        <div className="hero-buttons">
          <Link to="/adopt" className="btn btn-primary">Adopt a Pet</Link>
          <Link to="/shop" className="btn btn-secondary">Visit Shop</Link>
        </div>
      </div>
    </section>

    <section className="features">
      <div className="feature-card">
        <span className="feature-icon">🐶</span>
        <h3>Adopt a Pet</h3>
        <p>Browse pets available for adoption and give them a forever home.</p>
        <Link to="/adopt" className="btn btn-outline">Browse Pets</Link>
      </div>
      <div className="feature-card">
        <span className="feature-icon">🛍️</span>
        <h3>Pet Shop</h3>
        <p>Find all the essentials — food, toys, accessories and more.</p>
        <Link to="/shop" className="btn btn-outline">Shop Now</Link>
      </div>
      <div className="feature-card">
        <span className="feature-icon">🤝</span>
        <h3>Become a Seller</h3>
        <p>Have a pet to give up for adoption? Submit and we'll help find a home.</p>
        <Link to="/become-seller" className="btn btn-outline">List Your Pet</Link>
      </div>
    </section>

    <section className="info-section">
      <div className="info-text">
        <h2>Why Choose PetStore?</h2>
        <ul>
          <li>✅ Verified pet listings approved by our admin team</li>
          <li>✅ Secure and trusted pet adoption process</li>
          <li>✅ Wide range of pet products available</li>
          <li>✅ Easy-to-use platform for sellers and buyers</li>
        </ul>
      </div>
      <div className="info-stats">
        <div className="stat"><h2>200+</h2><p>Pets Adopted</p></div>
        <div className="stat"><h2>500+</h2><p>Products Available</p></div>
        <div className="stat"><h2>100+</h2><p>Happy Sellers</p></div>
      </div>
    </section>
  </div>
);

export default Landing;
