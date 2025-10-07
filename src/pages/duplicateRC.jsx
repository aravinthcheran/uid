import React, { useState } from 'react';
import '../styles/duplicateRC.css';
import Header from '../components/Header';

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

function DuplicateRC({ onNavigate, initialVehicleNumber = '', initialData = {} }) {
  const [step, setStep] = useState(initialData.step || 1); // 1: Input details, 2: Show address & order
  const [vehicleNumber, setVehicleNumber] = useState(initialData.vehicleNumber || initialVehicleNumber);
  const [chassisNumber, setChassisNumber] = useState(initialData.chassisNumber || '');
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [ownerDetails, setOwnerDetails] = useState(initialData.ownerDetails || null);
  const hasPrefilledVehicleNumber = !!(initialData.vehicleNumber || initialVehicleNumber); // Track if vehicle number came from previous page

  const handleVehicleNumberChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setVehicleNumber(value);
  };

  const handleChassisNumberChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    setChassisNumber(value);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    
    if (!vehicleNumber) {
      setModalMessage('Please enter your vehicle registration number.');
      return;
    }

    if (!chassisNumber || chassisNumber.length !== 5) {
      setModalMessage('Please enter last 5 characters of chassis number.');
      return;
    }

    setIsLoading(true);

    // Simulate API call to verify vehicle details
    setTimeout(() => {
      setIsLoading(false);
      // Generate random address details
      const randomAddresses = [
        {
          name: 'Rajesh Kumar Sharma',
          address: '45, Green Park Extension, Sector 12',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110016',
          phone: '+91 98765 43210'
        },
        {
          name: 'Priya Patel',
          address: '23/B, Satellite Road, Near ISRO',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380015',
          phone: '+91 99887 76655'
        },
        {
          name: 'Anil Deshmukh',
          address: '78, Koregaon Park, Lane 5',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          phone: '+91 98123 45678'
        }
      ];
      
      const randomIndex = Math.floor(Math.random() * randomAddresses.length);
      setOwnerDetails(randomAddresses[randomIndex]);
      setStep(2);
    }, 1500);
  };

  const handleOrderRC = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to payment page with RC order details
      onNavigate('payment', {
        serviceType: 'Duplicate RC',
        vehicleNumber: vehicleNumber,
        amount: 250,
        description: 'Application for Duplicate Registration Certificate',
        // Breadcrumb trail
        breadcrumbTrail: [
          { name: 'Home', path: 'home' },
          { name: 'Services', path: 'services' },
          { name: 'Duplicate RC', path: 'duplicateRC' },
          { name: 'Payment', path: 'payment' }
        ],
        // Store full state to return back
        duplicateRCPageData: {
          step: 2,
          vehicleNumber: vehicleNumber,
          chassisNumber: chassisNumber,
          ownerDetails: ownerDetails
        }
      });
    }, 1000);
  };

  const handleBack = () => {
    setStep(1);
    setOwnerDetails(null);
  };

  const breadcrumbTrail = [
    { name: 'Home', path: 'home' },
    { name: 'Services', path: 'services' },
    { name: 'Duplicate RC', path: 'duplicateRC' }
  ];

  return (
    <div className="vahan-container">
      <Modal message={modalMessage} onClose={() => setModalMessage('')} />
      
      {/* Header Section */}
      <Header onNavigate={onNavigate} currentPage="duplicateRC" breadcrumbTrail={breadcrumbTrail} />

      {/* Main Content */}
      <main className="main-content">
        <div className="duplicate-rc-container">
          {step === 1 ? (
            // Step 1: Vehicle Details Input
            <div className="form-container-wrapper duplicate-rc-form">
              <div className="form-header">
                <h2>Apply for Duplicate RC</h2>
                <p className="form-subtitle">Enter vehicle details to proceed</p>
              </div>
              <div className="form-body">
                <form onSubmit={handleVerify}>
                  {hasPrefilledVehicleNumber && (
                    <div className="form-group">
                      <label htmlFor="vehicle-number">
                        Vehicle Registration No. <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="vehicle-number"
                        value={vehicleNumber}
                        className="form-input prefilled-input"
                        readOnly
                        title="Vehicle number from your search"
                      />
                      <p className="prefilled-note">✓ Vehicle number from your search</p>
                    </div>
                  )}
                  
                  {!hasPrefilledVehicleNumber && (
                    <div className="form-group">
                      <label htmlFor="vehicle-number">
                        Vehicle Registration No. <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="vehicle-number"
                        value={vehicleNumber}
                        onChange={handleVehicleNumberChange}
                        className="form-input"
                        placeholder="Enter vehicle registration number"
                        maxLength="15"
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="chassis-number">
                      Chassis Number (Last 5 characters) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="chassis-number"
                      value={chassisNumber}
                      onChange={handleChassisNumberChange}
                      className="form-input"
                      placeholder="Enter last 5 characters"
                      maxLength="5"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="verify-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'VERIFYING...' : 'VERIFY & PROCEED'}
                  </button>
                  
                  <button 
                    type="button"
                    className="back-to-services-btn"
                    onClick={() => onNavigate('services', { vehicleNumber })}
                  >
                    ← Back to Services
                  </button>
                </form>

                <div className="info-section">
                  <h4>Required Documents:</h4>
                  <ul>
                    <li>Valid ID proof (Aadhaar/PAN Card/Driving License)</li>
                    <li>Address proof</li>
                    <li>Vehicle insurance copy</li>
                    <li>FIR copy (if RC is lost/stolen)</li>
                  </ul>
                  
                  <h4>Fees:</h4>
                  <p>Application Fee: ₹250</p>
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Show Address and Order Button
            <div className="form-container-wrapper duplicate-rc-confirm">
              <div className="form-header">
                <h2>Confirm Owner Details</h2>
                <p className="form-subtitle">Verify your details before placing order</p>
              </div>
              <div className="form-body">
                <div className="vehicle-info-box">
                  <h3>Vehicle Information</h3>
                  <div className="info-row">
                    <span className="info-label">Registration Number:</span>
                    <span className="info-value">{vehicleNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Chassis Number (Last 5):</span>
                    <span className="info-value">{chassisNumber}</span>
                  </div>
                </div>

                {ownerDetails && (
                  <div className="owner-info-box">
                    <h3>Owner Details</h3>
                    <div className="info-row">
                      <span className="info-label">Name:</span>
                      <span className="info-value">{ownerDetails.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Address:</span>
                      <span className="info-value">{ownerDetails.address}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">City:</span>
                      <span className="info-value">{ownerDetails.city}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">State:</span>
                      <span className="info-value">{ownerDetails.state}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Pincode:</span>
                      <span className="info-value">{ownerDetails.pincode}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">{ownerDetails.phone}</span>
                    </div>
                  </div>
                )}

                <div className="fee-info-box">
                  <div className="fee-row">
                    <span>Application Fee:</span>
                    <span className="fee-amount">₹250.00</span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    className="back-btn"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    BACK
                  </button>
                  <button 
                    className="order-rc-btn"
                    onClick={handleOrderRC}
                    disabled={isLoading}
                  >
                    {isLoading ? 'PROCESSING...' : 'ORDER DUPLICATE RC'}
                  </button>
                </div>

                <div className="note-section">
                  <p><strong>Note:</strong> The duplicate RC will be dispatched to your registered address within 7-10 working days after successful payment verification.</p>
                </div>
              </div>
            </div>
          )}
        </div>
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

export default DuplicateRC;
