import { StockItem, ExpenseItem, StaffAccount, SaleItem } from './types';

// Prepopulate with premium Khmer durian varieties matching user requirements and screenshots
export const INITIAL_STOCK: StockItem[] = [
  {
    id: 'stock_1',
    code: '001',
    name: 'សាច់ទឹកដោះគោខ្ទិះ',
    buyPrice: 14000,
    sellPrice: 18000,
    dateAdded: '2026-06-17',
    purchaseDate: '2026-06-17',
    totalStock: 150,
    remainingStock: 46.5,
    remainingFleshStock: 15.0,
    lowStockThreshold: 10,
  },
  {
    id: 'stock_2',
    code: '002',
    name: 'ទុរេនរី៦ (Ri6)',
    buyPrice: 11000,
    sellPrice: 15000,
    dateAdded: '2026-06-18',
    purchaseDate: '2026-06-18',
    totalStock: 100,
    remainingStock: 8.2, // This triggers low stock alert (< 10kg)
    remainingFleshStock: 2.5,
    lowStockThreshold: 10,
  },
  {
    id: 'stock_3',
    code: '003',
    name: 'ទុរេន ឪខាក',
    buyPrice: 16000,
    sellPrice: 21000,
    dateAdded: '2026-06-15',
    purchaseDate: '2026-06-15',
    totalStock: 80,
    remainingStock: 24.0,
    remainingFleshStock: 8.0,
    lowStockThreshold: 10,
  }
];

export const INITIAL_STAFF: StaffAccount[] = [
  {
    id: 'staff_1',
    name: 'វ៉ែន ចាន់បូរ៉ា',
    phone: '087567956',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'staff_2',
    name: 'បុគ្គលិក តាមដាន',
    phone: '012345678',
    role: 'staff',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp_1',
    category: 'fuel',
    description: 'ចាក់សាំងម៉ូតូដឹកទុរេនឱ្យម៉ូយ',
    amountKhr: 15000,
    date: '2026-06-19',
  },
  {
    id: 'exp_2',
    category: 'gas',
    description: 'ចាក់ហ្គាសឡានដឹកទុរេនពីចម្ការកំពត',
    amountKhr: 120000,
    date: '2026-06-19',
  },
  {
    id: 'exp_3',
    category: 'salary',
    description: 'បើកប្រាក់ខែបុគ្គលិកលក់ប្រចាំថ្ងៃ',
    amountKhr: 50000,
    date: '2026-06-18',
  }
];

export const INITIAL_SALES: SaleItem[] = [
  {
    id: 'sale_1',
    stockItemId: 'stock_1',
    name: 'សាច់ទឹកដោះគោខ្ទិះ',
    code: 'M-0001',
    mode: 'fruit',
    weight: 3.0,
    price: 18000,
    paymentMethod: 'cash',
    amountPaidKhr: 54000,
    amountPaidUsd: 13.50,
    changeKhr: 0,
    date: '2026-06-19',
  }
];

export const KHMER_FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap');
`;
