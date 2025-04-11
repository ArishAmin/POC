import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Building2, Wallet } from 'lucide-react';
import BillsPage from './pages/BillsPage';
import PaymentPage from './pages/PaymentPage';
import TrackingPage from './pages/TrackingPage';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">Welcome Patel Enterprises</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              

                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<BillsPage />} />
            
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/tracking/:id" element={<TrackingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;