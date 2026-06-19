import React, { useState } from 'react';
import { Settings, User, LogOut, Sun, Moon } from 'lucide-react';

const TopNavbar = ({ currentPage, setCurrentPage, isAdmin, setIsAdmin, onOpenAdminModal, theme, setTheme }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  return (
    <div className="top-navbar">
      <div className="navbar-logo">
        <div className="logo-icon">AI</div>
        <span>SYSTEM PROMPT DESIGN</span>
      </div>

      <nav className="navbar-nav">
        <a 
          className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          Home
        </a>
        <a 
          className={`nav-link ${currentPage === 'usecases' ? 'active' : ''}`}
          onClick={() => setCurrentPage('usecases')}
        >
          Usecase
        </a>
        <a 
          className={`nav-link ${currentPage === 'popular' ? 'active' : ''}`}
          onClick={() => setCurrentPage('popular')}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-fire" viewBox="0 0 16 16">
            <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
          </svg>
          Popular
        </a>
        <a 
          className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentPage('history')}
        >
          History
        </a>
        <a 
          className={`nav-link ${currentPage === 'docs' ? 'active' : ''}`}
          onClick={() => setCurrentPage('docs')}
        >
          Docs
        </a>
      </nav>

      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn-icon"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ 
              color: 'var(--accent-color)', 
              fontSize: '0.85rem', 
              background: 'rgba(0,240,255,0.1)',
              padding: '4px 8px',
              borderRadius: '12px',
              border: '1px solid var(--accent-color)'
            }}>
              Admin Mode
            </span>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowLogoutConfirm(true)}
              style={{ 
                padding: '0.4rem 0.8rem', 
                fontSize: '0.85rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                borderColor: 'rgba(255, 50, 50, 0.3)',
                color: '#ff4444'
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <button className="btn-icon" onClick={onOpenAdminModal} title="Admin Login">
            <User size={20} />
          </button>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowLogoutConfirm(false)} 
          style={{ 
            zIndex: 3000, 
            backdropFilter: 'blur(8px)',
            background: 'rgba(0, 0, 0, 0.6)'
          }}
        >
          <div 
            className="modal-content glass-panel" 
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '380px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              animation: 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              borderTop: '4px solid #ff4444',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255, 68, 68, 0.1)'
            }}
          >
            <div style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: 'rgba(255, 68, 68, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              border: '2px solid rgba(255, 68, 68, 0.3)',
              animation: 'pulseGlow 2s infinite',
              position: 'relative'
            }}>
              <LogOut size={34} color="#ff4444" style={{ animation: 'shakeIcon 3s infinite ease-in-out' }} />
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', fontWeight: 700, color: '#fff' }}>
              ออกจากระบบ
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6', fontSize: '1rem' }}>
              คุณต้องการออกจากโหมด Admin <br/>ใช่หรือไม่?
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ 
                  flex: 1, 
                  padding: '0.8rem',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  fontWeight: 600
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => setShowLogoutConfirm(false)}
              >
                ยกเลิก
              </button>
              <button 
                className="action-btn" 
                style={{ 
                  flex: 1, 
                  padding: '0.8rem', 
                  background: 'linear-gradient(135deg, #ff4444, #cc0000)', 
                  color: 'white', 
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(255, 68, 68, 0.4)',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 68, 68, 0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 68, 68, 0.4)';
                }}
                onClick={() => {
                  setIsAdmin(false);
                  localStorage.removeItem('isAdmin');
                  setShowLogoutConfirm(false);
                }}
              >
                ยืนยัน
              </button>
            </div>
            
            <style>{`
              @keyframes bounceIn {
                0% { opacity: 0; transform: scale(0.3); }
                50% { opacity: 1; transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); }
              }
              @keyframes pulseGlow {
                0% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.4); }
                70% { box-shadow: 0 0 0 15px rgba(255, 68, 68, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
              }
              @keyframes shakeIcon {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-10deg); }
                50% { transform: rotate(10deg); }
                75% { transform: rotate(-5deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavbar;
