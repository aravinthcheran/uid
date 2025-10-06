import React, { useState } from 'react';
import '../styles/transaction.css';
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

function TransactionStatus({ onNavigate }) {
  const [searchType, setSearchType] = useState('transaction');
  const [searchValue, setSearchValue] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!searchValue.trim()) {
      setModalMessage('Please enter a value to search.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setModalMessage(`Searching for ${searchType}: ${searchValue}`);
      // You would typically set actual search results here
      setSearchResults([]);
    }, 1500);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchValue('');
  };

  const getPlaceholder = () => {
    switch(searchType) {
      case 'transaction': return 'Enter Transaction ID';
      case 'payment': return 'Enter Payment ID';
      case 'bank': return 'Enter Bank Reference Number';
      case 'registration': return 'Enter Registration Number';
      case 'grn': return 'Enter GRN Number';
      default: return 'Enter search value';
    }
  };

  const getSearchLabel = () => {
    switch(searchType) {
      case 'transaction': return 'Transaction ID';
      case 'payment': return 'Payment ID';
      case 'bank': return 'Bank Ref. No.';
      case 'registration': return 'Registration No.';
      case 'grn': return 'Grn No.';
      default: return 'Search';
    }
  };

  return (
    <div className="vahan-container">
      <Modal message={modalMessage} onClose={() => setModalMessage('')} />
      
      {/* Header Section */}
      <Header onNavigate={onNavigate} currentPage="transaction" />

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section with Transaction Form */}
        <section className="hero-section transaction-hero">
          <div className="form-container-wrapper">
            <div className="form-header">
              <h2>Transaction Status</h2>
            </div>
            <div className="form-body">
              {/* Warning Messages */}
              <div className="warning-section">
                <p className="warning-text">
                  Search with Registration No is only applicable for citizen service application.
                </p>
                <p className="warning-text">
                  In case of Citizen service application Payment id will be Application No.
                </p>
              </div>

              {/* Search Form */}
              <div className="search-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="searchType"
                    value="transaction"
                    checked={searchType === 'transaction'}
                    onChange={() => handleSearchTypeChange('transaction')}
                  />
                  Transaction id
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="searchType"
                    value="payment"
                    checked={searchType === 'payment'}
                    onChange={() => handleSearchTypeChange('payment')}
                  />
                  Payment id
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="searchType"
                    value="bank"
                    checked={searchType === 'bank'}
                    onChange={() => handleSearchTypeChange('bank')}
                  />
                  Bank Ref. No.
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="searchType"
                    value="registration"
                    checked={searchType === 'registration'}
                    onChange={() => handleSearchTypeChange('registration')}
                  />
                  Registration No.
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="searchType"
                    value="grn"
                    checked={searchType === 'grn'}
                    onChange={() => handleSearchTypeChange('grn')}
                  />
                  Grn No.
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="searchInput">
                  {getSearchLabel()}
                </label>
                <div className="search-controls">
                  <input
                    type="text"
                    id="searchInput"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="form-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="proceed-btn"
                  >
                    {isLoading ? 'SEARCHING...' : 'SEARCH'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="services-section results-wrapper">
          <h3>Transaction Details</h3>
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Sl. No.</th>
                  <th>Vehicle No.</th>
                  <th>Application No.</th>
                  <th>Transaction No/AUN</th>
                  <th>Payment Id</th>
                  <th>Payment Date</th>
                  <th>Payment Conf. Date</th>
                  <th>Payment Gateway</th>
                  <th>Bank Ref. No</th>
                  <th>GRN</th>
                  <th>CIN</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Status Description</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="no-data">
                      No transaction data found. Please search using the form above.
                    </td>
                  </tr>
                ) : (
                  searchResults.map((result, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{result.vehicleNo}</td>
                      <td>{result.applicationNo}</td>
                      <td>{result.transactionNo}</td>
                      <td>{result.paymentId}</td>
                      <td>{result.paymentDate}</td>
                      <td>{result.paymentConfDate}</td>
                      <td>{result.paymentGateway}</td>
                      <td>{result.bankRefNo}</td>
                      <td>{result.grn}</td>
                      <td>{result.cin}</td>
                      <td>{result.amount}</td>
                      <td>{result.status}</td>
                      <td>{result.statusDescription}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

export default TransactionStatus;
