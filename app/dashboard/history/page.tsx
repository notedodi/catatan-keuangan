"use client";

import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Download, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function HistoryPage() {
    const { transactions, loading } = useTransactions();
    const { categories } = useCategories();
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");

    // Apply filters
    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            if (searchQuery && !transaction.note.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (selectedType !== "all" && transaction.type !== selectedType) {
                return false;
            }
            if (selectedCategory !== "all" && transaction.categoryId !== selectedCategory) {
                return false;
            }

            const transactionDate = new Date(transaction.date);
            if (startDate && new Date(startDate) > transactionDate) return false;
            if (endDate && new Date(endDate) < transactionDate) return false;
            if (selectedMonth !== "all" && transactionDate.getMonth() !== parseInt(selectedMonth)) return false;
            if (selectedYear !== "all" && transactionDate.getFullYear() !== parseInt(selectedYear)) return false;

            return true;
        });
    }, [transactions, searchQuery, selectedType, selectedCategory, startDate, endDate, selectedMonth, selectedYear]);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedType("all");
        setSelectedCategory("all");
        setStartDate("");
        setEndDate("");
        setSelectedMonth("all");
        setSelectedYear("all");
    };

    const hasActiveFilters = searchQuery || selectedType !== "all" || selectedCategory !== "all" || startDate || endDate || selectedMonth !== "all" || selectedYear !== "all";

    const exportToCSV = () => {
        const headers = ["Tanggal", "Jenis", "Kategori", "Nominal", "Catatan"];
        const rows = filteredTransactions.map((t) => {
            const category = categories.find((c) => c.id === t.categoryId);
            return [
                new Date(t.date).toLocaleDateString("id-ID"),
                t.type === "income" ? "Pemasukan" : "Pengeluaran",
                category?.name || "-",
                t.amount,
                t.note || "-",
            ];
        });

        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transaksi_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const years = useMemo(() => {
        const uniqueYears = new Set(transactions.map((t) => new Date(t.date).getFullYear()));
        return Array.from(uniqueYears).sort((a, b) => b - a);
    }, [transactions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Memuat riwayat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Riwayat</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                        {filteredTransactions.length} transaksi ditemukan
                    </p>
                </div>
                <Button
                    onClick={exportToCSV}
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                    disabled={filteredTransactions.length === 0}
                >
                    <Download className="w-4 h-4" />
                    <span className="sm:inline">Export CSV</span>
                </Button>
            </div>

            {/* Filter Toggle Button - Mobile */}
            <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full sm:hidden gap-2"
            >
                <Filter className="w-4 h-4" />
                Filter Transaksi
                {showFilters ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
            </Button>

            {/* Filter Panel */}
            <Card className={`shadow-sm ${!showFilters && "hidden sm:block"}`}>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                            Filter
                        </CardTitle>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-2 text-xs sm:text-sm">
                                <X className="w-4 h-4" />
                                Reset
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search" className="text-sm">Cari</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Cari catatan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-11"
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label className="text-sm">Jenis</Label>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    <SelectItem value="income">Pemasukan</SelectItem>
                                    <SelectItem value="expense">Pengeluaran</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label className="text-sm">Kategori</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.icon} {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date From */}
                        <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-sm">Dari</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-11"
                            />
                        </div>

                        {/* Date To */}
                        <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-sm">Sampai</Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-11"
                            />
                        </div>

                        {/* Month */}
                        <div className="space-y-2">
                            <Label className="text-sm">Bulan</Label>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"].map((month, idx) => (
                                        <SelectItem key={idx} value={idx.toString()}>{month}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Year */}
                        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                            <Label className="text-sm">Tahun</Label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <Card className="shadow-sm">
                <CardContent className="p-3 sm:p-6">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Tidak ada transaksi ditemukan</p>
                        </div>
                    ) : (
                        <div className="space-y-2 sm:space-y-3">
                            {filteredTransactions.map((transaction) => {
                                const category = categories.find(c => c.id === transaction.categoryId);
                                return (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center gap-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {category && <span className="text-lg">{category.icon}</span>}
                                                <p className="font-medium text-sm sm:text-base truncate">
                                                    {transaction.note || "Tanpa catatan"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                                <span>{category?.name || "Tanpa kategori"}</span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(transaction.date).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`font-semibold text-sm sm:text-base whitespace-nowrap ${transaction.type === "income" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                                            }`}>
                                            {transaction.type === "income" ? "+" : "-"}
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
