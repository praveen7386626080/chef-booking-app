// src/Components/Admin.jsx - RESPONSIVE & TOUCH-FRIENDLY ADMIN DASHBOARD
import { useState, useEffect } from 'react';

function Admin() {
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('messages');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [changePwdMsg, setChangePwdMsg] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check-auth', { credentials: 'include' });
      if (!response.ok) {
        console.warn('check-auth returned non-OK status', response.status);
        return;
      }
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert('Login failed: ' + (err.message || response.statusText));
        return;
      }
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadData();
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg('');

    if (!resetUsername || !resetPassword || !resetConfirmPassword) {
      setResetMsg('Please fill in all reset fields.');
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      setResetMsg('New password and confirmation do not match.');
      return;
    }
    setResetLoading(true);

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: resetUsername, newPassword: resetPassword, confirmPassword: resetConfirmPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setResetMsg('Password reset successfully. Please log in with your new password.');
        setShowForgotPassword(false);
        setLoginData({ username: resetUsername, password: '' });
        setResetUsername('');
        setResetPassword('');
        setResetConfirmPassword('');
      } else {
        setResetMsg(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setResetMsg('Password reset failed. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      setContacts([]);
      setOrders([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Change password (admin)
  const handleChangePassword = async (e) => {
    e?.preventDefault?.();
    setChangePwdMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setChangePwdMsg('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePwdMsg('New password and confirm do not match');
      return;
    }
    if (newPassword.length < 8) {
      setChangePwdMsg('New password must be at least 8 characters');
      return;
    }

    setChangingPwd(true);
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setChangePwdMsg(err.message || 'Failed to change password');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setChangePwdMsg('Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowChangePwd(false);
          setChangePwdMsg('');
        }, 1200);
      } else {
        setChangePwdMsg(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setChangePwdMsg('Server error');
    } finally {
      setChangingPwd(false);
    }
  };

  // Fetch contacts from backend
  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts', { credentials: 'include' });
      if (!response.ok) {
        console.error('Failed to fetch contacts, status:', response.status);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts || []);
      } else {
        console.error('Failed to fetch contacts:', data.message || 'unknown');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', { credentials: 'include' });
      if (!response.ok) {
        console.error('Failed to fetch orders, status:', response.status);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders:', data.message || 'unknown');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Load both contacts and orders
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchContacts(), fetchOrders()]);
    } finally {
      setLoading(false);
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('Failed to delete contact:', err.message || response.statusText);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setContacts(prev => prev.filter(contact => contact.id !== id));
        alert('Message deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('Failed to update order status:', err.message || response.statusText);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('Order status updated!');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('Failed to delete order:', err.message || response.statusText);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        alert('Order deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Login Form
  if (!isAuthenticated) {
    if (showForgotPassword) {
      return (
        <section className="hero" style={{ minHeight: '100vh', padding: '100px 1rem 40px' }}>
          <div style={{
            maxWidth: '420px',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: 'clamp(1.5rem, 5vw, 2.25rem)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                margin: '0 auto 0.75rem',
                width: '3.25rem',
                height: '3.25rem',
                backgroundColor: '#2563eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                🔑
              </div>
              <h1 style={{
                fontSize: 'clamp(1.35rem, 4vw, 1.75rem)',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.35rem'
              }}>
                Reset Admin Password
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Enter your admin username and new password.</p>
            </div>

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="resetUsername" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>
                  Username
                </label>
                <input
                  id="resetUsername"
                  name="resetUsername"
                  type="text"
                  required
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '16px',
                    color: '#1f2937',
                    outline: 'none'
                  }}
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="resetPassword" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>
                  New Password
                </label>
                <input
                  id="resetPassword"
                  name="resetPassword"
                  type="password"
                  required
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '16px',
                    color: '#1f2937',
                    outline: 'none'
                  }}
                  placeholder="Enter new password (min 8 chars)"
                />
              </div>

              <div>
                <label htmlFor="resetConfirmPassword" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>
                  Confirm Password
                </label>
                <input
                  id="resetConfirmPassword"
                  name="resetConfirmPassword"
                  type="password"
                  required
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '16px',
                    color: '#1f2937',
                    outline: 'none'
                  }}
                  placeholder="Confirm new password"
                />
              </div>

              {resetMsg && (
                <p style={{ color: resetMsg.includes('successfully') ? '#16a34a' : '#dc2626', fontSize: '0.85rem', margin: 0 }}>
                  {resetMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: '#2563eb',
                  cursor: 'pointer',
                  minHeight: '46px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}
              >
                {resetLoading ? 'Resetting password...' : 'Reset Password'}
              </button>
            </form>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setResetMsg(''); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textDecoration: 'underline'
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="hero" style={{ minHeight: '100vh', padding: '100px 1rem 40px' }}>
        <div style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: '#ffffff',
          padding: 'clamp(1.5rem, 5vw, 2.25rem)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          margin: '0 auto'
        }}>
          {/* Logo/Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              margin: '0 auto 0.75rem',
              width: '3.25rem',
              height: '3.25rem',
              backgroundColor: '#2563eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem'
            }}>
              👨‍🍳
            </div>
            <h1 style={{
              fontSize: 'clamp(1.35rem, 4vw, 1.75rem)',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.25rem'
            }}>
              Chef Srinivas's Kitchen
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Admin Secure Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="username" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '16px',
                  color: '#1f2937',
                  outline: 'none'
                }}
                placeholder="Enter admin username"
              />
            </div>
            
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '16px',
                  color: '#1f2937',
                  outline: 'none'
                }}
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                backgroundColor: '#2563eb',
                cursor: 'pointer',
                minHeight: '46px',
                marginTop: '0.5rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              Sign in to Dashboard
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563eb',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textDecoration: 'underline'
              }}
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 1rem 40px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            borderRadius: '50%',
            height: '3rem',
            width: '3rem',
            border: '4px solid #2563eb',
            borderTopColor: 'transparent',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontWeight: '500' }}>Loading Admin Panel...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Dashboard Header Card */}
        <div className="admin-header-card">
          <div className="admin-header-row">
            <div>
              <h1 style={{
                fontSize: 'clamp(1.4rem, 4vw, 1.875rem)',
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>
                Admin Dashboard
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Manage incoming customer inquiries & bookings</p>
            </div>

            {/* Stats and Controls */}
            <div className="admin-stats-group">
              <div className="admin-stat-item">
                <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Messages</p>
                <p style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2563eb', margin: 0 }}>{contacts.length}</p>
              </div>

              <div className="admin-stat-item">
                <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Orders</p>
                <p style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669', margin: 0 }}>{orders.length}</p>
              </div>

              <button
                onClick={() => setShowChangePwd(prev => !prev)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.6rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                🔒 Change Pwd
              </button>

              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '0.6rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePwd && (
          <div 
            className="modal-overlay" 
            onClick={() => { setShowChangePwd(false); setChangePwdMsg(''); }}
          >
            <div 
              className="modal-content"
              style={{ maxWidth: '420px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937' }}>Change Password</h3>
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: '600' }}>Old Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter current password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '16px' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: '600' }}>New Password</label>
                  <input 
                    type="password" 
                    placeholder="New password (min 8 chars)" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '16px' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: '600' }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="Confirm new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '16px' }} 
                  />
                </div>

                {changePwdMsg && (
                  <div style={{ color: changePwdMsg.includes('successfully') ? '#16a34a' : '#dc2626', fontSize: '0.85rem' }}>
                    {changePwdMsg}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => { setShowChangePwd(false); setChangePwdMsg(''); }} 
                    style={{ padding: '0.6rem 1rem', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={changingPwd} 
                    style={{ padding: '0.6rem 1.25rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {changingPwd ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab Navigation Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          padding: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          <div className="admin-tabs-bar">
            <button
              onClick={() => setActiveTab('messages')}
              className="admin-tab-btn"
              style={{
                backgroundColor: activeTab === 'messages' ? '#2563eb' : '#f1f5f9',
                color: activeTab === 'messages' ? '#ffffff' : '#334155'
              }}
            >
              📧 Messages ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className="admin-tab-btn"
              style={{
                backgroundColor: activeTab === 'orders' ? '#059669' : '#f1f5f9',
                color: activeTab === 'orders' ? '#ffffff' : '#334155'
              }}
            >
              📦 Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="admin-table-container">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Customer Messages ({contacts.length})
              </h2>
            </div>
            
            {contacts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📧</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151', margin: '0 0 0.25rem 0' }}>
                  No Messages Yet
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Customer inquiries will appear here.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Customer</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Email</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', minWidth: '220px' }}>Message</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Date</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Status</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                              width: '2rem',
                              height: '2rem',
                              backgroundColor: '#3b82f6',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              marginRight: '0.65rem',
                              fontSize: '0.8rem'
                            }}>
                              {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <span style={{ fontWeight: '600', color: '#1f2937' }}>{contact.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontSize: '0.875rem' }}>{contact.email}</td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <p style={{ color: '#334155', fontSize: '0.875rem', lineHeight: '1.4', margin: 0 }}>
                            {contact.message}
                          </p>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: contact.status === 'read' ? '#dcfce7' : '#fef3c7',
                            color: contact.status === 'read' ? '#166534' : '#92400e'
                          }}>
                            {contact.status || 'new'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => deleteContact(contact.id)}
                            style={{
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              padding: '0.4rem 0.75rem',
                              border: '1px solid #fecaca',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="admin-table-container">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Orders & Bookings ({orders.length})
              </h2>
            </div>
            
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151', margin: '0 0 0.25rem 0' }}>
                  No Orders Placed
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Customer bookings will appear here.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Order ID</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Customer</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Phone</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Dish</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Date</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Guests</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Status</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                          #{order.id}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                              width: '2rem',
                              height: '2rem',
                              backgroundColor: '#059669',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              marginRight: '0.65rem',
                              fontSize: '0.8rem'
                            }}>
                              {order.customer_name ? order.customer_name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', color: '#1f2937' }}>{order.customer_name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.customer_email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                          <a href={`tel:${order.customer_phone}`} style={{ color: '#2563eb', fontWeight: '600', fontSize: '0.875rem' }}>
                            {order.customer_phone}
                          </a>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap' }}>{order.dish_name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.dish_price}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: '#334155', whiteSpace: 'nowrap' }}>
                          {order.booking_date}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: '700', color: '#1f2937', whiteSpace: 'nowrap' }}>
                          {order.number_of_guests}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: order.status === 'confirmed' ? '#dcfce7' : order.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                            color: order.status === 'confirmed' ? '#166534' : order.status === 'cancelled' ? '#991b1b' : '#92400e'
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                  style={{
                                    backgroundColor: '#059669',
                                    color: 'white',
                                    padding: '0.35rem 0.6rem',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✓ Confirm
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  style={{
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626',
                                    padding: '0.35rem 0.6rem',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ✕ Cancel
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteOrder(order.id)}
                              style={{
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                padding: '0.35rem 0.6rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;