"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Plus, Pencil, Trash2,
    Wallet, Home, Utensils, Car, ShoppingCart, Heart,
    GraduationCap, Gamepad2, Shirt, Plane, Smartphone, Zap,
    Coffee, Gift, Briefcase, Film
} from "lucide-react";
import { Category } from "@/types";
import { LucideIcon } from "lucide-react";

// Icon mapping - use Lucide icons instead of emoji
const iconOptions: { icon: LucideIcon; name: string }[] = [
    { icon: Wallet, name: "wallet" },
    { icon: Home, name: "home" },
    { icon: Utensils, name: "utensils" },
    { icon: Car, name: "car" },
    { icon: ShoppingCart, name: "cart" },
    { icon: Heart, name: "heart" },
    { icon: GraduationCap, name: "education" },
    { icon: Gamepad2, name: "game" },
    { icon: Shirt, name: "clothes" },
    { icon: Plane, name: "travel" },
    { icon: Smartphone, name: "phone" },
    { icon: Zap, name: "electric" },
    { icon: Coffee, name: "coffee" },
    { icon: Gift, name: "gift" },
    { icon: Briefcase, name: "work" },
    { icon: Film, name: "entertainment" },
];

const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function CategoriesPage() {
    const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "expense" as "income" | "expense",
        icon: "wallet",
        color: "#3b82f6",
    });

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                type: category.type,
                icon: category.icon,
                color: category.color,
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: "",
                type: "expense",
                icon: "wallet",
                color: "#3b82f6",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await addCategory(formData);
            }
            setIsDialogOpen(false);
            setEditingCategory(null);
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Yakin ingin menghapus kategori ini?")) {
            try {
                await deleteCategory(id);
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const getIconComponent = (iconName: string) => {
        const iconOption = iconOptions.find(opt => opt.name === iconName);
        return iconOption ? iconOption.icon : Wallet;
    };

    const incomeCategories = categories.filter(cat => cat.type === "income");
    const expenseCategories = categories.filter(cat => cat.type === "expense");

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Memuat kategori...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Kategori</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                        Kelola kategori transaksi Anda
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2 hidden sm:flex">
                    <Plus className="w-4 h-4" />
                    Tambah
                </Button>
            </div>

            {/* Categories Grid */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Income Categories */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Pemasukan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {incomeCategories.length === 0 ? (
                            <p className="text-center py-8 text-sm text-muted-foreground">
                                Belum ada kategori pemasukan
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {incomeCategories.map((category) => {
                                    const IconComponent = getIconComponent(category.icon);
                                    return (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: category.color + "20" }}
                                                >
                                                    <IconComponent className="w-5 h-5" style={{ color: category.color }} />
                                                </div>
                                                <span className="font-medium text-sm sm:text-base">{category.name}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => handleOpenDialog(category)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Expense Categories */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {expenseCategories.length === 0 ? (
                            <p className="text-center py-8 text-sm text-muted-foreground">
                                Belum ada kategori pengeluaran
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {expenseCategories.map((category) => {
                                    const IconComponent = getIconComponent(category.icon);
                                    return (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: category.color + "20" }}
                                                >
                                                    <IconComponent className="w-5 h-5" style={{ color: category.color }} />
                                                </div>
                                                <span className="font-medium text-sm sm:text-base">{category.name}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => handleOpenDialog(category)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Mobile FAB */}
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
                            {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Ubah kategori transaksi Anda"
                                : "Tambahkan kategori baru untuk mengorganisir transaksi"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Kategori</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Gaji, Makan, Transport"
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">Jenis</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: "income" | "expense") =>
                                        setFormData({ ...formData, type: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Pemasukan</SelectItem>
                                        <SelectItem value="expense">Pengeluaran</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Icon</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {iconOptions.map(({ icon: Icon, name }) => (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: name })}
                                            className={`p-3 rounded-lg border-2 transition-all ${formData.icon === name
                                                    ? "border-primary bg-primary/10 scale-105"
                                                    : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <Icon className="w-6 h-6 mx-auto" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Warna</Label>
                                <div className="grid grid-cols-8 gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-10 h-10 rounded-lg border-2 transition-all ${formData.color === color
                                                    ? "border-foreground scale-110"
                                                    : "border-transparent"
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                {editingCategory ? "Simpan" : "Tambah"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
