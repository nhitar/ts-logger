export interface WalletWithId {
  id: number;
  address: string;
}

export interface WalletBalanceWithId {
  id: number;
  walletId: number;
  currencyId: number;
  amount: number;
}
