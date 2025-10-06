import React, { useState, useEffect } from 'react';
import '../styles/payment.css';
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

// Success Modal Component
const SuccessModal = ({ show, details, onClose, onDownloadReceipt }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay success-modal-overlay">
      <div className="modal-content success-modal">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2>Payment Successful!</h2>
        <p className="success-message">Your payment has been processed successfully.</p>
        
        <div className="payment-details">
          <div className="detail-row">
            <span>Transaction ID:</span>
            <span className="detail-value">{details.transactionId}</span>
          </div>
          <div className="detail-row">
            <span>Service:</span>
            <span className="detail-value">{details.serviceType}</span>
          </div>
          <div className="detail-row">
            <span>Vehicle Number:</span>
            <span className="detail-value">{details.vehicleNumber}</span>
          </div>
          <div className="detail-row">
            <span>Amount Paid:</span>
            <span className="detail-value">₹{details.amount}</span>
          </div>
          <div className="detail-row">
            <span>Date & Time:</span>
            <span className="detail-value">{details.datetime}</span>
          </div>
        </div>

        {details.serviceType === 'Duplicate RC' && (
          <div className="rc-confirmation">
            <div className="confirmation-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3>Duplicate RC Ordered Successfully!</h3>
            <p>Your duplicate Registration Certificate has been ordered and will be dispatched to your registered address within 7-10 working days.</p>
            <p className="tracking-info">You can track your order status using the transaction ID: <strong>{details.transactionId}</strong></p>
          </div>
        )}

        <div className="success-actions">
          <button onClick={onDownloadReceipt} className="download-receipt-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Receipt
          </button>
          <button onClick={onClose} className="success-close-btn">
            {details.serviceType === 'Duplicate RC' ? 'DONE' : 'CLOSE'}
          </button>
        </div>
      </div>
    </div>
  );
};

