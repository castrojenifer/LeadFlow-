import React, { useEffect } from 'react';
import { Sun, Moon, Users } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  
  // Load and apply theme from Local Storage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <nav className="navbar-panel glass-panel" style={{ borderRadius: '0 0 var(--border-radius) var(--border-radius)' }}>
      <div className="navbar-brand">
        <div className="navbar-brand-icon">
          <Users size={18} />
        </div>
        <span>LeadFlow <span style={{ fontWeight: '300', fontSize: '0.9rem' }}>CRM</span></span>
      </div>

      <div className="navbar-actions">
        {/* Dark/Light Toggler */}
        <button 
          className="btn-icon" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Theme toggle"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
