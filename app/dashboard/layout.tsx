"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { DataProvider } from "@/context/DataContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <DataProvider>
                <div className="flex min-h-screen bg-background">
                    {/* Desktop Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <main className="flex-1 w-full lg:ml-64">
                        <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-24 lg:pb-8">
                            {children}
                        </div>
                    </main>

                    {/* Mobile Bottom Navigation */}
                    <MobileNav />
                </div>
            </DataProvider>
        </ProtectedRoute>
    );
}
