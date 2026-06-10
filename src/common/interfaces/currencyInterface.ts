export interface Currency {
  name: string;
  ticker: string;
  price: number;
}

export interface CurrencyWithId extends Currency {
  id: number;
}

export interface ExternalCurrency {
  symbol: string;
  price: number;
}
