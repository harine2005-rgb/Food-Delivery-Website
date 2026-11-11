import { useState, useEffect } from 'react';
import './Admin.css';

const statuses = [
  'Order Placed',
  'Order Confirmed',
  'Preparing Food',
  'Out for Delivery',
  'Delivered'
];

function Admin({ theme, toggleTheme }) {
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('foodieOrders')
      );

      return Array.isArray(savedOrders) ? savedOrders : [];
    } catch {
      return [];
    }
  });

  // Load and sync orders
  useEffect(() => {
    const syncOrders = () => {
      try {
        const savedOrders = JSON.parse(
          localStorage.getItem('foodieOrders')
        );

        setOrders(Array.isArray(savedOrders) ? savedOrders : []);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    window.addEventListener('storage', syncOrders);
    window.addEventListener('foodieOrdersUpdated', syncOrders);

    return () => {
      window.removeEventListener('storage', syncOrders);
      window.removeEventListener('foodieOrdersUpdated', syncOrders);
    };
  }, []);

  // Update order status
  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      'foodieOrders',
      JSON.stringify(updatedOrders)
    );

    window.dispatchEvent(
      new Event('foodieOrdersUpdated')
    );
  };

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) => order.status === 'Delivered'
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status !== 'Delivered'
  ).length;

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  return (
    <div className="admin-dashboard">

      <header className="admin-header">
        <h1>Foodie Admin Dashboard 🍔</h1>
        <a href="/">← Back to Website</a>
      </header>

      {/* Dashboard Statistics */}
      <section className="admin-stats">

        <div className="admin-stat-card">
          <h3>Total Orders</h3>
          <h2>{totalOrders}</h2>
        </div>

        <div className="admin-stat-card">
          <h3>Pending Orders</h3>
          <h2>{pendingOrders}</h2>
        </div>

        <div className="admin-stat-card">
          <h3>Delivered Orders</h3>
          <h2>{deliveredOrders}</h2>
        </div>

        <div className="admin-stat-card">
          <h3>Total Revenue</h3>
          <h2>₹{totalRevenue.toFixed(2)}</h2>
        </div>

      </section>

      {/* Orders */}
      <section className="admin-orders">

        <h2>Customer Orders 📦</h2>

        {orders.length === 0 ? (

          <p className="no-orders">
            No orders available yet.
          </p>

        ) : (

          orders.map((order) => (

            <div className="admin-order-card" key={order.id}>

              <h3>Order #{order.id}</h3>

              <p>
                <strong>Customer:</strong>{' '}
                {order.customerName || 'Not available'}
              </p>

              <p>
                <strong>Email:</strong>{' '}
                {order.customerEmail || 'Not available'}
              </p>

              <p>
                <strong>Address:</strong>{' '}
                {order.customerAddress || 'Not available'}
              </p>

              <p>
                <strong>Date:</strong> {order.date}
              </p>

              <h4>Ordered Items</h4>

              {Array.isArray(order.items) && order.items.map((item) => (

                <p key={item.id}>
                  {item.emoji} {item.name} × {item.quantity}
                  {' '} — ₹{item.price * item.quantity}
                </p>

              ))}

              <h3>
                Total: ₹{Number(order.total || 0).toFixed(2)}
              </h3>

              <p>
                <strong>Order Status:</strong> {order.status}
              </p>

              <label htmlFor={`status-${order.id}`}>
                Update Order Status:
              </label>

              <select
                id={`status-${order.id}`}
                value={statuses.includes(order.status)
                  ? order.status
                  : 'Order Placed'}
                onChange={(event) =>
                  updateStatus(order.id, event.target.value)
                }
              >

                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}

              </select>

            </div>

          ))

        )}

      </section>

    </div>
  );
}

export default Admin;