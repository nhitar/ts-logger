export interface WalletWithId {
  id: number;
  address: string;
}

export interface WalletBalanceWithId {
  id: number;
  wallet_id: number;
  currency_id: number;
  amount: number;
}
