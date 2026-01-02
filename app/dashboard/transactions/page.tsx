"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";

export default function TransactionsPage() {
    const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
    const { categories } = useCategories();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [formData, setFormData] = useState({
        type: "expense" as "income" | "expense",
        amount: "",
        categoryId: "",
        date: new Date().toISOString().split('T')[0],
        note: "",
    });

    const handleOpenDialog = (transaction?: Transaction) => {
        if (transaction) {
            setEditingTransaction(transaction);
            setFormData({
                type: transaction.type,
                amount: transaction.amount.toString(),
                categoryId: transaction.categoryId,
                date: new Date(transaction.date).toISOString().split('T')[0],
                note: transaction.note,
            });
        } else {
            setEditingTransaction(null);
            setFormData({
                type: "expense",
                amount: "",
                categoryId: "",
                date: new Date().toISOString().split('T')[0],
                note: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingTransaction(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const transactionData = {
                type: formData.type,
                amount: parseFloat(formData.amount),
                categoryId: formData.categoryId,
                date: new Date(formData.date),
                note: formData.note,
            };

            if (editingTransaction) {
                await updateTransaction(editingTransaction.id, transactionData);
            } else {
                await addTransaction(transactionData);
            }

            handleCloseDialog();
        } catch (error) {
            console.error("Error saving transaction:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Yakin ingin menghapus transaksi ini?")) {
            try {
                await deleteTransaction(id);
            } catch (error) {
                console.error("Error deleting transaction:", error);
            }
        }
    };

    const filteredCategories = categories.filter(cat => cat.type === formData.type);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Memuat transaksi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Transaksi</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                        Kelola semua transaksi Anda
                    </p>
                </div>
                {/* Desktop Button */}
                <Button onClick={() => handleOpenDialog()} className="gap-2 hidden sm:flex">
                    <Plus className="w-4 h-4" />
                    Tambah
                </Button>
            </div>

            {/* Transactions List */}
            <Card className="shadow-sm">
                <CardContent className="p-3 sm:p-6">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Belum ada transaksi.</p>
                            <p className="text-sm mt-1">Tap tombol + untuk menambah transaksi</p>
                        </div>
                    ) : (
                        <div className="space-y-2 sm:space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center gap-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm sm:text-base truncate">
                                            {transaction.note || "Tanpa catatan"}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                            {new Date(transaction.date).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className={`font-semibold text-sm sm:text-base whitespace-nowrap ${transaction.type === "income" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                                            }`}>
                                            {transaction.type === "income" ? "+" : "-"}
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                        <div className="flex gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                                onClick={() => handleOpenDialog(transaction)}
                                            >
                                                <Pencil className="w-4 h4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 sm:h-9 sm:w-9"
                                                onClick={() => handleDelete(transaction.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Mobile Floating Action Button */}
            <Button
                onClick={() => handleOpenDialog()}
                className="sm:hidden fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-40"
                size="icon"
            >
                <Plus className="w-6 h-6" />
            </Button>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTransaction
                                ? "Ubah data transaksi Anda"
                                : "Tambahkan transaksi baru ke catatan keuangan Anda"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Jenis Transaksi</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: "income" | "expense") => {
                                        setFormData({ ...formData, type: value, categoryId: "" });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Pemasukan</SelectItem>
                                        <SelectItem value="expense">Pengeluaran</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="amount">Jumlah (Rp)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.icon} {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="date">Tanggal</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="note">Catatan</Label>
                                <Input
                                    id="note"
                                    type="text"
                                    placeholder="Catatan transaksi (opsional)"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    className="h-12"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                Batal
                            </Button>
                            <Button type="submit">
                                {editingTransaction ? "Simpan" : "Tambah"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
