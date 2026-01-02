"use client";

import { useState } from "react";
import { useReports, Period } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";

export default function ReportsPage() {
    const [period, setPeriod] = useState<Period>("month");
    const { summary, incomeExpenseData, categoryData, topCategories, periodDates } = useReports(period);

    const periodLabels = {
        week: "Minggu Ini",
        month: "Bulan Ini",
        year: "Tahun Ini",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Laporan</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(periodDates.start, "dd MMM yyyy")} - {formatDate(periodDates.end, "dd MMM yyyy")}
                    </p>
                </div>

                {/* Period Selector */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                        variant={period === "week" ? "default" : "outline"}
                        onClick={() => setPeriod("week")}
                        size="sm"
                        className="flex-1 sm:flex-initial"
                    >
                        Minggu
                    </Button>
                    <Button
                        variant={period === "month" ? "default" : "outline"}
                        onClick={() => setPeriod("month")}
                        size="sm"
                        className="flex-1 sm:flex-initial"
                    >
                        Bulan
                    </Button>
                    <Button
                        variant={period === "year" ? "default" : "outline"}
                        onClick={() => setPeriod("year")}
                        size="sm"
                        className="flex-1 sm:flex-initial"
                    >
                        Tahun
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">
                            Transaksi
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{summary.transactionCount}</div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            {periodLabels[period]}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">
                            Pemasukan
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-base sm:text-2xl font-bold text-green-600 dark:text-green-500">
                            {formatCurrency(summary.income)}
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            {periodLabels[period]}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">
                            Pengeluaran
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-base sm:text-2xl font-bold text-red-600 dark:text-red-500">
                            {formatCurrency(summary.expense)}
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            {periodLabels[period]}
                        </p>
                    </CardContent>
                </Card>

                <Card className={`bg-gradient-to-br shadow-sm ${summary.difference >= 0
                    ? "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800"
                    : "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800"
                    }`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">
                            Selisih
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-base sm:text-2xl font-bold ${summary.difference >= 0 ? "text-purple-600 dark:text-purple-500" : "text-orange-600 dark:text-orange-500"}`}>
                            {formatCurrency(Math.abs(summary.difference))}
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            {summary.difference >= 0 ? "Surplus" : "Defisit"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Pemasukan vs Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {incomeExpenseData.length > 0 ? (
                            <IncomeExpenseChart data={incomeExpenseData} />
                        ) : (
                            <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
                                Belum ada data transaksi
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Pengeluaran per Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryPieChart data={categoryData} />
                    </CardContent>
                </Card>
            </div>

            {/* Top Categories */}
            {topCategories.length > 0 && (
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Top 5 Kategori Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCategories.map((category, index) => (
                                <div key={index} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-lg sm:text-2xl font-bold text-muted-foreground w-6 flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm sm:text-base truncate">{category.name}</p>
                                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                                <div
                                                    className="h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${(category.value / summary.expense) * 100}%`,
                                                        backgroundColor: category.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-sm sm:text-base">{formatCurrency(category.value)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {((category.value / summary.expense) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
