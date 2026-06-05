import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', image: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    API.get('/pets/submissions').then((r) => setSubmissions(r.data)).catch(console.error);
    API.get('/products').then((r) => setProducts(r.data)).catch(console.error);
    API.get('/orders/all').then((r) => setOrders(r.data)).catch(console.error);
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

  const handleDeletePet = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    try {
      await API.delete(`/pets/${id}`);
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      setMsg('Submission deleted.');
    } catch (err) { console.error(err); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/products', newProduct);
      setProducts((prev) => [...prev, res.data]);
      setMsg('Product added successfully!');
      setNewProduct({ name: '', price: '', category: '', description: '', image: '' });
    } catch (err) { console.error(err); }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/products/${editProduct._id}`, editProduct);
      setProducts((prev) => prev.map((p) => p._id === editProduct._id ? res.data : p));
      setEditProduct(null);
      setMsg('Product updated successfully!');
    } catch (err) { console.error(err); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setMsg('Product deleted.');
    } catch (err) { console.error(err); }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await API.put(`/orders/${id}`, { status });
      setOrders((prev) => prev.map((o) => o._id === id ? res.data : o));
      setMsg(`Order status updated to "${status}"`);
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
        <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          Orders ({orders.length})
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
                  {s.image && <img src={s.image} alt={s.petName} className="submission-img" />}
                </div>
                <div className="submission-actions">
                  <span className={`status-badge ${s.status}`}>{s.status}</span>
                  {s.status === 'pending' && (
                    <>
                      <button className="btn btn-primary" onClick={() => handleApprove(s._id)}>Approve</button>
                      <button className="btn btn-danger" onClick={() => handleReject(s._id)}>Reject</button>
                    </>
                  )}
                  <button className="btn btn-danger" onClick={() => handleDeletePet(s._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="admin-section">
          <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form className="form-container" onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input value={editProduct ? editProduct.name : newProduct.name}
                  onChange={(e) => editProduct ? setEditProduct({ ...editProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" step="0.01"
                  value={editProduct ? editProduct.price : newProduct.price}
                  onChange={(e) => editProduct ? setEditProduct({ ...editProduct, price: e.target.value }) : setNewProduct({ ...newProduct, price: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input value={editProduct ? editProduct.category : newProduct.category}
                  onChange={(e) => editProduct ? setEditProduct({ ...editProduct, category: e.target.value }) : setNewProduct({ ...newProduct, category: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="url" placeholder="https://example.com/product.jpg"
                  value={editProduct ? editProduct.image : newProduct.image}
                  onChange={(e) => editProduct ? setEditProduct({ ...editProduct, image: e.target.value }) : setNewProduct({ ...newProduct, image: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={editProduct ? editProduct.description : newProduct.description}
                onChange={(e) => editProduct ? setEditProduct({ ...editProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value })} rows={3} />
            </div>
            <div className="product-actions">
              <button type="submit" className="btn btn-primary">{editProduct ? 'Update Product' : 'Add Product'}</button>
              {editProduct && <button type="button" className="btn btn-outline" onClick={() => setEditProduct(null)}>Cancel</button>}
            </div>
          </form>

          <h2>Existing Products</h2>
          <table className="admin-table">
            <thead>
              <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image || 'https://via.placeholder.com/55x45?text=N/A'} alt={p.name} /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{parseFloat(p.price).toFixed(2)}</td>
                  <td>
                    <div className="product-actions">
                      <button className="btn btn-outline" onClick={() => { setEditProduct(p); window.scrollTo(0, 0); }}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-section">
          <h2>All Orders</h2>
          {orders.length === 0 && <p>No orders yet.</p>}
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-id">Order: <span>#{order._id.slice(-8).toUpperCase()}</span></p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.2rem' }}><strong>Customer:</strong> {order.userName} · {order.userEmail}</p>
                  </div>
                  <div className="order-status-update">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      {['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <img src={item.image || 'https://via.placeholder.com/60x60?text=Item'} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <p className="order-item-meta">Qty: {item.qty} × ₹{item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="order-total">Total: <strong>₹{order.total?.toFixed(2)}</strong></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
