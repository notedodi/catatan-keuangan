"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";
import SummaryCard from "@/components/dashboard/SummaryCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        difference: 0,
    });
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

                const transactionsRef = collection(db, "transactions");
                const q = query(
                    transactionsRef,
                    where("userId", "==", user.uid),
                    orderBy("date", "desc")
                );

                const querySnapshot = await getDocs(q);
                const transactions: Transaction[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    transactions.push({
                        id: doc.id,
                        ...data,
                        date: data.date.toDate(),
                        createdAt: data.createdAt.toDate(),
                        updatedAt: data.updatedAt.toDate(),
                    } as Transaction);
                });

                let totalBalance = 0;
                let monthlyIncome = 0;
                let monthlyExpense = 0;

                transactions.forEach((transaction) => {
                    const amount = transaction.amount;
                    if (transaction.type === "income") {
                        totalBalance += amount;
                    } else {
                        totalBalance -= amount;
                    }

                    if (transaction.date >= startOfMonth && transaction.date <= endOfMonth) {
                        if (transaction.type === "income") {
                            monthlyIncome += amount;
                        } else {
                            monthlyExpense += amount;
                        }
                    }
                });

                setSummary({
                    totalBalance,
                    monthlyIncome,
                    monthlyExpense,
                    difference: monthlyIncome - monthlyExpense,
                });

                setRecentTransactions(transactions.slice(0, 5));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Ringkasan keuangan Anda
                </p>
            </div>

            {/* Summary Cards - Mobile: 2 cols, Desktop: 4 cols */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <SummaryCard
                    title="Total Saldo"
                    value={formatCurrency(summary.totalBalance)}
                    icon={Wallet}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800"
                />
                <SummaryCard
                    title="Pemasukan"
                    value={formatCurrency(summary.monthlyIncome)}
                    icon={TrendingUp}
                    className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800"
                />
                <SummaryCard
                    title="Pengeluaran"
                    value={formatCurrency(summary.monthlyExpense)}
                    icon={TrendingDown}
                    className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800"
                />
                <SummaryCard
                    title="Selisih"
                    value={formatCurrency(summary.difference)}
                    icon={DollarSign}
                    className={summary.difference >= 0
                        ? "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800"
                        : "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800"
                    }
                />
            </div>

            {/* Recent Transactions */}
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg sm:text-xl">Transaksi Terbaru</CardTitle>
                        <Link href="/dashboard/transactions">
                            <Button variant="ghost" size="sm" className="gap-1 text-sm">
                                Lihat Semua
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Belum ada transaksi.</p>
                            <Link href="/dashboard/transactions">
                                <Button className="mt-4">Tambah Transaksi Pertama</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm sm:text-base truncate">
                                            {transaction.note || "Tanpa catatan"}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                            {new Date(transaction.date).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <span className={`font-semibold text-sm sm:text-base whitespace-nowrap ml-2 ${transaction.type === "income" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                                        }`}>
                                        {transaction.type === "income" ? "+" : "-"}
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
