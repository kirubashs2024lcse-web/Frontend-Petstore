import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '' });
  const [productImage, setProductImage] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    API.get('/pets/submissions').then((r) => setSubmissions(r.data)).catch(console.error);
    API.get('/products').then((r) => setProducts(r.data)).catch(console.error);
  }, [user, navigate]);

  const handleApprove = async (id) => {
    try {
      await API.put(`/pets/approve/${id}`);
      setSubmissions((prev) => prev.map((s) => s._id === id ? { ...s, status: 'approved' } : s));
      setMsg('Pet approved and listed on Adopt Me page!');
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/pets/reject/${id}`);
      setSubmissions((prev) => prev.map((s) => s._id === id ? { ...s, status: 'rejected' } : s));
    } catch (err) { console.error(err); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(newProduct).forEach((k) => data.append(k, newProduct[k]));
    if (productImage) data.append('image', productImage);
    try {
      const res = await API.post('/products', data);
      setProducts((prev) => [...prev, res.data]);
      setMsg('Product added successfully!');
      setNewProduct({ name: '', price: '', category: '', description: '' });
      setProductImage(null);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page">
      <div className="page-header"><h1>Admin Panel</h1></div>
      {msg && <div className="success-banner" onClick={() => setMsg('')}>{msg} ✕</div>}
      <div className="admin-tabs">
        <button className={`tab-btn ${tab === 'submissions' ? 'active' : ''}`} onClick={() => setTab('submissions')}>
          Pet Submissions ({submissions.filter((s) => s.status === 'pending').length})
        </button>
        <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
          Manage Products
        </button>
      </div>

      {tab === 'submissions' && (
        <div className="admin-section">
          <h2>Pet Adoption Submissions</h2>
          {submissions.length === 0 && <p>No submissions yet.</p>}
          <div className="submissions-list">
            {submissions.map((s) => (
              <div key={s._id} className={`submission-card ${s.status}`}>
                <div className="submission-info">
                  <h3>{s.petName} <span className="species-tag">{s.species}</span></h3>
                  <p><strong>Breed:</strong> {s.breed} · <strong>Age:</strong> {s.age} yr(s)</p>
                  <p><strong>Owner:</strong> {s.ownerName} · {s.email}</p>
                  <p>{s.description}</p>
                  {s.image && <img src={`${BASE_URL}${s.image}`} alt={s.petName} className="submission-img" />}
                </div>
                <div className="submission-actions">
                  <span className={`status-badge ${s.status}`}>{s.status}</span>
                  {s.status === 'pending' && (
                    <>
                      <button className="btn btn-primary" onClick={() => handleApprove(s._id)}>Approve</button>
                      <button className="btn btn-danger" onClick={() => handleReject(s._id)}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="admin-section">
          <h2>Add New Product</h2>
          <form className="form-container" onSubmit={handleAddProduct}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={(e) => setProductImage(e.target.files[0])} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows={3} />
            </div>
            <button type="submit" className="btn btn-primary">Add Product</button>
          </form>
          <h2>Existing Products</h2>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}><td>{p.name}</td><td>{p.category}</td><td>${parseFloat(p.price).toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
