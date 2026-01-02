"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Receipt,
    History,
    PieChart,
    Target,
    Settings,
    FolderOpen,
} from "lucide-react";

const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transaksi", href: "/dashboard/transactions", icon: Receipt },
    { name: "Kategori", href: "/dashboard/categories", icon: FolderOpen },
    { name: "Riwayat", href: "/dashboard/history", icon: History },
    { name: "Laporan", href: "/dashboard/reports", icon: PieChart },
    { name: "Budget", href: "/dashboard/budgets", icon: Target },
    { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border h-screen fixed top-0 left-0 z-40">
            {/* Logo */}
            <div className="px-6 py-8 border-b border-border">
                <h1 className="text-xl font-bold text-foreground">Catatan Keuangan</h1>
                <p className="text-sm text-muted-foreground mt-1">Finance Tracker</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
