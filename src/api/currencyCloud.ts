import axios from 'axios';

const API_URL = 'https://api-sandbox.currencycloud.com/v2';

// Demo authentication token - in real app this would come from proper auth flow
const TOKEN = '08b52ca3c80a965d4d26cc1d91828e443f3bee5430389b32e6806632976db40d';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-Auth-Token': TOKEN,
  },
});

export const getRates = async (sourceCurrency: string) => {
  try {
    // Simulated response for demo with more realistic rates
    const rates: Record<string, number> = {
      GBP: 1.27,
      EUR: 1.08,
      CNY: 0.14,
      BRL: 0.20,
      AED: 0.27
    };
    
    return {
      rate: rates[sourceCurrency] || 1,
      source: sourceCurrency,
      target: 'USD'
    };
  } catch (error) {
    console.error('Error fetching rates:', error);
    throw error;
  }
};

export const getPaymentMethods = async (countryCode: string) => {
  try {
    // Extended payment methods for each country
    const methods = {
      UK: [
        { name: 'Bank Transfer (BACS)', icon: '🏦' },
        { name: 'Faster Payments', icon: '⚡' },
        { name: 'CHAPS', icon: '💷' },
        { name: 'Debit Card', icon: '💳' },
        { name: 'Credit Card', icon: '💳' }
      ],
      China: [
        { name: 'UnionPay', icon: '💳' },
        { name: 'Alipay', icon: '📱' },
        { name: 'WeChat Pay', icon: '💬' },
        { name: 'Bank Transfer (CNAPS)', icon: '🏦' }
      ],
      Brazil: [
        { name: 'PIX', icon: '⚡' },
        { name: 'Boleto', icon: '📃' },
        { name: 'Bank Transfer (TED)', icon: '🏦' },
        { name: 'Credit Card', icon: '💳' }
      ],
      Germany: [
        { name: 'SEPA Transfer', icon: '🏦' },
        { name: 'SOFORT', icon: '⚡' },
        { name: 'Giropay', icon: '🏦' },
        { name: 'Credit Card', icon: '💳' }
      ],
      France: [
        { name: 'SEPA Transfer', icon: '🏦' },
        { name: 'Carte Bancaire', icon: '💳' },
        { name: 'Credit Card', icon: '💳' }
      ],
      UAE: [
        { name: 'Bank Transfer', icon: '🏦' },
        { name: 'UAEFTS', icon: '⚡' },
        { name: 'Credit Card', icon: '💳' }
      ]
    };
    
    const countryMethods = methods[countryCode as keyof typeof methods] || [];
    return countryMethods.map((method, index) => ({
      id: `${countryCode}-${index}`,
      name: method.name,
      icon: method.icon
    }));
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

export const createPayment = async (data: any) => {
  try {
    // Simulated successful payment response
    return {
      id: `PAY-${Math.random().toString(36).substr(2, 9)}`,
      status: 'completed',
      tracking_id: `TRK-${Math.random().toString(36).substr(2, 9)}`,
      ...data
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};