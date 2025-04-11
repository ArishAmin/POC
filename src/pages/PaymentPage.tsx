import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bill, PaymentMethod } from '../types';
import { getPaymentMethods, getRates, createPayment } from '../api/currencyCloud';
import { CreditCard, ArrowRight, RefreshCw } from 'lucide-react';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bills, country } = location.state as { bills: Bill[], country: { code: string, currency: string, name: string, flag: string } };

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        let countryCode = '';
        switch (country.code) {
          case 'GB':
            countryCode = 'UK';
            break;
          case 'CN':
            countryCode = 'China';
            break;
          case 'BR':
            countryCode = 'Brazil';
            break;
          case 'DE':
            countryCode = 'Germany';
            break;
          case 'FR':
            countryCode = 'France';
            break;
          case 'AE':
            countryCode = 'UAE';
            break;
          default:
            countryCode = country.code;
        }
        const methods = await getPaymentMethods(countryCode);
        setPaymentMethods(methods);
        if (methods.length > 0) {
          setSelectedMethod(methods[0].id);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    const fetchRate = async () => {
      try {
        const rate = await getRates(country.currency);
        setExchangeRate(rate.rate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    fetchPaymentMethods();
    fetchRate();
  }, [country]);

  const calculateTotal = () => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const calculateTotalUSD = () => {
    return calculateTotal() * exchangeRate;
  };

  const handlePayment = async () => {
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
                    <p className="font-medium">
                      {bill.amount.toLocaleString()} {bill.currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      ≈ ${(bill.amount * exchangeRate).toFixed(2)} USD
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border rounded-lg flex items-center space-x-3 ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center text-gray-600">
                <span>Exchange Rate</span>
                <div className="flex items-center space-x-2">
                  <span>1 {country.currency} = ${exchangeRate.toFixed(4)} USD</span>
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
                    {calculateTotal().toLocaleString()} {country.currency}
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