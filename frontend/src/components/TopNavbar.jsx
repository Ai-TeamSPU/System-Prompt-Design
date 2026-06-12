import React from 'react';
import { Settings, User } from 'lucide-react';

const TopNavbar = ({ currentPage, setCurrentPage }) => {
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
        >
          🔥 Popular
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

      <div className="navbar-actions">

        <button className="btn-icon">
          <Settings size={20} />
        </button>
        <button className="btn-icon">
          <User size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;
