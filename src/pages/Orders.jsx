import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const STATUS_STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justOrdered = searchParams.get('success') === '1';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    API.get('/orders/my')
      .then((r) => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="page center-content"><p>Loading orders...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>Track your order status</p>
      </div>

      {justOrdered && (
        <div className="success-banner">
          🎉 Order placed successfully! Track your status below.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="center-content" style={{ minHeight: '40vh' }}>
          <div className="auth-prompt">
            <h2>No orders yet</h2>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>Shop Now</button>
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const stepIndex = STATUS_STEPS.indexOf(order.status);
            const isCancelled = order.status === 'Cancelled';
            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-id">Order: <span>#{order._id.slice(-8).toUpperCase()}</span></p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`status-badge ${isCancelled ? 'rejected' : 'approved'}`}>{order.status}</span>
                </div>

                {!isCancelled && (
                  <div className="order-tracker">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className={`tracker-step ${i <= stepIndex ? 'done' : ''}`}>
                        <div className="tracker-dot" />
                        <p>{step}</p>
                        {i < STATUS_STEPS.length - 1 && <div className={`tracker-line ${i < stepIndex ? 'done' : ''}`} />}
                      </div>
                    ))}
                  </div>
                )}

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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
