// src/components/Admin.jsx
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

    // Basic client-side validation
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
        // clear fields
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // keep message visible briefly then close modal
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
        <section className="hero admin-hero" style={{
          paddingTop: '80px',
          paddingBottom: '40px'
        }}>
          <div style={{
            maxWidth: '400px',
            width: '100%',
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            margin: '0 1rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                margin: '0 auto 1rem auto',
                width: '3rem',
                height: '3rem',
                backgroundColor: '#2563eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem'
              }}>
                🔑
              </div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Reset Admin Password
              </h1>
              <p style={{ color: '#6b7280' }}>Enter your admin username and new password.</p>
            </div>

            <form onSubmit={handleResetPassword} style={{ marginTop: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="resetUsername" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
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
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    placeholder="Enter your username"
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="resetPassword" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
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
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="resetConfirmPassword" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
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
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {resetMsg && (
                <p style={{ color: resetMsg.includes('successfully') ? '#16a34a' : '#dc2626', marginBottom: '1rem' }}>
                  {resetMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#2563eb',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                {resetLoading ? 'Resetting password...' : 'Reset Password'}
              </button>
            </form>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setResetMsg(''); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textDecoration: 'underline'
                }}
              >
                Back to login
              </button>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="hero admin-hero" style={{
        paddingTop: '80px',
        paddingBottom: '40px'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          margin: '0 1rem'
        }}>
          {/* Logo/Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              margin: '0 auto 1rem auto',
              width: '3rem',
              height: '3rem',
              backgroundColor: '#2563eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem'
            }}>
              👨‍🍳
            </div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Chef Srinivas's Kitchen
            </h1>
            <p style={{ color: '#6b7280' }}>Admin Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ marginTop: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="username" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
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
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="Enter your username"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <label htmlFor="password" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
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
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="Enter your password"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#eaedf3ff';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#2563eb',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Sign in to Admin Panel
              </button>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
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
            
            </form>
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
        paddingTop: '80px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '3rem',
            width: '3rem',
            border: '4px solid #2563eb',
            borderTopColor: 'transparent',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading Admin Panel...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '100px 1rem 2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Admin Dashboard
              </h1>
              <p style={{ color: '#6b7280' }}>Manage messages and orders</p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Messages</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{contacts.length}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Orders</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{orders.length}</p>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                🚪 Logout
              </button>
              <button
                onClick={() => setShowChangePwd(prev => !prev)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                🔒 Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Change password modal */}
        {showChangePwd && (
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 2000
          }} onClick={() => { setShowChangePwd(false); setChangePwdMsg(''); }}>
            <div role="dialog" aria-modal="true" aria-labelledby="change-pwd-title" style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              padding: '1.25rem',
              maxWidth: '420px',
              width: '100%'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 id="change-pwd-title" style={{ margin: 0, marginBottom: '0.5rem' }}>Change Password</h3>
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Old password</label>
                  <input type="password" placeholder="Old password" value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>New password</label>
                  <input type="password" placeholder="New password" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Confirm new password</label>
                  <input type="password" placeholder="Confirm new password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
                </div>
                {changePwdMsg && <div style={{ marginBottom: '0.5rem', color: '#dc2626' }}>{changePwdMsg}</div>}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => { setShowChangePwd(false); setChangePwdMsg(''); }} style={{ padding: '0.5rem 0.75rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={changingPwd} style={{ padding: '0.5rem 0.75rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
                    {changingPwd ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('messages')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...(activeTab === 'messages' 
                  ? { backgroundColor: '#2563eb', color: 'white' }
                  : { backgroundColor: '#e5e7eb', color: '#374151' }
                )
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'messages') {
                  e.target.style.backgroundColor = '#d1d5db';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'messages') {
                  e.target.style.backgroundColor = '#e5e7eb';
                }
              }}
            >
              📧 Messages ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...(activeTab === 'orders' 
                  ? { backgroundColor: '#059669', color: 'white' }
                  : { backgroundColor: '#e5e7eb', color: '#374151' }
                )
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'orders') {
                  e.target.style.backgroundColor = '#d1d5db';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'orders') {
                  e.target.style.backgroundColor = '#e5e7eb';
                }
              }}
            >
              📦 Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                Contact Messages
              </h2>
            </div>
            
            {contacts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  No Messages
                </h3>
                <p style={{ color: '#6b7280' }}>No contact messages yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Name
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Email
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Message
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Date
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Status
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: 'white' }}>
                    {contacts.map((contact) => (
                      <tr key={contact.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
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
                              marginRight: '0.75rem',
                              fontSize: '0.875rem'
                            }}>
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: '500', color: '#1f2937' }}>{contact.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{contact.email}</td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ maxWidth: '200px' }}>
                            <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: '1.25', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {contact.message}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(contact.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            ...(contact.status === 'read' 
                              ? { backgroundColor: '#d1fae5', color: '#065f46' }
                              : { backgroundColor: '#fef3c7', color: '#92400e' }
                            )
                          }}>
                            {contact.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <button
                            onClick={() => deleteContact(contact.id)}
                            style={{
                              backgroundColor: '#dc2626',
                              color: 'white',
                              padding: '0.5rem 0.75rem',
                              border: 'none',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                          >
                            Delete
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
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                Order Management
              </h2>
            </div>
            
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  No Orders
                </h3>
                <p style={{ color: '#6b7280' }}>No orders placed yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Order ID
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Customer
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Phone
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Dish
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Date
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Guests
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Status
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: 'white' }}>
                    {orders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', fontSize: '0.875rem', color: '#6b7280' }}>
                          #{order.id}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
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
                              marginRight: '0.75rem',
                              fontSize: '0.875rem'
                            }}>
                              {order.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500', color: '#1f2937' }}>{order.customer_name}</div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{order.customer_email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{order.customer_phone}</td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div>
                            <div style={{ fontWeight: '500', color: '#1f2937' }}>{order.dish_name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{order.dish_price}</div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#374151' }}>
                          {order.booking_date}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#1f2937' }}>
                          {order.number_of_guests}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            ...(order.status === 'confirmed' 
                              ? { backgroundColor: '#d1fae5', color: '#065f46' }
                              : order.status === 'cancelled'
                              ? { backgroundColor: '#fee2e2', color: '#991b1b' }
                              : { backgroundColor: '#fef3c7', color: '#92400e' }
                            )
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                  style={{
                                    backgroundColor: '#059669',
                                    color: 'white',
                                    padding: '0.5rem 0.75rem',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  style={{
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    padding: '0.5rem 0.75rem',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteOrder(order.id)}
                              style={{
                                backgroundColor: '#6b7280',
                                color: 'white',
                                padding: '0.5rem 0.75rem',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                            >
                              Delete
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










      