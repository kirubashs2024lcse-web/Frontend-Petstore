import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const BecomeSeller = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ownerName: user ? `${user.firstname} ${user.lastname}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    petName: '', species: 'Dog', breed: '', age: '', description: '',
  });
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!user) return (
    <div className="page center-content">
      <div className="auth-prompt">
        <h2>Login Required</h2>
        <p>You must be logged in to submit a pet for adoption.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { setError('Please upload a pet image.'); return; }
    const data = new FormData();
    Object.keys(form).forEach((k) => data.append(k, form[k]));
    data.append('image', image);
    try {
      await API.post('/pets/submit', data);
      setSubmitted(true);
    } catch {
      setError('Submission failed. Please try again.');
    }
  };

  if (submitted) return (
    <div className="page center-content">
      <div className="success-box">
        <h2>✅ Submission Received!</h2>
        <p>Your pet listing has been submitted for admin review. Once approved, it will appear on the Adopt Me page.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Become a Seller</h1>
        <p>Submit your pet for adoption — our team will review and approve it</p>
      </div>
      <form className="form-container" onSubmit={handleSubmit}>
        <h3>Your Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input name="ownerName" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        </div>
        <h3>Pet Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Pet Name</label>
            <input name="petName" value={form.petName} onChange={(e) => setForm({ ...form, petName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Species</label>
            <select name="species" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })}>
              <option>Dog</option><option>Cat</option><option>Bird</option><option>Other</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Breed</label>
            <input name="breed" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Age (years)</label>
            <input name="age" type="number" min="0" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />
        </div>
        <div className="form-group">
          <label>Pet Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn btn-primary">Submit for Review</button>
      </form>
    </div>
  );
};

export default BecomeSeller;
