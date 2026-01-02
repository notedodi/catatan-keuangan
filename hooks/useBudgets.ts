"use client";

import { useEffect, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp,
} from "firebase/firestore";
import { Budget } from "@/types";
import { toast } from "sonner";
import { useState } from "react";

export type BudgetStatus = "safe" | "warning" | "danger" | "exceeded";

export interface BudgetWithSpending extends Budget {
    actualSpending: number;
    percentage: number;
    status: BudgetStatus;
    remaining: number;
}

export function useBudgets(month?: number, year?: number) {
    const { user } = useAuth();
    const { transactions } = useData(); // Use shared data
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);

    // Use current month/year if not provided
    const now = new Date();
    const selectedMonth = month ?? now.getMonth() + 1;
    const selectedYear = year ?? now.getFullYear();

    const fetchBudgets = async () => {
        if (!user) return;

        try {
            const budgetsRef = collection(db, "budgets");
            const q = query(
                budgetsRef,
                where("userId", "==", user.uid),
                where("month", "==", selectedMonth),
                where("year", "==", selectedYear)
            );

            const querySnapshot = await getDocs(q);
            const fetchedBudgets: Budget[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedBudgets.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt.toDate(),
                } as Budget);
            });

            setBudgets(fetchedBudgets);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, [user, selectedMonth, selectedYear]);

    // Calculate budgets with spending
    const budgetsWithSpending: BudgetWithSpending[] = useMemo(() => {
        return budgets.map((budget) => {
            // Calculate actual spending for this category in this month
            const categorySpending = transactions
                .filter((t) => {
                    const transactionDate = new Date(t.date);
                    return (
                        t.type === "expense" &&
                        t.categoryId === budget.categoryId &&
                        transactionDate.getMonth() + 1 === selectedMonth &&
                        transactionDate.getFullYear() === selectedYear
                    );
                })
                .reduce((sum, t) => sum + t.amount, 0);

            const percentage = (categorySpending / budget.limitAmount) * 100;
            const remaining = budget.limitAmount - categorySpending;

            let status: BudgetStatus = "safe";
            if (percentage >= 100) {
                status = "exceeded";
            } else if (percentage >= 80) {
                status = "danger";
            } else if (percentage >= 60) {
                status = "warning";
            }

            return {
                ...budget,
                actualSpending: categorySpending,
                percentage,
                status,
                remaining,
            };
        });
    }, [budgets, transactions, selectedMonth, selectedYear]);

    const addBudget = async (budget: Omit<Budget, "id" | "userId" | "createdAt">) => {
        if (!user) return;

        try {
            await addDoc(collection(db, "budgets"), {
                ...budget,
                userId: user.uid,
                createdAt: Timestamp.now(),
            });
            await fetchBudgets();
            toast.success("Budget berhasil ditambahkan");
        } catch (error) {
            console.error("Error adding budget:", error);
            toast.error("Gagal menambahkan budget");
            throw error;
        }
    };

    const updateBudget = async (id: string, updates: Partial<Budget>) => {
        try {
            await updateDoc(doc(db, "budgets", id), updates);
            await fetchBudgets();
            toast.success("Budget berhasil diperbarui");
        } catch (error) {
            console.error("Error updating budget:", error);
            toast.error("Gagal memperb arui budget");
            throw error;
        }
    };

    const deleteBudget = async (id: string) => {
        try {
            await deleteDoc(doc(db, "budgets", id));
            await fetchBudgets();
            toast.success("Budget berhasil dihapus");
        } catch (error) {
            console.error("Error deleting budget:", error);
            toast.error("Gagal menghapus budget");
            throw error;
        }
    };

    return {
        budgets: budgetsWithSpending,
        loading,
        addBudget,
        updateBudget,
        deleteBudget,
        refetch: fetchBudgets,
    };
}
