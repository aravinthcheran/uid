import React, { useState } from 'react';
import '../styles/tax.css';
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

function TaxPayment({ onNavigate, initialData = {} }) {
  const [step, setStep] = useState(initialData.step || 1); // 1: Input details, 2: Show tax details & payment
  const [vehicleNumber, setVehicleNumber] = useState(initialData.vehicleNumber || '');
  const [chassisNumber, setChassisNumber] = useState(initialData.chassisNumber || '');
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState(initialData.vehicleDetails || null);
  const [taxDetails, setTaxDetails] = useState(initialData.taxDetails || null);

  const handleVehicleNumberChange = (e) => {
    // Allow only alphanumeric characters and convert to uppercase
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setVehicleNumber(value);
  };

  const handleChassisNumberChange = (e) => {
    // Allow only last 5 characters
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

    // Simulate API call to verify vehicle and fetch tax details
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate random vehicle details
      const randomVehicles = [
        {
          vehicleNumber: vehicleNumber,
          ownerName: 'Rajesh Kumar Sharma',
          model: 'Maruti Swift VXi',
          fuelType: 'Petrol',
          registrationDate: '15-Jan-2018',
          vehicleClass: 'Light Motor Vehicle'
        },
        {
          vehicleNumber: vehicleNumber,
          ownerName: 'Priya Patel',
          model: 'Hyundai i20 Sportz',
          fuelType: 'Diesel',
          registrationDate: '22-Mar-2019',
          vehicleClass: 'Light Motor Vehicle'
        },
        {
          vehicleNumber: vehicleNumber,
          ownerName: 'Anil Deshmukh',
          model: 'Honda City VX',
          fuelType: 'Petrol',
          registrationDate: '10-Aug-2017',
          vehicleClass: 'Light Motor Vehicle'
        }
      ];

      // Generate random tax amounts
      const taxAmounts = [
        { roadTax: 1500, penalty: 0, total: 1500 },
        { roadTax: 2300, penalty: 150, total: 2450 },
        { roadTax: 1800, penalty: 0, total: 1800 },
        { roadTax: 2100, penalty: 200, total: 2300 }
      ];
      
      const randomVehicleIndex = Math.floor(Math.random() * randomVehicles.length);
      const randomTaxIndex = Math.floor(Math.random() * taxAmounts.length);
      
      setVehicleDetails(randomVehicles[randomVehicleIndex]);
      setTaxDetails(taxAmounts[randomTaxIndex]);
      setStep(2);
    }, 1500);
  };

  const handlePayTax = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to payment page with tax payment details
      onNavigate('payment', {
        serviceType: 'Road Tax Payment',
        vehicleNumber: vehicleNumber,
        amount: taxDetails.total,
        description: 'Payment for Road Tax',
        // Breadcrumb trail
        breadcrumbTrail: [
          { name: 'Home', path: 'home' },
          { name: 'Services', path: 'services' },
          { name: 'Pay Tax', path: 'tax' },
          { name: 'Payment', path: 'payment' }
        ],
        // Store full state to return back
        taxPageData: {
          step: 2,
          vehicleNumber: vehicleNumber,
          chassisNumber: chassisNumber,
          vehicleDetails: vehicleDetails,
          taxDetails: taxDetails
        }
      });
    }, 1000);
  };

  const handleBack = () => {
    setStep(1);
    setVehicleDetails(null);
    setTaxDetails(null);
  };

  const breadcrumbTrail = [
    { name: 'Home', path: 'home' },
    { name: 'Services', path: 'services' },
    { name: 'Pay Tax', path: 'tax' }
  ];

  return (
    <div className="vahan-container">
      <Modal message={modalMessage} onClose={() => setModalMessage('')} />
      
      {/* Header Section */}
      <Header onNavigate={onNavigate} currentPage="tax" breadcrumbTrail={breadcrumbTrail} />

      {/* Main Content */}
      <main className="main-content">
        <div className="tax-page-container">
          {step === 1 ? (
            // Step 1: Vehicle Details Input
            <div className="form-container-wrapper tax-form">
              <div className="form-header">
                <h2>Online Application (Road Tax)</h2>
                <p className="form-subtitle">Enter vehicle details to check tax pending</p>
              </div>
              <div className="form-body">
                <form onSubmit={handleVerify}>
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
                    {isLoading ? 'VERIFYING...' : 'VERIFY & CHECK TAX'}
                  </button>
                </form>

                <div className="help-section">
                  <h4>Important Instructions:</h4>
                  <ul>
                    <li>Enter your complete vehicle registration number without spaces</li>
                    <li>Chassis number should be last 5 characters only</li>
                    <li>Make sure to verify all details before proceeding</li>
                    <li>For any issues, please contact your nearest RTO office</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Show Tax Details and Payment Option
            <div className="form-container-wrapper tax-details">
              <div className="form-header">
                <h2>Tax Payment Details</h2>
                <p className="form-subtitle">Review details and proceed with payment</p>
              </div>
              <div className="form-body">
                <div className="vehicle-info-box">
                  <h3>Vehicle Information</h3>
                  <div className="info-row">
                    <span className="info-label">Registration Number:</span>
                    <span className="info-value">{vehicleDetails?.vehicleNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Owner Name:</span>
                    <span className="info-value">{vehicleDetails?.ownerName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Vehicle Model:</span>
                    <span className="info-value">{vehicleDetails?.model}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Fuel Type:</span>
                    <span className="info-value">{vehicleDetails?.fuelType}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Registration Date:</span>
                    <span className="info-value">{vehicleDetails?.registrationDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Vehicle Class:</span>
                    <span className="info-value">{vehicleDetails?.vehicleClass}</span>
                  </div>
                </div>

                {taxDetails && (
                  <div className="tax-info-box">
                    <h3>Tax Details</h3>
                    <div className="info-row">
                      <span className="info-label">Road Tax:</span>
                      <span className="info-value">₹{taxDetails.roadTax}.00</span>
                    </div>
                    {taxDetails.penalty > 0 && (
                      <div className="info-row penalty-row">
                        <span className="info-label">Late Payment Penalty:</span>
                        <span className="info-value penalty">₹{taxDetails.penalty}.00</span>
                      </div>
                    )}
                    <div className="info-row total-row">
                      <span className="info-label">Total Amount:</span>
                      <span className="info-value total-amount">₹{taxDetails.total}.00</span>
                    </div>
                  </div>
                )}

                <div className="action-buttons">
                  <button 
                    className="back-btn"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    BACK
                  </button>
                  <button 
                    className="pay-tax-btn"
                    onClick={handlePayTax}
                    disabled={isLoading}
                  >
                    {isLoading ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
                  </button>
                </div>

                <div className="note-section">
                  <p><strong>Note:</strong> Please ensure all vehicle details are correct before proceeding with the payment. Once payment is successful, you will receive a receipt that can be downloaded for your records.</p>
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

export default TaxPayment;
