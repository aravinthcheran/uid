import React, { useState, useEffect, useRef } from 'react';
import '../styles/header.css';

const Header = ({ onNavigate, currentPage = 'home', breadcrumbTrail = [] }) => {
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [authState, setAuthState] = useState('idle'); // idle, authenticating, success, error
  const [recentActions, setRecentActions] = useState([]);
  const [notification, setNotification] = useState('');
  
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Alt + H for home
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        if (onNavigate && currentPage !== 'home') {
          onNavigate('home');
          showNotification('Navigated to Home (Alt+H)');
        }
      }
      // Alt + T for transaction
      if (event.altKey && event.key === 't') {
        event.preventDefault();
        if (onNavigate) {
          onNavigate('transaction');
          showNotification('Navigated to Transaction Status (Alt+T)');
        }
      }
      // Escape to close menus
      if (event.key === 'Escape') {
        setShowAdminDropdown(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNavigate, currentPage]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const addToRecentActions = (action) => {
    setRecentActions(prev => {
      const updated = [action, ...prev.filter(item => item !== action)].slice(0, 3);
      return updated;
    });
  };

  const handleAdminLogin = (loginType) => {
    setShowAdminDropdown(false);
    setAuthState('authenticating');
    addToRecentActions(loginType);
    
    // Simulate authentication process
    setTimeout(() => {
      // Simulate random success/failure for demo
      const success = Math.random() > 0.3;
      if (success) {
        setAuthState('success');
        showNotification(`Successfully initiated ${loginType}`);
        setTimeout(() => setAuthState('idle'), 2000);
      } else {
        setAuthState('error');
        showNotification(`Failed to connect to ${loginType}. Please try again.`);
        setTimeout(() => setAuthState('idle'), 3000);
      }
    }, 1500);
  };

  const handleNavClick = (navItem) => {
    setShowMobileMenu(false);
    addToRecentActions(navItem);
    showNotification(`Opening ${navItem}...`);
    // Here you would typically handle navigation to these pages
    console.log(`Navigating to ${navItem}...`);
  };

  const handleMobileNavClick = (action, value) => {
    setShowMobileMenu(false);
    if (action === 'navigate' && onNavigate) {
      onNavigate(value);
      showNotification(`Navigated to ${value.charAt(0).toUpperCase() + value.slice(1)}`);
    } else if (action === 'admin') {
      handleAdminLogin(value);
    } else if (action === 'nav') {
      handleNavClick(value);
    }
  };

  const getBreadcrumbs = () => {
    // If breadcrumbTrail is provided, use it, otherwise use simple default
    if (breadcrumbTrail && breadcrumbTrail.length > 0) {
      return breadcrumbTrail;
    }
    
    // Default fallback
    const breadcrumbs = [{ name: 'Home', path: 'home' }];
    if (currentPage !== 'home') {
      const pageNames = {
        'transaction': 'Transaction Status',
        'tax': 'Pay Tax',
        'duplicateRC': 'Duplicate RC',
        'payment': 'Payment',
        'services': 'Services'
      };
      breadcrumbs.push({ 
        name: pageNames[currentPage] || currentPage,
        path: currentPage 
      });
    }
    return breadcrumbs;
  };

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Notification banner */}
      {notification && (
        <div className="notification-banner" role="alert" aria-live="polite">
          {notification}
          <button 
            onClick={() => setNotification('')}
            aria-label="Dismiss notification"
            className="notification-close"
          >
            ×
          </button>
        </div>
      )}

      <header className="header" role="banner">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            {getBreadcrumbs().map((crumb, index) => (
              <li key={crumb.path} className="breadcrumb-item">
                {index === getBreadcrumbs().length - 1 ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <button 
                    type="button"
                    className="breadcrumb-link"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(crumb.path);
                      }
                    }}
                  >
                    {crumb.name}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="header-top">
          <div className="gov-info">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Emblem of India" 
              className="emblem-img"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/ffffff/000000?text=Emblem'; }}
            />
            <div className="gov-text">
              <span>Ministry of Road Transport & Highways</span>
              <p>Government of India</p>
            </div>
          </div>
          <div className="header-right">
            {/* Desktop Navigation */}
            <div className="desktop-navigation">
              
              {/* Desktop Navigation Links */}
              <div className="nav-links desktop-nav">
                <button onClick={() => handleNavClick('FAQ')} className="nav-link">FAQ</button>
                <button onClick={() => handleNavClick('Help')} className="nav-link">Help</button>
                <button onClick={() => handleNavClick('Contact Us')} className="nav-link">Contact Us</button>
              </div>

              <div className="admin-dropdown-container" ref={dropdownRef}>
                <button 
                  className={`admin-btn ${authState === 'authenticating' ? 'authenticating' : ''} ${authState === 'error' ? 'auth-error' : ''}`}
                  onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                  aria-label="Administrative Users"
                  aria-expanded={showAdminDropdown}
                  aria-haspopup="true"
                >
                  Administrative Users ▼
                </button>
                {showAdminDropdown && (
                  <div className="admin-dropdown" role="menu">
                    <button 
                      className={`admin-dropdown-item ${recentActions.includes('Appointment Login') ? 'recent' : ''}`}
                      onClick={() => handleAdminLogin('Appointment Login')}
                      role="menuitem"
                    >
                      Appointment Login
                    </button>
                    <button 
                      className={`admin-dropdown-item ${recentActions.includes('HelpDesk Login') ? 'recent' : ''}`}
                      onClick={() => handleAdminLogin('HelpDesk Login')}
                      role="menuitem"
                    >
                      HelpDesk Login
                    </button>
                    <button 
                      className={`admin-dropdown-item requires-confirmation ${recentActions.includes('RTO Login for configuration') ? 'recent' : ''}`}
                      onClick={() => handleAdminLogin('RTO Login for configuration')}
                      role="menuitem"
                    >
                      RTO Login for configuration
                    </button>
                    {authState === 'error' && (
                      <button 
                        className="admin-dropdown-item cancel-action"
                        onClick={() => {
                          setAuthState('idle');
                          setShowAdminDropdown(false);
                          showNotification('Authentication cancelled');
                        }}
                        role="menuitem"
                      >
                        Cancel & Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="mobile-navigation" ref={mobileMenuRef}>
              <button 
                className="mobile-menu-btn"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-label="Mobile Menu"
                aria-expanded={showMobileMenu}
                aria-haspopup="true"
              >
                <div className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
              {showMobileMenu && (
                <div className="mobile-menu-dropdown" role="menu">
                  {onNavigate && currentPage !== 'home' && (
                    <button 
                      className={`mobile-menu-item ${currentPage === 'home' ? 'current-page' : ''}`}
                      onClick={() => handleMobileNavClick('navigate', 'home')}
                      role="menuitem"
                    >
                      ← Home
                    </button>
                  )}
                  <button 
                    className={`mobile-menu-item ${recentActions.includes('FAQ') ? 'recent-access' : ''}`}
                    onClick={() => handleMobileNavClick('nav', 'FAQ')}
                    role="menuitem"
                  >
                    FAQ
                  </button>
                  <button 
                    className={`mobile-menu-item ${recentActions.includes('Help') ? 'recent-access' : ''}`}
                    onClick={() => handleMobileNavClick('nav', 'Help')}
                    role="menuitem"
                  >
                    Help
                  </button>
                  <button 
                    className={`mobile-menu-item external-link ${recentActions.includes('Contact Us') ? 'recent-access' : ''}`}
                    onClick={() => handleMobileNavClick('nav', 'Contact Us')}
                    role="menuitem"
                  >
                    Contact Us
                  </button>
                  <div className="mobile-menu-separator">Administrative</div>
                  <button 
                    className={`mobile-menu-item admin-item ${recentActions.includes('Appointment Login') ? 'recent-access' : ''}`}
                    onClick={() => handleMobileNavClick('admin', 'Appointment Login')}
                    role="menuitem"
                  >
                    Appointment Login
                  </button>
                  <button 
                    className={`mobile-menu-item admin-item ${recentActions.includes('HelpDesk Login') ? 'recent-access' : ''}`}
                    onClick={() => handleMobileNavClick('admin', 'HelpDesk Login')}
                    role="menuitem"
                  >
                    HelpDesk Login
                  </button>
                  <button 
                    className={`mobile-menu-item admin-item ${recentActions.includes('RTO Login for configuration') ? 'recent-access' : ''}`}
                    onClick={() => handleMobileNavClick('admin', 'RTO Login for configuration')}
                    role="menuitem"
                  >
                    RTO Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="header-bottom">
          <h1 className="main-title">VAHAN CITIZEN SERVICES</h1>
        </div>
      </header>
    </>
  );
};

export default Header;
