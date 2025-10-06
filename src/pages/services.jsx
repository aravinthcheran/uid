import React from 'react';
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
  const { vehicleNumber = '', location = '' } = verificationData;
  const displayInfo = vehicleNumber || location || 'your selection';

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
              <h1>Available Services</h1>
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

            <div className="services-grid">
              <div 
                className="service-card tax-card"
                onClick={() => handleServiceSelection('tax')}
              >
                <div className="card-icon">
                  <ServiceIcon><TaxIcon /></ServiceIcon>
                </div>
                <div className="card-content">
                  <h2>Pay Your Tax</h2>
                  <p>Pay road tax for your vehicle online quickly and securely</p>
                  <ul className="service-features">
                    <li>✓ Quick payment process</li>
                    <li>✓ Multiple payment options</li>
                    <li>✓ Instant receipt generation</li>
                    <li>✓ Transaction tracking</li>
                  </ul>
                </div>
                <button className="service-btn tax-btn">
                  Proceed to Pay Tax
                  <span className="arrow">→</span>
                </button>
              </div>

              <div 
                className="service-card rc-card"
                onClick={() => handleServiceSelection('duplicateRC')}
              >
                <div className="card-icon">
                  <ServiceIcon><CarIcon /></ServiceIcon>
                </div>
                <div className="card-content">
                  <h2>Apply for Duplicate RC</h2>
                  <p>Get a duplicate registration certificate for your vehicle</p>
                  <ul className="service-features">
                    <li>✓ Easy application process</li>
                    <li>✓ Home delivery available</li>
                    <li>✓ Track application status</li>
                    <li>✓ Secure payment gateway</li>
                  </ul>
                </div>
                <button className="service-btn rc-btn">
                  Apply for Duplicate RC
                  <span className="arrow">→</span>
                </button>
              </div>
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
