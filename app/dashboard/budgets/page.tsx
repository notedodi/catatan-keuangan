"use client";

import { useState } from "react";
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, AlertTriangle, CheckCircle2, AlertCircle, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function BudgetsPage() {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const { budgets, loading, addBudget, updateBudget, deleteBudget } = useBudgets(selectedMonth, selectedYear);
    const { categories } = useCategories();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<any>(null);
    const [formData, setFormData] = useState({
        categoryId: "",
        limitAmount: "",
    });

    const handleOpenDialog = (budget?: any) => {
        if (budget) {
            setEditingBudget(budget);
            setFormData({
                categoryId: budget.categoryId,
                limitAmount: budget.limitAmount.toString(),
            });
        } else {
            setEditingBudget(null);
            setFormData({
                categoryId: "",
                limitAmount: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const budgetData = {
                categoryId: formData.categoryId,
                limitAmount: parseFloat(formData.limitAmount),
                month: selectedMonth,
                year: selectedYear,
            };

            if (editingBudget) {
                await updateBudget(editingBudget.id, budgetData);
            } else {
                await addBudget(budgetData);
            }

            setIsDialogOpen(false);
            setEditingBudget(null);
        } catch (error) {
            console.error("Error saving budget:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Yakin ingin menghapus budget ini?")) {
            try {
                await deleteBudget(id);
            } catch (error) {
                console.error("Error deleting budget:", error);
            }
        }
    };

    const availableCategories = categories.filter(
        cat => cat.type === "expense" && !budgets.some(b => b.categoryId === cat.id)
    );

    const getStatusIcon = (percentage: number) => {
        if (percentage >= 100) return <AlertTriangle className="w-5 h-5 text-red-500" />;
        if (percentage >= 80) return <AlertCircle className="w-5 h-5 text-orange-500" />;
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return "bg-red-500";
        if (percentage >= 80) return "bg-orange-500";
        return "bg-green-500";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Memuat budget...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Budget</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                        Atur dan pantau budget per kategori
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2 hidden sm:flex" disabled={availableCategories.length === 0}>
                    <Plus className="w-4 h-4" />
                    Tambah
                </Button>
            </div>

            {/* Period Selector */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-2">
                    <Label className="text-sm">Bulan</Label>
                    <Select value={selectedMonth.toString()} onValueChange={(val) => setSelectedMonth(parseInt(val))}>
                        <SelectTrigger className="h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((month, idx) => (
                                <SelectItem key={idx} value={(idx + 1).toString()}>{month}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 space-y-2">
                    <Label className="text-sm">Tahun</Label>
                    <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                        <SelectTrigger className="h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[2024, 2025, 2026, 2027].map((year) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Budgets List */}
            <Card className="shadow-sm">
                <CardContent className="p-3 sm:p-6">
                    {budgets.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Belum ada budget untuk periode ini</p>
                            <p className="text-sm mt-1">Tap tombol + untuk menambah budget</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {budgets.map((budget) => {
                                const category = categories.find(c => c.id === budget.categoryId);
                                const percentage = budget.percentage;

                                return (
                                    <div key={budget.id} className="p-4 border border-border rounded-lg space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                {getStatusIcon(percentage)}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-sm sm:text-base truncate">
                                                        {category?.name || "Unknown"}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                                        {formatCurrency(budget.actualSpending)} / {formatCurrency(budget.limitAmount)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => handleOpenDialog(budget)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => handleDelete(budget.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-1.5">
                                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                                <div
                                                    className={`h-3 rounded-full transition-all ${getProgressColor(percentage)}`}
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{percentage.toFixed(1)}%</span>
                                                <span className={percentage >= 100 ? "text-red-600 font-medium" : ""}>
                                                    Sisa: {formatCurrency(budget.remaining)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Mobile FAB */}
            <Button
                onClick={() => handleOpenDialog()}
                className="sm:hidden fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-40"
                size="icon"
                disabled={availableCategories.length === 0}
            >
                <Plus className="w-6 h-6" />
            </Button>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingBudget ? "Edit Budget" : "Tambah Budget"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingBudget
                                ? "Ubah limit budget kategori"
                                : "Tetapkan limit budget untuk kategori pengeluaran"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                                    disabled={!!editingBudget}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {editingBudget ? (
                                            <SelectItem value={editingBudget.categoryId}>
                                                {categories.find(c => c.id === editingBudget.categoryId)?.name}
                                            </SelectItem>
                                        ) : (
                                            availableCategories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.icon} {category.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="limit">Limit Budget (Rp)</Label>
                                <Input
                                    id="limit"
                                    type="number"
                                    placeholder="0"
                                    value={formData.limitAmount}
                                    onChange={(e) => setFormData({ ...formData, limitAmount: e.target.value })}
                                    required
                                    className="h-12"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                {editingBudget ? "Simpan" : "Tambah"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
