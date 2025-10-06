import { useState } from 'react';
import '../styles/home.css';
import Header from '../components/Header';

// SVG Icon Components for a more professional look than emojis
const ServiceIcon = ({ children }) => <div className="service-icon">{children}</div>;

const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16.5V15a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1.5"/><path d="M20 10h-2.5a2.5 2.5 0 0 0-5 0H2.5a2.5 2.5 0 0 0-2.4 3.16L1.6 17.5a2.5 2.5 0 0 0 2.4 1.5h16a2.5 2.5 0 0 0 2.4-1.5l1.5-4.34A2.5 2.5 0 0 0 20 10z"/><line x1="12" y1="13" x2="12" y2="8"/><path d="M5 9V8a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1"/></svg>
);
const PermitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);
const FitnessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);
const TaxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const PuccIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 14.5A2.5 2.5 0 0 1 0 12v-2.5A2.5 2.5 0 0 1 2.5 7h.5A2.5 2.5 0 0 1 5.5 9.5v5A2.5 2.5 0 0 1 3 17h-.5A2.5 2.5 0 0 1 0 14.5z"/><path d="M21.5 14.5A2.5 2.5 0 0 0 24 12v-2.5A2.5 2.5 0 0 0 21.5 7h-.5A2.5 2.5 0 0 0 18.5 9.5v5A2.5 2.5 0 0 0 21 17h.5a2.5 2.5 0 0 0 2.5-2.5z"/><path d="M16 12c0-3.31-1.79-6-4-6s-4 2.69-4 6 1.79 6 4 6 4-2.69 4-6z"/></svg>
);
const FancyNumberIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 17.75 6.17 3.73-1.64-7.03L22 10.25h-7.25L12 3 9.25 10.25H2L7.47 14.45l-1.64 7.03z"/></svg>
);
const KnowVehicleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const OtherServicesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
);

// Modal Component for alerts
const Modal = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Notification</h4>
        <p>{message}</p>
        <button onClick={onClose} className="modal-close-btn">Close</button>
      </div>
    </div>
  );
};


