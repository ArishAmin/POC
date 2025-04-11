import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { countries, generateBills } from '../data/mockData';
import { Bill, Country } from '../types';
import { FileText, DollarSign, Globe } from 'lucide-react';

export default function BillsPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const bills = generateBills(selectedCountry.currency);

  const handleBillSelection = (billId: string) => {
    setSelectedBills(prev => 
      prev.includes(billId) 
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    );
  };

  const handlePayment = () => {
    if (selectedBills.length > 0) {
      const selectedBillsData = bills.filter(bill => selectedBills.includes(bill.id));
      navigate('/payment', { 
        state: { 
          bills: selectedBillsData,
          country: selectedCountry
        }
      });
    }
  };

  const handleSingleBillPayment = (bill: Bill) => {
    navigate('/payment', { 
      state: { 
        bills: [bill],
        country: selectedCountry
      }
    });
  };

  const getTotalAmount = (bills: Bill[]) => {
    return bills
      .filter(bill => selectedBills.includes(bill.id))
      .reduce((acc, bill) => acc + bill.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Your Country</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  setSelectedCountry(country);
                  setSelectedBills([]);
                }}
                className={`p-4 border rounded-lg flex items-center space-x-3 ${
                  selectedCountry.code === country.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <span className="text-2xl">{country.flag}</span>
                <span className="font-medium">{country.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Outstanding Bills</h1>
          <button
            onClick={handlePayment}
            disabled={selectedBills.length === 0}
            className={`px-4 py-2 rounded-md text-white ${
              selectedBills.length > 0 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Pay Selected Bills
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className={`border rounded-lg p-4 transition-all ${
                selectedBills.includes(bill.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="ml-2 font-medium text-gray-900">{bill.id}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedBills.includes(bill.id)}
                  onChange={() => handleBillSelection(bill.id)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{bill.description}</p>
                <div className="mt-2 flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-lg font-semibold text-gray-900">
                    {bill.amount.toLocaleString()} {bill.currency}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Due: {new Date(bill.dueDate).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleSingleBillPayment(bill)}
                  className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Pay This Bill
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedBills.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Selected Bills: {selectedBills.length}</span>
              <span className="text-lg font-semibold">
                Total: {getTotalAmount(bills).toLocaleString()} {selectedCountry.currency}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}