function Payment({ onNavigate, paymentDetails = {} }) {
  const [step, setStep] = useState(1); // 1: Select payment method, 2: Processing, 3: Success
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  // Card payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI field
  const [upiId, setUpiId] = useState('');

  // Net Banking
  const [selectedBank, setSelectedBank] = useState('');

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India'
  ];

  const {
    serviceType = 'Service',
    vehicleNumber = 'N/A',
    amount = 0,
    description = 'Payment for service',
    breadcrumbTrail = []
  } = paymentDetails;

  const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    // Reset form fields when changing method
    if (method !== 'card') {
      setCardNumber('');
      setCardName('');
      setExpiryDate('');
      setCvv('');
    }
    if (method !== 'upi') {
      setUpiId('');
    }
    if (method !== 'netbanking') {
      setSelectedBank('');
    }
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value.slice(0, 5));
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };

  const validatePayment = () => {
    if (!selectedMethod) {
      setModalMessage('Please select a payment method.');
      return false;
    }

    if (selectedMethod === 'card') {
      if (!cardNumber || cardNumber.length !== 16) {
        setModalMessage('Please enter a valid 16-digit card number.');
        return false;
      }
      if (!cardName) {
        setModalMessage('Please enter the cardholder name.');
        return false;
      }
      if (!expiryDate || expiryDate.length !== 5) {
        setModalMessage('Please enter a valid expiry date (MM/YY).');
        return false;
      }
      if (!cvv || cvv.length !== 3) {
        setModalMessage('Please enter a valid 3-digit CVV.');
        return false;
      }
    }

    if (selectedMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setModalMessage('Please enter a valid UPI ID.');
        return false;
      }
    }

    if (selectedMethod === 'netbanking') {
      if (!selectedBank) {
        setModalMessage('Please select a bank.');
        return false;
      }
    }

    return true;
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    
    if (!validatePayment()) {
      return;
    }

    setIsProcessing(true);
    setStep(2);

    // Simulate payment processing
    setTimeout(() => {
      const txnId = generateTransactionId();
      const now = new Date();
      const datetime = now.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setTransactionDetails({
        transactionId: txnId,
        serviceType,
        vehicleNumber,
        amount,
        datetime,
        paymentMethod: selectedMethod.toUpperCase()
      });

      setIsProcessing(false);
      setShowSuccess(true);
    }, 3000);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onNavigate('services');
  };

  const handleDownloadReceipt = () => {
    if (!transactionDetails) return;

    // Create receipt content
    const receiptContent = `
╔═══════════════════════════════════════════════════════════╗
║          MINISTRY OF ROAD TRANSPORT & HIGHWAYS           ║
║                  GOVERNMENT OF INDIA                      ║
║                  PAYMENT RECEIPT                          ║
╚═══════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRANSACTION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transaction ID:        ${transactionDetails.transactionId}
Date & Time:           ${transactionDetails.datetime}
Payment Method:        ${transactionDetails.paymentMethod}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SERVICE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service Type:          ${transactionDetails.serviceType}
Vehicle Number:        ${transactionDetails.vehicleNumber}
Description:           ${description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount Paid:           ₹${transactionDetails.amount}.00
Payment Status:        SUCCESS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${transactionDetails.serviceType === 'Duplicate RC' ? `
IMPORTANT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your duplicate Registration Certificate has been ordered.
Expected Delivery: 7-10 working days
Track your order using Transaction ID: ${transactionDetails.transactionId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}

NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• This is a computer-generated receipt and does not require signature.
• Please save this receipt for your records.
• For any queries, please contact your nearest RTO office.
• Quote the Transaction ID for any correspondence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for using VAHAN Citizen Services!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated on: ${new Date().toLocaleString('en-IN')}

╚═══════════════════════════════════════════════════════════╝
    `.trim();

    // Create a blob with the receipt content
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${transactionDetails.transactionId}.txt`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleBackButton = () => {
    // Determine which page to go back to based on service type
    if (serviceType === 'Duplicate RC') {
      const rcData = paymentDetails.duplicateRCPageData || { vehicleNumber };
      onNavigate('duplicateRC', rcData);
    } else if (serviceType === 'Road Tax Payment') {
      // Pass back to tax page with existing data to maintain state
      const taxData = paymentDetails.taxPageData || {};
      onNavigate('tax', taxData);
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="vahan-container">
      <Modal message={modalMessage} onClose={() => setModalMessage('')} />
      <SuccessModal 
        show={showSuccess} 
        details={transactionDetails || {}} 
        onClose={handleSuccessClose}
        onDownloadReceipt={handleDownloadReceipt}
      />
      
      {/* Header Section */}
      <Header onNavigate={onNavigate} currentPage="payment" breadcrumbTrail={breadcrumbTrail} />

      {/* Main Content */}
      <main className="main-content">
        <div className="payment-container">
          {step === 1 && (
            <div className="form-container-wrapper payment-form">
              <div className="form-header">
                <h2>Payment</h2>
                <p className="form-subtitle">Complete your payment securely</p>
              </div>

              <div className="form-body">
                {/* Order Summary */}
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Service:</span>
                    <span className="summary-value">{serviceType}</span>
                  </div>
                  <div className="summary-row">
                    <span>Vehicle Number:</span>
                    <span className="summary-value">{vehicleNumber}</span>
                  </div>
                  <div className="summary-row">
                    <span>Description:</span>
                    <span className="summary-value">{description}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total Amount:</span>
                    <span className="summary-value amount">₹{amount}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="payment-methods">
                  <h3>Select Payment Method</h3>
                  <div className="payment-method-options">
                    <button
                      className={`payment-method-btn ${selectedMethod === 'card' ? 'active' : ''}`}
                      onClick={() => handlePaymentMethodSelect('card')}
                    >
                      <span className="method-icon">💳</span>
                      <span>Credit/Debit Card</span>
                    </button>
                    <button
                      className={`payment-method-btn ${selectedMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => handlePaymentMethodSelect('upi')}
                    >
                      <span className="method-icon">📱</span>
                      <span>UPI</span>
                    </button>
                    <button
                      className={`payment-method-btn ${selectedMethod === 'netbanking' ? 'active' : ''}`}
                      onClick={() => handlePaymentMethodSelect('netbanking')}
                    >
                      <span className="method-icon">🏦</span>
                      <span>Net Banking</span>
                    </button>
                  </div>
                </div>

                {/* Payment Forms */}
                <form onSubmit={handlePayNow}>
                  {selectedMethod === 'card' && (
                    <div className="payment-form-section">
                      <h4>Enter Card Details</h4>
                      <div className="form-group">
                        <label htmlFor="card-number">Card Number <span className="required">*</span></label>
                        <input
                          type="text"
                          id="card-number"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="card-name">Cardholder Name <span className="required">*</span></label>
                        <input
                          type="text"
                          id="card-name"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          placeholder="NAME ON CARD"
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="expiry-date">Expiry Date <span className="required">*</span></label>
                          <input
                            type="text"
                            id="expiry-date"
                            value={expiryDate}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="cvv">CVV <span className="required">*</span></label>
                          <input
                            type="password"
                            id="cvv"
                            value={cvv}
                            onChange={handleCvvChange}
                            placeholder="123"
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'upi' && (
                    <div className="payment-form-section">
                      <h4>Enter UPI Details</h4>
                      <div className="form-group">
                        <label htmlFor="upi-id">UPI ID <span className="required">*</span></label>
                        <input
                          type="text"
                          id="upi-id"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="form-input"
                          required
                        />
                      </div>
                      <p className="form-help">Enter your UPI ID to complete the payment</p>
                    </div>
                  )}

                  {selectedMethod === 'netbanking' && (
                    <div className="payment-form-section">
                      <h4>Select Your Bank</h4>
                      <div className="form-group">
                        <label htmlFor="bank-select">Bank <span className="required">*</span></label>
                        <select
                          id="bank-select"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="form-select"
                          required
                        >
                          <option value="">-- Select Bank --</option>
                          {banks.map((bank) => (
                            <option key={bank} value={bank}>
                              {bank}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="form-help">You will be redirected to your bank's website</p>
                    </div>
                  )}

                  {selectedMethod && (
                    <div className="payment-action-buttons">
                      <button 
                        type="button"
                        className="payment-back-btn"
                        onClick={handleBackButton}
                        disabled={isProcessing}
                      >
                        ← BACK
                      </button>
                      <button 
                        type="submit"
                        className="pay-now-btn"
                        disabled={isProcessing}
                      >
                        PAY ₹{amount}
                      </button>
                    </div>
                  )}

                  {!selectedMethod && (
                    <button 
                      type="button"
                      className="back-only-btn"
                      onClick={handleBackButton}
                    >
                      ← BACK
                    </button>
                  )}
                </form>

                <div className="security-info">
                  <p>🔒 Your payment information is secure and encrypted</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="processing-container">
              <div className="processing-animation">
                <div className="spinner"></div>
                <h3>Processing Payment...</h3>
                <p>Please wait while we process your payment</p>
                <p className="processing-note">Do not refresh or close this page</p>
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

export default Payment;
