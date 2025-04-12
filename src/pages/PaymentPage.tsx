import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bill, PaymentMethod } from '../types';
import { getPaymentMethods, getRates, createPayment } from '../api/currencyCloud';
import { CreditCard, ArrowRight, RefreshCw, Building } from 'lucide-react';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bills, country } = location.state as { bills: Bill[], country: { code: string, currency: string, name: string, flag: string } };

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(0.14); // Matching the rate from BillsPage
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    idNumber: '',
    phoneNumber: '',
    bankAccount: ''
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods('China');
        setPaymentMethods(methods);
        if (methods.length > 0) {
          setSelectedMethod(methods[0].id);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const calculateTotal = () => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const calculateTotalUSD = () => {
    return calculateTotal() * exchangeRate;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const paymentData = {
        amount: calculateTotalUSD(),
        currency: 'USD',
        source_currency: country.currency,
        payment_method: selectedMethod,
        bill_ids: bills.map(b => b.id)
      };

      const response = await createPayment(paymentData);
      navigate(`/tracking/${response.tracking_id}`);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPaymentForm = () => {
    const methodId = selectedMethod.split('-')[1];
    
    switch (methodId) {
      case '0': // UnionPay
        return (
          <form onSubmit={handlePayment} className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="6222 **** **** ****"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="***"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              />
            </div>
          </form>
        );
      
      case '1': // Alipay
        return (
          <form onSubmit={handlePayment} className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Alipay Account</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone number or email"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              />
            </div>
          </form>
        );
      
      case '2': // WeChat Pay
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg text-center">
            <div className="bg-white p-4 rounded-lg inline-block">
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">QR Code Demo</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Scan with WeChat app to pay</p>
          </div>
        );
      
      case '3': // Bank Transfer
        return (
          <form onSubmit={handlePayment} className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                required
              />
            </div>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{country.flag}</span>
            <span className="font-medium">{country.name}</span>
          </div>
        </div>

        {/* Recipient Company Details */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Building className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Recipient Details</h2>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Company:</strong> Global Tech Solutions Inc.</p>
            <p><strong>Address:</strong> 123 Innovation Drive, Silicon Valley, CA 94025, USA</p>
            <p><strong>Registration No:</strong> US12345678</p>
            <p><strong>Bank Account:</strong> **** **** **** 4789 (Wells Fargo)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Bills</h2>
            <div className="space-y-4">
              {bills.map((bill) => (
                <div key={bill.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{bill.description}</p>
                    <p className="text-sm text-gray-500">{bill.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(bill.amount * exchangeRate).toFixed(2)} USD
                    </p>
                    <p className="text-sm text-gray-500">
                      ({bill.amount.toLocaleString()} CNY)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border rounded-lg flex flex-col items-center space-y-2 ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium text-center">{method.name}</span>
                </button>
              ))}
            </div>
            {renderPaymentForm()}
          </div>

          <div className="border-t pt-6">
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center text-gray-600">
                <span>Exchange Rate</span>
                <div className="flex items-center space-x-2">
                  <span>1 CNY = ${exchangeRate.toFixed(4)} USD</span>
                  <RefreshCw className="h-4 w-4" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ${calculateTotalUSD().toFixed(2)} USD
                  </p>
                  <p className="text-sm text-gray-500">
                    ({calculateTotal().toLocaleString()} CNY)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>Complete Payment</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}