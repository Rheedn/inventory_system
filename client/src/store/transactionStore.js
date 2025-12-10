import {create} from 'zustand'
export const useTransactionStore = create((set, get) => ({
  transactions: [],
  totalTransactions: 0,
  loadingTransactions: false,
  transactionError: null,
  fetchTransactions: async (params = {}) => {
    set({ loadingTransactions: true, transactionError: null });
    try {
      const response = await fetch(`/api/transactions?${new URLSearchParams(params)}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      set({ transactions: data.transactions, totalTransactions: data.total });
    } catch (error) {
      set({ transactionError: error.message });
    } finally {
      set({ loadingTransactions: false });
    }
  },
}));