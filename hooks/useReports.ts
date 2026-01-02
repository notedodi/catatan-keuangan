"use client";

import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { useCategories } from "./useCategories";
import { startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format, isWithinInterval } from "date-fns";
import { id } from "date-fns/locale";

export type Period = "week" | "month" | "year";

export function useReports(period: Period = "month") {
    const { transactions } = useTransactions();
    const { categories } = useCategories();

    // Get period dates
    const periodDates = useMemo(() => {
        const now = new Date();

        switch (period) {
            case "week":
                return {
                    start: startOfWeek(now, { weekStartsOn: 1 }),
                    end: endOfWeek(now, { weekStartsOn: 1 }),
                };
            case "month":
                return {
                    start: startOfMonth(now),
                    end: endOfMonth(now),
                };
            case "year":
                return {
                    start: startOfYear(now),
                    end: endOfYear(now),
                };
        }
    }, [period]);

    // Filter transactions by period
    const periodTransactions = useMemo(() => {
        return transactions.filter((t) =>
            isWithinInterval(new Date(t.date), periodDates)
        );
    }, [transactions, periodDates]);

    // Calculate summary
    const summary = useMemo(() => {
        const income = periodTransactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = periodTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expense,
            difference: income - expense,
            transactionCount: periodTransactions.length,
        };
    }, [periodTransactions]);

    // Income vs Expense chart data
    const incomeExpenseData = useMemo(() => {
        let intervals: Date[] = [];

        switch (period) {
            case "week":
                intervals = eachDayOfInterval(periodDates);
                break;
            case "month":
                intervals = eachDayOfInterval(periodDates);
                break;
            case "year":
                intervals = eachMonthOfInterval(periodDates);
                break;
        }

        return intervals.map((date) => {
            const dayTransactions = periodTransactions.filter((t) => {
                const transactionDate = new Date(t.date);

                if (period === "year") {
                    // For year view, group by month
                    return (
                        transactionDate.getMonth() === date.getMonth() &&
                        transactionDate.getFullYear() === date.getFullYear()
                    );
                } else {
                    // For week/month view, group by day
                    return (
                        transactionDate.getDate() === date.getDate() &&
                        transactionDate.getMonth() === date.getMonth() &&
                        transactionDate.getFullYear() === date.getFullYear()
                    );
                }
            });

            const income = dayTransactions
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = dayTransactions
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                date: period === "year" ? format(date, "MMM", { locale: id }) : format(date, "dd MMM", { locale: id }),
                income,
                expense,
            };
        });
    }, [period, periodDates, periodTransactions]);

    // Category breakdown (expenses only)
    const categoryData = useMemo(() => {
        const expenseTransactions = periodTransactions.filter((t) => t.type === "expense");

        const categoryTotals = new Map<string, number>();

        expenseTransactions.forEach((t) => {
            const current = categoryTotals.get(t.categoryId) || 0;
            categoryTotals.set(t.categoryId, current + t.amount);
        });

        return Array.from(categoryTotals.entries())
            .map(([categoryId, amount]) => {
                const category = categories.find((c) => c.id === categoryId);
                return {
                    name: category ? `${category.icon} ${category.name}` : "Unknown",
                    value: amount,
                    color: category?.color || "#888888",
                };
            })
            .sort((a, b) => b.value - a.value);
    }, [periodTransactions, categories]);

    // Top categories
    const topCategories = useMemo(() => {
        return categoryData.slice(0, 5);
    }, [categoryData]);

    return {
        summary,
        incomeExpenseData,
        categoryData,
        topCategories,
        periodDates,
        periodTransactions,
    };
}
