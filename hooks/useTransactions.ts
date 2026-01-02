"use client";

import { useData } from "@/context/DataContext";

// Simple wrapper to expose shared data without fetching
export function useTransactions() {
    const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useData();

    return {
        transactions,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refetch: () => { }, // No-op since we use real-time listeners
    };
}
