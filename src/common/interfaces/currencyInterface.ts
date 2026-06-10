export interface Currency {
  name: string;
  ticker: string;
  price: number;
}

export interface CurrencyWithId extends Currency {
  id: number;
}
