"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { Transaction, Category } from "@/types";
import { toast } from "sonner";

interface DataContextType {
    transactions: Transaction[];
    categories: Category[];
    loading: boolean;
    addTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    addCategory: (category: Omit<Category, "id" | "userId" | "createdAt">) => Promise<void>;
    updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType>({
    transactions: [],
    categories: [],
    loading: true,
    addTransaction: async () => { },
    updateTransaction: async () => { },
    deleteTransaction: async () => { },
    addCategory: async () => { },
    updateCategory: async () => { },
    deleteCategory: async () => { },
});

export function DataProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setCategories([]);
            setLoading(false);
            return;
        }

        // Real-time listener for transactions
        const transactionsRef = collection(db, "transactions");
        const transactionsQuery = query(
            transactionsRef,
            where("userId", "==", user.uid),
            orderBy("date", "desc")
        );

        const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
            const fetchedTransactions: Transaction[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                fetchedTransactions.push({
                    id: doc.id,
                    ...data,
                    date: data.date.toDate(),
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt.toDate(),
                } as Transaction);
            });
            setTransactions(fetchedTransactions);
        });

        // Real-time listener for categories
        const categoriesRef = collection(db, "categories");
        const categoriesQuery = query(
            categoriesRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
            const fetchedCategories: Category[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                fetchedCategories.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt.toDate(),
                } as Category);
            });
            setCategories(fetchedCategories);
            setLoading(false);
        });

        return () => {
            unsubscribeTransactions();
            unsubscribeCategories();
        };
    }, [user]);

    // Transaction CRUD
    const addTransaction = async (transaction: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => {
        if (!user) return;

        try {
            await addDoc(collection(db, "transactions"), {
                ...transaction,
                userId: user.uid,
                date: Timestamp.fromDate(transaction.date),
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
            toast.success("Transaksi berhasil ditambahkan");
        } catch (error) {
            console.error("Error adding transaction:", error);
            toast.error("Gagal menambahkan transaksi");
            throw error;
        }
    };

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        try {
            const updateData: any = { ...updates, updatedAt: Timestamp.now() };
            if (updates.date) {
                updateData.date = Timestamp.fromDate(updates.date);
            }

            await updateDoc(doc(db, "transactions", id), updateData);
            toast.success("Transaksi berhasil diperbarui");
        } catch (error) {
            console.error("Error updating transaction:", error);
            toast.error("Gagal memperbarui transaksi");
            throw error;
        }
    };

    const deleteTransaction = async (id: string) => {
        try {
            await deleteDoc(doc(db, "transactions", id));
            toast.success("Transaksi berhasil dihapus");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            toast.error("Gagal menghapus transaksi");
            throw error;
        }
    };

    // Category CRUD
    const addCategory = async (category: Omit<Category, "id" | "userId" | "createdAt">) => {
        if (!user) return;

        try {
            await addDoc(collection(db, "categories"), {
                ...category,
                userId: user.uid,
                createdAt: Timestamp.now(),
            });
            toast.success("Kategori berhasil ditambahkan");
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Gagal menambahkan kategori");
            throw error;
        }
    };

    const updateCategory = async (id: string, updates: Partial<Category>) => {
        try {
            await updateDoc(doc(db, "categories", id), updates);
            toast.success("Kategori berhasil diperbarui");
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Gagal memperbarui kategori");
            throw error;
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            await deleteDoc(doc(db, "categories", id));
            toast.success("Kategori berhasil dihapus");
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Gagal menghapus kategori");
            throw error;
        }
    };

    return (
        <DataContext.Provider
            value={{
                transactions,
                categories,
                loading,
                addTransaction,
                updateTransaction,
                deleteTransaction,
                addCategory,
                updateCategory,
                deleteCategory,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within DataProvider");
    }
    return context;
}
