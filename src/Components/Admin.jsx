// src/components/Admin.jsx
import { useState, useEffect } from 'react';

function Admin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all contacts from the backend
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/contacts');
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.contacts);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a contact message
  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the deleted contact from the list
        setContacts(contacts.filter(contact => contact.id !== id));
        alert('Message deleted successfully!');
      } else {
        alert('Failed to delete message: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please check if the server is running.');
    }
  };

  // Load contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <section className="admin" id="admin">
        <h2>Admin Panel</h2>
        <p>Loading messages...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin" id="admin">
        <h2>Admin Panel</h2>
        <p className="error">{error}</p>
        <button onClick={fetchContacts} className="refresh-btn">
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section className="admin" id="admin">
      <h2>Admin Panel - Contact Messages</h2>
      
      <div className="admin-controls">
        <button onClick={fetchContacts} className="refresh-btn">
          🔄 Refresh Messages
        </button>
        <span className="message-count">
          Total Messages: {contacts.length}
        </span>
      </div>
      
      {contacts.length === 0 ? (
        <p>No messages yet. Messages will appear here when customers contact you.</p>
      ) : (
        <div className="messages-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.id}</td>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td className="message-cell">{contact.message}</td>
                  <td>{new Date(contact.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => deleteContact(contact.id)}
                      className="delete-btn"
                      title="Delete message"
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
    </section>
  );
}

export default Admin;