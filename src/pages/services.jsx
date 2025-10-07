import React, { useState, useEffect } from 'react';
import '../styles/services.css';
import Header from '../components/Header';

// SVG Icon Components
const ServiceIcon = ({ children }) => <div className="service-icon">{children}</div>;

const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16.5V15a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.5"/><path d="M20 10h-2.5a2.5 2.5 0 0 0-5 0H2.5a2.5 2.5 0 0 0-2.4 3.16L1.6 17.5a2.5 2.5 0 0 0 2.4 1.5h16a2.5 2.5 0 0 0 2.4-1.5l1.5-4.34A2.5 2.5 0 0 0 20 10z"/><line x1="12" y1="13" x2="12" y2="8"/><path d="M5 9V8a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1"/></svg>
);

const TaxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

function Services({ onNavigate, verificationData = {} }) {
  const { vehicleNumber = '', location = '', showTransactionSuccess = false } = verificationData;
  const displayInfo = vehicleNumber || location || 'your selection';
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(savedTransactions);
    
    // Show success message if redirected from payment
    if (showTransactionSuccess && savedTransactions.length > 0) {
      // Could add a toast/notification here
    }
  }, [showTransactionSuccess]);

  const services = [
    {
      id: 'tax',
      title: 'Pay Your Tax',
      description: 'Pay road tax for your vehicle online quickly and securely',
      features: [
        '✓ Quick payment process',
        '✓ Multiple payment options',
        '✓ Instant receipt generation',
        '✓ Transaction tracking'
      ],
      icon: TaxIcon,
      cardClass: 'tax-card',
      btnClass: 'tax-btn',
      btnText: 'Proceed to Pay Tax',
      keywords: ['tax', 'road tax', 'payment', 'pay', 'vehicle tax', 'online tax']
    },
    {
      id: 'duplicateRC',
      title: 'Apply for Duplicate RC',
      description: 'Get a duplicate registration certificate for your vehicle',
      features: [
        '✓ Easy application process',
        '✓ Home delivery available',
        '✓ Track application status',
        '✓ Secure payment gateway'
      ],
      icon: CarIcon,
      cardClass: 'rc-card',
      btnClass: 'rc-btn',
      btnText: 'Apply for Duplicate RC',
      keywords: ['rc', 'registration', 'certificate', 'duplicate', 'apply', 'registration certificate']
    }
  ];

  const filteredServices = services.filter(service => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      service.title.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search) ||
      service.keywords.some(keyword => keyword.includes(search))
    );
  });

  const handleServiceSelection = (service) => {
    if (service === 'tax') {
      onNavigate('tax', { vehicleNumber });
    } else if (service === 'duplicateRC') {
      onNavigate('duplicateRC', { vehicleNumber });
    }
  };

  const breadcrumbTrail = [
    { name: 'Home', path: 'home' },
    { name: 'Services', path: 'services' }
  ];

  return (
    <div className="vahan-container">
      {/* Header Section */}
      <Header onNavigate={onNavigate} currentPage="services" breadcrumbTrail={breadcrumbTrail} />

      {/* Main Content */}
      <main className="main-content">
        <section className="services-hero">
          <div className="services-container">
            <div className="services-header">
              <div className="header-top">
                <h1>Available Services</h1>
                
                {/* Transaction History Button */}
                {transactions.length > 0 && (
                  <button 
                    className="transaction-history-btn"
                    onClick={() => setShowHistory(!showHistory)}
                    title="View Transaction History"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v5h5"/>
                      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
                      <path d="M12 7v5l4 2"/>
                    </svg>
                    <span className="history-text">History</span>
                    <span className="history-badge">{transactions.length}</span>
                  </button>
                )}
              </div>
              
              {/* Search Bar */}
              <div className="search-container">
                <div className="search-wrapper">
                  <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search for services (e.g., tax, RC, registration...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="clear-search-btn"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <p className="verification-info">
                {vehicleNumber && (
                  <>
                    <span className="label">Vehicle:</span>
                    <span className="value">{vehicleNumber}</span>
                  </>
                )}
                {location && (
                  <>
                    <span className="label">Location:</span>
                    <span className="value">{location}</span>
                  </>
                )}
              </p>
            </div>

            {/* Transaction History Modal/Dropdown */}
            {showHistory && transactions.length > 0 && (
              <>
                <div 
                  className="history-overlay"
                  onClick={() => setShowHistory(false)}
                />
                <div className="transaction-history-modal">
                <div className="history-modal-header">
                  <h3>Transaction History</h3>
                  <button 
                    className="close-history-btn"
                    onClick={() => setShowHistory(false)}
                    aria-label="Close history"
                  >
                    ×
                  </button>
                </div>
                
                <div className="transaction-history-content">
                  <div className="transaction-table-wrapper">
                    <table className="transaction-table">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Transaction ID</th>
                          <th>Service</th>
                          <th>Vehicle Number</th>
                          <th>Amount</th>
                          <th>Payment Method</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn, index) => (
                          <tr key={txn.id || index}>
                            <td>{new Date(txn.date).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</td>
                            <td className="txn-id">{txn.id}</td>
                            <td>{txn.serviceType}</td>
                            <td className="vehicle-number">{txn.vehicleNumber}</td>
                            <td className="amount">₹{txn.amount}</td>
                            <td>{txn.paymentMethod}</td>
                            <td>
                              <span className={`status-badge status-${txn.status.toLowerCase()}`}>
                                {txn.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {transactions.length >= 20 && (
                    <p className="history-note">Showing last 20 transactions</p>
                  )}
                  
                  <button 
                    className="clear-history-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all transaction history?')) {
                        localStorage.removeItem('transactions');
                        setTransactions([]);
                        setShowHistory(false);
                      }
                    }}
                  >
                    Clear History
                  </button>
                </div>
              </div>
              </>
            )}

            <div className="services-grid">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => {
                  const IconComponent = service.icon;
                  return (
                    <div 
                      key={service.id}
                      className={`service-card ${service.cardClass}`}
                      onClick={() => handleServiceSelection(service.id)}
                    >
                      <div className="card-icon">
                        <ServiceIcon><IconComponent /></ServiceIcon>
                      </div>
                      <div className="card-content">
                        <h2>{service.title}</h2>
                        <p>{service.description}</p>
                        <ul className="service-features">
                          {service.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <button className={`service-btn ${service.btnClass}`}>
                        {service.btnText}
                        <span className="arrow">→</span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="no-results">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <h3>No services found</h3>
                  <p>Try searching with different keywords like "tax" or "RC"</p>
                  <button 
                    className="clear-filters-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>

            <div className="back-section">
              <button 
                className="back-to-home-btn"
                onClick={() => onNavigate('home')}
              >
                ← Back to Home
              </button>
            </div>

            <div className="info-box">
              <h3>Important Information</h3>
              <ul>
                <li>Ensure all vehicle documents are up to date</li>
                <li>Keep your vehicle registration details handy</li>
                <li>Payment can be made through multiple secure gateways</li>
                <li>You will receive instant confirmation upon successful payment</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Ministry of Road Transport & Highways, Government of India. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#terms">Terms of Use</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Services;
