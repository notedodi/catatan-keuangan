// User types
export interface User {
    uid: string;
    email: string;
    displayName?: string;
    settings: UserSettings;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSettings {
    monthStartDay: number; // 1-31
    theme: 'light' | 'dark';
}

// Category types
export interface Category {
    id: string;
    userId: string;
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
    createdAt: Date;
}

// Transaction types
export interface Transaction {
    id: string;
    userId: string;
    categoryId: string;
    type: 'income' | 'expense';
    amount: number;
    date: Date;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}

// Budget types
export interface Budget {
    id: string;
    userId: string;
    categoryId: string;
    month: number; // 1-12
    year: number;
    limitAmount: number;
    createdAt: Date;
}

// Summary types
export interface Summary {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    difference: number;
}

// Chart data types
export interface ChartData {
    name: string;
    value: number;
    color?: string;
}

export interface TrendData {
    date: string;
    income: number;
    expense: number;
}