function App({ onNavigate }) {
  const [searchMode, setSearchMode] = useState('vehicle'); // 'vehicle' or 'location'
  const [selectedState, setSelectedState] = useState('');
  const [selectedRTO, setSelectedRTO] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
    'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Lakshadweep', 'Puducherry'
  ];

  const rtoOffices = {
    'Maharashtra': ['MH01 - Mumbai Central', 'MH02 - Mumbai West', 'MH03 - Mumbai East', 'MH04 - Mumbai North', 'MH05 - Thane', 'MH09 - Aurangabad', 'MH12 - Pune', 'MH14 - Pimpri Chinchwad', 'MH20 - Nashik'],
    'Delhi': ['DL01 - Central Delhi', 'DL02 - West Delhi', 'DL03 - East Delhi', 'DL04 - North Delhi', 'DL05 - South Delhi', 'DL06 - North West Delhi', 'DL07 - South West Delhi', 'DL08 - New Delhi'],
    'Karnataka': ['KA01 - Bangalore Central', 'KA02 - Bangalore North', 'KA03 - Bangalore South', 'KA04 - Bangalore East', 'KA05 - Bangalore West', 'KA09 - Mysore', 'KA10 - Tumkur', 'KA19 - Mangalore'],
    'Tamil Nadu': ['TN01 - Chennai Central', 'TN02 - Chennai North', 'TN03 - Chennai South', 'TN04 - Chennai West', 'TN05 - Chennai East', 'TN37 - Coimbatore', 'TN09 - Madurai', 'TN11 - Salem'],
    'Gujarat': ['GJ01 - Ahmedabad Central', 'GJ02 - Ahmedabad West', 'GJ03 - Ahmedabad East', 'GJ04 - Ahmedabad Rural', 'GJ05 - Surat', 'GJ06 - Rajkot', 'GJ07 - Vadodara', 'GJ18 - Gandhinagar'],
    'West Bengal': ['WB01 - Kolkata Central', 'WB02 - Kolkata South', 'WB03 - Kolkata North', 'WB04 - Howrah', 'WB06 - Siliguri', 'WB07 - Asansol', 'WB10 - Durgapur', 'WB19 - Kalyani']
  };

  const handleVehicleNumberChange = (e) => {
    // Allow only alphanumeric characters and limit length
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setVehicleNumber(value);
  };

  const handleQuickAction = (actionType) => {
    if (actionType === 'Payment Transaction Status' && onNavigate) {
      onNavigate('transaction');
    } else {
      setModalMessage(`Opening ${actionType}...`);
      // Here you would typically redirect to the appropriate page
    }
  };

  const handleProceed = () => {
    if (searchMode === 'vehicle') {
      if (!vehicleNumber) {
        setModalMessage('Please enter your vehicle registration number.');
        return;
      }
    } else {
      if (!selectedState) {
        setModalMessage('Please select a state to proceed.');
        return;
      }
      if (!selectedRTO) {
        setModalMessage('Please select an RTO office.');
        return;
      }
    }
    
    setIsLoading(true);
    
    // Simulate an API call to fetch vehicle data
    setTimeout(() => {
      setIsLoading(false);
      const verifiedInfo = searchMode === 'vehicle' ? vehicleNumber : `${selectedRTO}, ${selectedState}`;
      // Navigate to services page
      onNavigate('services', { 
        vehicleNumber: searchMode === 'vehicle' ? vehicleNumber : '',
        location: searchMode === 'location' ? verifiedInfo : ''
      });
    }, 2000);
  };

  return (
    <div className="vahan-container">
      <Modal message={modalMessage} onClose={() => setModalMessage('')} />
      
      {/* Header Section */}
      <Header onNavigate={onNavigate} currentPage="home" />

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section with Form */}
        <section className="hero-section">
          <div className="form-container-wrapper">
            <div className="form-header">
              <h2>Vehicle Related Services</h2>
            </div>
            <div className="form-body">
              {/* Search Mode Toggle */}
              <div className="search-mode-toggle">
                <button 
                  className={`toggle-btn ${searchMode === 'vehicle' ? 'active' : ''}`}
                  onClick={() => {
                    setSearchMode('vehicle');
                    setSelectedState('');
                    setSelectedRTO('');
                  }}
                >
                  Search by Vehicle Number
                </button>
                <button 
                  className={`toggle-btn ${searchMode === 'location' ? 'active' : ''}`}
                  onClick={() => {
                    setSearchMode('location');
                    setVehicleNumber('');
                  }}
                >
                  Search by Location
                </button>
              </div>

              {searchMode === 'vehicle' ? (
                <div className="form-group">
                  <label htmlFor="vehicle-number">Vehicle Registration No.</label>
                  <input
                    type="text"
                    id="vehicle-number"
                    value={vehicleNumber}
                    onChange={handleVehicleNumberChange}
                    placeholder="e.g. TN01AB1234"
                    className="form-input"
                    maxLength="15"
                  />
                  <small className="form-help">Enter your complete vehicle registration number</small>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="state-select">Select State</label>
                    <select
                      id="state-select"
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedRTO(''); // Reset RTO when state changes
                      }}
                      className="form-select"
                    >
                      <option value="">-- Please Select State --</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedState && rtoOffices[selectedState] && (
                    <div className="form-group">
                      <label htmlFor="rto-select">Select RTO Office</label>
                      <select
                        id="rto-select"
                        value={selectedRTO}
                        onChange={(e) => setSelectedRTO(e.target.value)}
                        className="form-select"
                      >
                        <option value="">-- Please Select RTO --</option>
                        {rtoOffices[selectedState].map((rto) => (
                          <option key={rto} value={rto}>
                            {rto}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              <button 
                className="proceed-btn"
                onClick={handleProceed}
                disabled={isLoading}
              >
                {isLoading ? 'PROCESSING...' : 'PROCEED'}
              </button>

              <p className="help-text">
                {searchMode === 'vehicle' 
                  ? 'Enter your vehicle registration number and click "Proceed" to access vehicle-specific services.'
                  : 'Select your state and RTO office to view available services in your area.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="quick-actions-section">
          <div className="quick-actions-container">
            <button 
              className="quick-action-btn primary"
              onClick={() => handleQuickAction('Payment Transaction Status')}
            >
              Know Your Payment Transaction Status
            </button>
            <button 
              className="quick-action-btn secondary"
              onClick={() => handleQuickAction('Receipt Verification')}
            >
              Verify Receipt
            </button>
            <button 
              className="quick-action-btn tertiary"
              onClick={() => handleQuickAction('Feedback/Complaint Portal')}
            >
              Click here for Feedback/Complaint
            </button>
            <button 
              className="quick-action-btn quaternary"
              onClick={() => handleQuickAction('New Registration Application')}
            >
              Apply For New Registration
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services-section">
          <h3>Popular Services</h3>
          <div className="services-grid">
            <div className="service-item">
              <ServiceIcon><CarIcon /></ServiceIcon>
              <span>Vehicle Registration</span>
            </div>
            <div className="service-item">
              <ServiceIcon><PermitIcon /></ServiceIcon>
              <span>Permit</span>
            </div>
            <div className="service-item">
              <ServiceIcon><FitnessIcon /></ServiceIcon>
              <span>Fitness</span>
            </div>
            <div 
              className="service-item"
              onClick={() => onNavigate('tax')}
              style={{ cursor: 'pointer' }}
            >
              <ServiceIcon><TaxIcon /></ServiceIcon>
              <span>Tax</span>
            </div>
            <div className="service-item">
              <ServiceIcon><PuccIcon /></ServiceIcon>
              <span>PUCC</span>
            </div>
            <div className="service-item">
              <ServiceIcon><FancyNumberIcon /></ServiceIcon>
              <span>Fancy Number</span>
            </div>
             <div className="service-item">
              <ServiceIcon><KnowVehicleIcon /></ServiceIcon>
              <span>Know Your Vehicle</span>
            </div>
            <div className="service-item">
              <ServiceIcon><OtherServicesIcon /></ServiceIcon>
              <span>Other Services</span>
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

export default App;
