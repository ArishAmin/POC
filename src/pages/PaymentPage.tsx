import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bill, PaymentMethod } from '../types';
import { getPaymentMethods, getRates, createPayment } from '../api/currencyCloud';
import { CreditCard, ArrowRight, RefreshCw, Building, Lock, CreditCard as CardIcon, Phone, Ban } from 'lucide-react';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bills, country } = location.state as { bills: Bill[], country: { code: string, currency: string, name: string, flag: string } };

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(0.14);
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
          <form onSubmit={handlePayment} className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <CardIcon className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Card Details</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="6222 **** **** ****"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="cvv"
                        placeholder="***"
                        maxLength={3}
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        );
      
      case '1': // Alipay
        return (
          <form onSubmit={handlePayment} className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <Phone className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Alipay Account</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number or Email</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="+86 123 4567 8900"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter your 6-digit payment password"
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        );
      
      case '2': // WeChat Pay
        return (
          <div className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Phone className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">WeChat Pay QR Code</h3>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg inline-block mb-4">
                <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Phone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Demo QR Code</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium text-gray-900">Scan with WeChat</p>
                <p className="text-xs text-gray-500">Open WeChat, tap "+", and select "Scan"</p>
              </div>
            </div>
          </div>
        );
      
      case '3': // Bank Transfer
        return (
          <form onSubmit={handlePayment} className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <Ban className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Bank Transfer Details</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <Ban className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your Chinese ID number"
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <CardIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
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
            <p><strong>Company:</strong> Anybill Financial Services</p>
            <p><strong>Address:</strong> 4747 Bethesda Ave #610, Bethesda, MD 20814, USA</p>
            <p><strong>Phone No:</strong> 877-426-9245</p>
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
                  className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
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
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
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