export interface Bill {
  id: string;
  amount: number;
  currency: string;
  description: string;
  dueDate: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

export interface ExchangeRate {
  rate: number;
  source: string;
  target: string;
}