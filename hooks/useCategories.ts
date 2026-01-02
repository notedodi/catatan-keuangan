"use client";

import { useData } from "@/context/DataContext";

// Simple wrapper to expose shared data without fetching
export function useCategories() {
    const { categories, loading, addCategory, updateCategory, deleteCategory } = useData();

    return {
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        refetch: () => { }, // No-op since we use real-time listeners
    };
}
