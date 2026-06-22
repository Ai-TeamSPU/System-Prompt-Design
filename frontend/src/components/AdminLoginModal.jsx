import React, { useState } from 'react';
import { User, X, AlertCircle } from 'lucide-react';

const AdminLoginModal = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use environment variable if available, fallback to hardcoded for local test if missing
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin1234';

    if (password === adminPass) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div
        className="modal-content glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '400px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          position: 'relative',
          animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--glass-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(0, 240, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            border: '1px solid rgba(0, 240, 255, 0.2)'
          }}>
            <User size={30} />
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Enter password to access admin mode
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Enter password..."
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: `1px solid ${error ? 'rgba(255, 50, 50, 0.5)' : 'var(--glass-border)'}`,
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: error ? '0 0 10px rgba(255, 50, 50, 0.2)' : 'none'
              }}
              autoFocus
            />
            {error && (
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#ff4444',
                display: 'flex',
                alignItems: 'center'
              }}>
                <AlertCircle size={20} />
              </div>
            )}
          </div>

          {error && (
            <p style={{ color: '#ff4444', fontSize: '0.85rem', margin: '-0.5rem 0 0 0', textAlign: 'center', animation: 'shake 0.4s' }}>
              Incorrect password
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '0.5rem'
            }}
          >
            Login
          </button>
        </form>

        <style>{`
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.9) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminLoginModal;
