import React, { useState } from 'react';
import './App.css';
import Home from './pages/home';
import Services from './pages/services';
import TransactionStatus from './pages/transaction';
import TaxPayment from './pages/tax';
import DuplicateRC from './pages/duplicateRC';
import Payment from './pages/payment';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [navigationData, setNavigationData] = useState({});

  const handleNavigation = (page, data = {}) => {
    setCurrentPage(page);
    setNavigationData(data);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'services':
        return <Services onNavigate={handleNavigation} verificationData={navigationData} />;
      case 'transaction':
        return <TransactionStatus onNavigate={handleNavigation} />;
      case 'tax':
        return <TaxPayment onNavigate={handleNavigation} initialData={navigationData} />;
      case 'duplicateRC':
        return <DuplicateRC onNavigate={handleNavigation} initialVehicleNumber={navigationData.vehicleNumber || ''} initialData={navigationData} />;
      case 'payment':
        return <Payment onNavigate={handleNavigation} paymentDetails={navigationData} />;
      case 'home':
      default:
        return <Home onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
