import { Bill, Country } from '../types';

export const countries: Country[] = [
  {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧'
  },
  {
    code: 'CN',
    name: 'China',
    currency: 'CNY',
    flag: '🇨🇳'
  },
  {
    code: 'BR',
    name: 'Brazil',
    currency: 'BRL',
    flag: '🇧🇷'
  },
  {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    flag: '🇩🇪'
  },
  {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    flag: '🇫🇷'
  },
  {
    code: 'AE',
    name: 'UAE',
    currency: 'AED',
    flag: '🇦🇪'
  }
];

// Generate bills based on the selected country's currency
export const generateBills = (currency: string) => [
  {
    id: 'BILL-001',
    amount: 1000,
    currency,
    description: 'Software License',
    dueDate: '2024-04-01'
  },
  {
    id: 'BILL-002',
    amount: 750,
    currency,
    description: 'Consulting Services',
    dueDate: '2024-04-15'
  },
  {
    id: 'BILL-003',
    amount: 5000,
    currency,
    description: 'Hardware Purchase',
    dueDate: '2024-04-30'
  }
];